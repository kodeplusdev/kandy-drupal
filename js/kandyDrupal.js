/**
 * @file
 * KANDY SETUP AND LISTENER CALLBACK.
 */

(function () {

  'use strict';

  var last_seen_interval;
  var activeContainerId;
  var kandyPresence = {};
  // Create audio objects to play incoming calls and outgoing calls sound.
  var $audioRingIn = jQuery('<audio>', {loop: 'loop', id: 'ring-in'});
  var $audioRingOut = jQuery('<audio>', {loop: 'loop', id: 'ring-out'});

  // Load audio source to DOM to indicate call events.
  var audioSource = {
    ringIn: [
      {src: 'https://kandy-portal.s3.amazonaws.com/public/sounds/ringin.mp3', type: 'audio/mp3'},
      {src: 'https://kandy-portal.s3.amazonaws.com/public/sounds/ringin.ogg', type: 'audio/ogg'}
    ],
    ringOut: [
      {src: 'https://kandy-portal.s3.amazonaws.com/public/sounds/ringout.mp3', type: 'audio/mp3'},
      {src: 'https://kandy-portal.s3.amazonaws.com/public/sounds/ringout.ogg', type: 'audio/ogg'}
    ]
  };

  audioSource.ringIn.forEach(function (entry) {
    var $source = jQuery('<source>').attr('src', entry.src);
    $audioRingIn.append($source);
  });

  audioSource.ringOut.forEach(function (entry) {
    var $source = jQuery('<source>').attr('src', entry.src);
    $audioRingOut.append($source);
  });

  var displayNames = [];
  var userEmails = [];

  function kandyOnCallHold(call) {
    var callId = call.getId();
    var target = jQuery('.kandyButton[data-call-id="' + callId + '"]');
    changeAnswerButtonState('CALL_HOLD', target);
  }

  function kandyOnCallUnhold(call) {
    var callId = call.getId();
    var target = jQuery('.kandyButton[data-call-id="' + callId + '"]');
    changeAnswerButtonState('CALL_UNHOLD', target);
  }

  var setup = function () {
    // Initialize kandy, passing a config JSON object that contains listeners (event callbacks).
    kandy.setup({
      kandyApiUrl: 'https://api.kandy.io/v1.2',
      remoteVideoContainer: jQuery('#theirVideo')[0],
      localVideoContainer: jQuery('#myVideo')[0],
      screensharing: {
        chromeExtensionId: 'daohbhpgnnlgkipndobecbmahalalhcp'
      },

      // Respond to Kandy events.
      listeners: {
        callincoming: kandyIncomingCallCalback,
        // When an outgoing call is connected.
        oncall: kandyOnCallCallback,
        // When an incoming call is connected.
        // You indicated that you are answering the call.
        callanswered: kandyCallAnsweredCallback,
        callended: kandyCallEndedCallback,
        callendedfailed: kandyOnCallEndedFailed,
        callinitiated: kandyOnCallInitiate,
        callinitiatefailed: kandyOnCallInitiateFail,
        callrejected: kandyOnCallRejected,
        media: kandyOnMediaError,
        callhold: kandyOnCallHold,
        callunhold: kandyOnCallUnhold
      }
    });
    if (jQuery('.kandyChat').length) {
      kandy.setup({
        listeners: {
          message: kandyOnMessage,
          chatGroupMessage: kandyOnGroupMessage,
          chatGroupInvite: kandyOnGroupInvite,
          chatGroupBoot: kandyOnRemoveFromGroup,
          chatGroupLeave: kandyOnLeaveGroup,
          chatGroupUpdate: '',
          chatGroupDelete: kandyOnTerminateGroup
        }
      });
    }
  };

  /**
   * Login Success Callback.
   */
  var kandyLoginSuccessCallback = function () {
    kandy.getLastSeen([Drupal.settings.loginInfo.username]);
    // Have kandy Address Book widget.
    if (jQuery('.kandyAddressBook').length) {
      kandyLoadContactsAddressbook();
    }
    // Have kandy Chat widget.
    if (jQuery('.kandyChat').length) {
      kandyLoadContactsChat();
      kandyLoadGroups();
      setTimeout(updateUserGroupStatus, 3000);
    }

    if (jQuery('#coBrowsing').length) {
      kandyGetOpenSessionsByType('cobrowsing', loadSessionList);
    }

    // Call user callback.
    if (typeof LoginSuccessCallback === 'function') {
      LoginSuccessCallback();
    }

    // Call user logout if exists.
    if (typeof kandy_logout === 'function') {
      kandy_logout();
    }
  };

  /**
   * Login Fail Callback.
   */
  var kandyLoginFailedCallback = function () {
    if (typeof loginFailedCallback === 'function') {
      loginFailedCallback();
    }
  };

  /**
   * Status Notification Callback.
   *
   * @param {string} userId
   *   Kandy user id
   * @param {string} state
   *   State of user
   * @param {string} description
   *   State description
   */
  var kandyPresenceNotificationCallback = function (userId, state, description) {
    // HTML id can't contain @ and jquery doesn't like periods (in id).
    var id_attrib = '.kandyAddressBook .kandyAddressContactList #presence_' + userId.replace(/[.@]/g, '_');
    jQuery(id_attrib).text(description);
    if (typeof presenceNotificationCallback === 'function') {
      presenceNotificationCallback(userId, state, description);
    }

    // Update chat status.
    if (jQuery('.kandyChat').length > 0) {
      var liUser = jQuery('.kandyChat .cd-tabs-navigation li#' + userId.replace(/[.@]/g, '_'));
      var statusItem = liUser.find('i.status');
      statusItem.text(description);

      liUser.removeClass().addClass('kandy-chat-status-' + description.replace(/ /g, '-').toLowerCase());
      liUser.attr('title', description);
    }
    usersStatus[userId] = description;
    updateUserGroupStatus();
  };

  /**
   * Event handler for callinitiate.
   *
   * @param {object} call
   *   Kandy call object
   */
  function kandyOnCallInitiate(call) {
    jQuery('#' + activeContainerId).attr('data-call-id', call.getId());
    $audioRingIn[0].pause();
    $audioRingOut[0].play();
  }

  /**
   * Event handler for callinitiatefail event..
   */
  function kandyOnCallInitiateFail() {
    $audioRingOut[0].pause();

  }

  /**
   * Event handler for callrejected event.
   */

  function kandyOnCallRejected() {
    $audioRingIn[0].pause();
    UIState.callrejected();
  }

  /**
   * OnCall Callback.
   *
   * @param {object} call
   *   Kandy call object
   */
  var kandyOnCallCallback = function (call) {
    if (typeof onCallCallback === 'function') {
      onCallCallback(call);
    }
    $audioRingOut[0].pause();

    var target = jQuery('.kandyVideoButtonCalling:visible').get(0).closest('.kandyButton');
    changeAnswerButtonState('ON_CALL', target);
  };

  /**
   * Incoming Callback.
   *
   * @param {object} call
   *   Kandy call object
   * @param {boolean} isAnonymous
   *   Is coming call by anonymous user
   */
  var kandyIncomingCallCalback = function (call, isAnonymous) {
    if (typeof callIncomingCallback === 'function') {
      callIncomingCallback(call, isAnonymous);
    }

    $audioRingIn[0].play();

    var target = jQuery('.kandyVideoButtonCallOut:visible').get(0).closest('.kandyButton');
    jQuery(target).attr('data-call-id', call.getId());
    changeAnswerButtonState('BEING_CALLED', target);
  };

  /**
   * Kandy call answered callback.
   *
   * @param {object} call
   *   Kandy call object
   * @param {boolean} isAnonymous
   *   Is coming call by anonymous user
   */
  var kandyCallAnsweredCallback = function (call, isAnonymous) {
    if (typeof callAnsweredCallback === 'function') {
      callAnsweredCallback(call, isAnonymous);
    }

    $audioRingOut[0].pause();
    $audioRingIn[0].pause();

    var target = jQuery('.kandyVideoButtonSomeonesCalling:visible').get(0).closest('.kandyButton');
    changeAnswerButtonState('ON_CALL', target);
  };

  /**
   * Kandy call ended callback.
   *
   * @param {object} call
   *   Kandy call object
   */
  var kandyCallEndedCallback = function (call) {

    $audioRingOut[0].play();
    $audioRingIn[0].pause();

    if (typeof callEndedCallback === 'function') {
      callEndedCallback();
    }

    var target = jQuery('.kandyButton[data-call-id="' + call.getId() + '"]');
    changeAnswerButtonState('READY_FOR_CALLING', target);
  };

  /**
   * Event handler for callendedfailed event.
   */
  function kandyOnCallEndedFailed() {

  }

  function kandyOnMediaError(error) {
    switch (error.type) {
      case kandy.call.MediaErrors.WRONG_VERSION:
        alert('Media plugin version not supported.');
        break;

      case kandy.call.MediaErrors.NEW_VERSION_WARNING:
        alert('New plugin version available.');
        break;

      case kandy.call.MediaErrors.NOT_INITIALIZED:
        alert('Media couldn\'t be initialized.');
        break;

      case kandy.call.MediaErrors.NOT_FOUND:
        alert('No WebRTC support was found.');
        break;

      case kandy.call.MediaErrors.NO_SCREENSHARING_WARNING:
        alert('WebRTC supported, but no screensharing support was found.');
        changeAnswerButtonState('SCREEN_SHARING_NOT_SUPPORTED', '.kandyButton');
        break;

      default:
        break;

    }
  }

  /**
   * Change AnswerButtonState with KandyButton Widget.
   *
   * @param {string} state
   *   State of button
   * @param {string} target
   *   Container of buttons
   */
  var changeAnswerButtonState = function (state, target) {
    var kandyButton = (typeof target !== 'undefined') ? jQuery(target) : jQuery('.kandyButton');
    switch (state) {
      case 'READY_FOR_CALLING':
        $audioRingIn[0].pause();
        $audioRingOut[0].pause();
        kandyButton.find('.kandyVideoButtonSomeonesCalling').hide();
        kandyButton.find('.kandyVideoButtonCallOut').show();
        kandyButton.find('.kandyVideoButtonCalling').hide();
        kandyButton.find('.kandyVideoButtonOnCall').hide();
        kandyButton.find('.btnShareScreen').hide();
        kandyButton.find('.btnStopScreenSharing').hide();
        break;

      case 'BEING_CALLED':
        kandyButton.find('.kandyVideoButtonSomeonesCalling').show();
        kandyButton.find('.kandyVideoButtonCallOut').hide();
        kandyButton.find('.kandyVideoButtonCalling').hide();
        kandyButton.find('.kandyVideoButtonOnCall').hide();
        kandyButton.find('.btnStopScreenSharing').hide();

        break;

      case 'CALLING':
        kandyButton.find('.kandyVideoButtonSomeonesCalling').hide();
        kandyButton.find('.kandyVideoButtonCallOut').hide();
        kandyButton.find('.kandyVideoButtonCalling').show();
        kandyButton.find('.kandyVideoButtonOnCall').hide();
        break;

      case 'HOLD_CALL':
        kandyButton.find('.kandyVideoButtonOnCall .btnHoldCall').hide();
        kandyButton.find('.kandyVideoButtonOnCall .btnResumeCall').show();
        kandyButton.find('label.isHold').removeClass('hidden');
        kandyButton.find('label.onCallLabel').addClass('hidden');
        break;

      case 'RESUME_CALL':
        kandyButton.find('.kandyVideoButtonOnCall .btnResumeCall').hide();
        kandyButton.find('.kandyVideoButtonOnCall .btnHoldCall').show();
        kandyButton.find('label.isHold').addClass('hidden');
        kandyButton.find('label.onCallLabel').removeClass('hidden');

        break;

      case 'ON_CALL':
        kandyButton.find('.kandyVideoButtonSomeonesCalling').hide();
        kandyButton.find('.kandyVideoButtonCallOut').hide();
        kandyButton.find('.kandyVideoButtonCalling').hide();
        kandyButton.find('.kandyVideoButtonOnCall').show();
        kandyButton.find('.kandyVideoButtonOnCall .btnResumeCall').hide();
        kandyButton.find('.btnStopScreenSharing').hide();
        break;

      case 'SCREEN_SHARING_NOT_SUPPORTED':
        kandyButton.find('.btnShareScreen').hide().attr('disabled', true);
        break;

      case 'SHARING_SCREEN':
        kandyButton.find('.btnShareScreen').hide().attr('disabled', true);
        kandyButton.find('.btnStopScreenSharing').show().attr('disabled', null);
        break;

      case 'STOP_SHARING_SCREEN':
        kandyButton.find('.btnShareScreen').show().attr('disabled', null);
        kandyButton.find('.btnStopScreenSharing').hide().attr('disabled', true);
        break;

      case 'CALL_HOLD':
        kandyButton.find('.btnHoldCall').attr('disabled', true);
        kandyButton.find('label.isHold').removeClass('hidden');
        kandyButton.find('label.onCallLabel').addClass('hidden');
        break;

      case 'CALL_UNHOLD':
        kandyButton.find('.btnHoldCall').attr('disabled', null);
        kandyButton.find('label.isHold').addClass('hidden');
        kandyButton.find('label.onCallLabel').removeClass('hidden');
        break;

      default:
        break;
    }
  };

  /**
   * Event when answer a call.
   *
   * @param {string} target
   *   Container of button
   */
  var kandyAnswerVideoCall = function (target) {
    var kandyButtonId = jQuery(target).data('container');
    var currentCallId = jQuery('div#' + kandyButtonId).attr('data-call-id');

    activeContainerId = kandyButtonId;
    kandy.call.answerCall(currentCallId, true);
    changeAnswerButtonState('ANSWERING_CALL', '#' + kandyButtonId);
    if (typeof answerVideoCallCallback === 'function') {
      answerVideoCallCallback('ANSWERING_CALL');
    }
  };

  /**
   * Event when click call button PSTN.
   *
   * @param {string} target
   *   Container of button
   */
  var kandyMakePstnCall = function (target) {

    var kandyButtonId = jQuery(target).data('container');
    activeContainerId = kandyButtonId;
    var number = jQuery('#' + kandyButtonId + ' .kandyVideoButtonCallOut #' + kandyButtonId + '-callOutUserId').val();
    var userName = jQuery('#' + kandyButtonId + ' .kandyVideoButtonCallOut #' + kandyButtonId + '-callOutUserId').val();

    kandy.call.makePSTNCall(number, userName);

    target = jQuery(target).closest('.kandyButton');
    changeAnswerButtonState('CALLING', target);
  };

  /**
   * Event when click call button.
   *
   * @param {string} target
   *   Container of button
   */
  var kandyMakeVideoCall = function (target) {

    var kandyButtonId = jQuery(target).data('container');
    activeContainerId = kandyButtonId;
    var userName = jQuery('#' + kandyButtonId + ' .kandyVideoButtonCallOut #' + kandyButtonId + '-callOutUserId').val();

    kandy.call.makeCall(userName, true);
    changeAnswerButtonState('CALLING', '#' + kandyButtonId);
  };

  /**
   * Event when answer a voice call.
   *
   * @param {string} target
   *   Container of button
   */
  var kandyAnswerVoiceCall = function (target) {
    var kandyButtonId = jQuery(target).data('container');
    var currentCallId = jQuery('div#' + kandyButtonId).attr('data-call-id');
    activeContainerId = kandyButtonId;
    kandy.call.answerCall(currentCallId, false);
    changeAnswerButtonState('ANSWERING_CALL', '#' + kandyButtonId);

    if (typeof answerVoiceCallCallback === 'function') {
      answerVoiceCallCallback('ANSWERING_CALL');
    }

  };

  /**
   * Event when click call button.
   *
   * @param {string} target
   *   Container of button
   */
  var kandyMakeVoiceCall = function (target) {
    var kandyButtonId = jQuery(target).data('container');
    activeContainerId = kandyButtonId;
    var userName = jQuery('#' + kandyButtonId + ' .kandyVideoButtonCallOut #' + kandyButtonId + '-callOutUserId').val();

    kandy.call.makeCall(userName, false);
    changeAnswerButtonState('CALLING', '#' + kandyButtonId);
  };

  /**
   * Event when click end call button.
   *
   * @param {string} target
   *   Container of button
   */
  var kandyEndCall = function (target) {
    var kandyButtonId = jQuery(target).data('container');

    var currentCallId = jQuery('div#' + kandyButtonId).attr('data-call-id');
    kandy.call.endCall(currentCallId);
    activeContainerId = kandyButtonId;
    if (typeof end_call_callback === 'function') {
      end_call_callback('READY_FOR_CALLING');
    }
    changeAnswerButtonState('READY_FOR_CALLING', '#' + kandyButtonId);
  };

  /**
   * Event when click hold call button.
   *
   * @param {string} target
   *   Container of button
   */
  var kandyHoldCall = function (target) {
    var kandyButtonId = jQuery(target).data('container');
    var currentCallId = jQuery('#' + kandyButtonId).attr('data-call-id');

    kandy.call.holdCall(currentCallId);

    activeContainerId = kandyButtonId;
    if (typeof holdCallCallback === 'function') {
      holdCallCallback('HOLD_CALL');
    }

    changeAnswerButtonState('HOLD_CALL', '#' + kandyButtonId);
  };

  var kandyUnholdCall = function (target) {
    var kandyButtonId = jQuery(target).data('container');
    var currentCallId = jQuery('#' + kandyButtonId).attr('data-call-id');
    activeContainerId = kandyButtonId;
    kandy.call.unHoldCall(currentCallId, function () {
      changeAnswerButtonState('RESUME_CALL', '#' + kandyButtonId);
    }, function () {

    });
  };

  /**
   * Presence changed callback.
   */
  var presenceChangedCallback = function () {
    for (var userId in kandyPresence) {
      if (kandyPresence.hasOwnProperty(userId)) {
        kandyPresenceNotificationCallback(userId, kandyPresence[userId].toLowerCase(), kandyPresence[userId]);
      }
    }
  };

  /**
   * Get presence status of users.
   *
   * @param {object} lastSeen
   *   The last time user has been seen
   */
  var kandyGetPresence = function (lastSeen) {
    var get_presence_url = Drupal.settings.basePath + 'kandy/get_presence';
    jQuery.post(get_presence_url, lastSeen, function (presences) {
      presences.forEach(function (user, index) {
        kandyPresence[user.full_user_id] = user.presence_status;
      });
      presenceChangedCallback();
    }, 'json');
  };

  /**
   * Get last seen of contacts.
   *
   * @param {Array} contacts
   *   Array of contacts
   */
  var getLastSeen = function (contacts) {
    contacts = contacts || [current_kandy_user];
    kandy.getLastSeen(contacts, function (result) {
      kandyGetPresence(result);
    });
  };

  /**
   * Get contacts last seen continuously.
   *
   * @param {Array} contacts
   *   Array of contacts
   */
  var getLastSeenInterval = function (contacts) {
    getLastSeen(contacts);
    if (last_seen_interval) {
      clearInterval(last_seen_interval);
    }
    last_seen_interval = setInterval(getLastSeen, 10000, contacts);
  };

  /**
   * Add AddressBook widget.
   */
  var kandyLoadContactsAddressbook = function () {
    var contactListForPresence = [];
    var i = 0;
    var deleteContact = [];
    kandy.addressbook.retrievePersonalAddressBook(
      function (results) {
        var get_name_for_contact_url = jQuery('.kandyAddressBook #get_name_for_contact_url').val();
        results = getDisplayNameForContact(results, get_name_for_contact_url);
        // Clear out the current address book list.
        jQuery('.kandyAddressBook .kandyAddressContactList div:not(:first)').remove();
        var div = null;
        if (results.length === 0) {
          div = "<div class='kandyAddressBookNoResult'>-- No Contacts --</div>";
          jQuery('.kandyAddressBook .kandyAddressContactList').append(div);
          getLastSeenInterval();
        }
        else {
          jQuery('.kandyAddressBook .kandyAddressContactList').append("<div class='kandy-contact-heading'><span class='displayname'><b>Username</b></span><span class='userId'><b>Contact</b></span><span class='presence'><b>Status</b></span></div>");
          for (i = 0; i < results.length; i++) {
            var id_attr = results[i].contact_user_name.replace(/[.@]/g, '_');
            if (results[i].display_name !== 'kandy-un-assign-user') {
              contactListForPresence.push(results[i].contact_user_name);
              // HTML id can't contain @ and jquery doesn't like periods (in id).
              var markup = '<div class="kandyContactItem" id="uid_' + id_attr + '">' +
                '<span class="displayname">' + results[i].display_name + '</span>' +
                '<span class="userId">' + results[i].contact_user_name + '</span>' +
                '<span id="presence_' + id_attr + '" class="presence"></span>' +
                '<input class="removeContactBtn" type="button" value="Remove" ' +
                ' data-contact-id="' + results[i].contact_id + '"></div>';
              jQuery('.kandyAddressBook .kandyAddressContactList').append(markup);
            }
            else {
              deleteContact.push({id_attr: id_attr, contact_id: results[i].contact_id});
            }
          }
          getLastSeenInterval(contactListForPresence);

          // Delete empty contact id.
          for (i = 0; i < deleteContact.length; i++) {
            var contact_id = deleteContact[i].contact_id;
            kandyRemoveFromContacts(contact_id);
          }
        }
      }
    );
  };

  /**
   * Get display name for contacts.
   *
   * @param {object} data
   *   Data.
   * @param {string} url
   *   Url to get display name.
   *
   * @return {*}
   *   data with display name
   */
  var getDisplayNameForContact = function (data, url) {
    if (data.length) {
      jQuery.ajax({
        url: url,
        type: 'POST',
        data: {data: data},
        async: false,
        dataType: 'json'
      }).done(function (response) {
        data = response;
      }).fail(function (e) {
      });
    }
    return data;
  };

  /**
   * Get display name for chat content.
   *
   * @param {object} msg
   *   Message data.
   * @param {string} url
   *   Url to get display name.
   *
   * @return {object} msg
   *   Return msg with display name
   */
  var getDisplayNameForChatContent = function (msg, url) {
    if(displayNames[msg.sender.full_user_id]) {
      msg.sender['display_name'] = displayNames[msg.sender.full_user_id];
      msg.sender['contact_user_name'] = msg.sender.full_user_id;
      msg.sender['user_email'] = userEmails[msg.sender.full_user_id];
    } else {
      if (msg) {
        jQuery.ajax({
          url: url,
          type: 'POST',
          data: {data: msg},
          async: false
        }).done(function (response) {
          msg = response;
          displayNames[msg.sender.full_user_id] = msg.sender.display_name;
          userEmails[msg.sender.full_user_id] = msg.sender.user_email;
        }).fail(function (e) {
        });
      }
    }
    return msg;
  };

  /**
   * Add contact.
   */
  var addContacts = function () {
    var contactId = jQuery('.kandyAddressBook #kandySearchUserName').val();
    kandy_addToContacts(contactId);
    jQuery('.kandyAddressBook #kandySearchUserName').select2('val', '');

  };

  /**
   * Change current user status with kandyAddressBook.
   *
   * @param {string} status
   *   Status to be set
   */
  var kandyMyStatusChanged = function (status) {
    var set_presence_url = Drupal.settings.basePath + 'kandy/set_presence/' + status;
    jQuery.ajax({
      url: set_presence_url,
      dataType: 'json'
    });
  };

  var userIdToAddToContacts = null;

  /**
   * Add a user to contact list with kandyAddressBook.
   *
   * @param {string} userId
   *   User id to be added to contact
   */
  var kandy_addToContacts = function (userId) {
    userIdToAddToContacts = userId;
    var contact;
    // HTML id can't contain @ and jquery doesn't like periods (in id).
    if (jQuery('#uid_' + userId.replace(/[.@]/g, '_')).length > 0) {
      alert('This person is already in your contact list.');
    }
    else {
      // Get and AddressBook.Entry object for this contact.
      kandy.addressbook.searchDirectoryByUserName(
        userId,
        function (results) {
          for (var i = 0; i < results.length; ++i) {
            if (results[i].full_user_id === userIdToAddToContacts) {
              // User name and nickname are required.
              contact = {
                contact_user_name: results[i].full_user_id,
                contact_nickname: results[i].full_user_id
              };
              if (results[i].firstName) {
                contact['contact_first_name'] = results[i].firstName;
              }
              if (results[i].lastName) {
                contact['contact_last_name'] = results[i].lastName;
              }
              if (results[i].homePhone) {
                contact['contact_home_phone'] = results[i].homePhone;
              }
              if (results[i].mobilePhone) {
                contact['contact_mobile_number'] = results[i].mobilePhone;
              }
              if (results[i].workPhone) {
                contact['contact_business_number'] = results[i].workPhone;
              }
              if (results[i].fax) {
                contact['contact_fax'] = results[i].fax;
              }
              if (results[i].email) {
                contact['contact_email'] = results[i].email;
              }

              kandy.addressbook.addToPersonalAddressBook(
                contact,
                kandyLoadContactsAddressbook,
                function (message) {
                  alert('Error: ' + message);
                }
              );
              break;
            }
          }
        }
      );
    }
  };

  /**
   * Remove a user from Contact List with kandyAddressBook.
   *
   * @param {string} nickname
   *   Nickname to be removed from contact
   */
  var kandyRemoveFromContacts = function (nickname) {
    kandy.addressbook.removeFromPersonalAddressBook(nickname, kandyLoadContactsAddressbook);
  };

  /* KANDY CHAT WIDGET FUNCTION. */

  var wrapDivClass = 'kandyChat';
  var liTabWrapClass = 'cd-tabs-navigation';
  var liContentWrapClass = 'cd-tabs-content';
  var liTabWrapSelector = '.' + wrapDivClass + ' .' + liTabWrapClass;
  var liContentWrapSelector = '.' + wrapDivClass + ' .' + liContentWrapClass;

  var userHoldingAttribute = 'data-content';
  var activeClass = 'selected';

  var listUserClass = 'list-users';
  var liTabGroupsWrap = liTabWrapSelector + '.groups';
  var liTabContactWrap = liTabWrapSelector + '.contacts';
  var groupSeparator = '.' + wrapDivClass + ' .separator.group';
  var liTabLiveChatWrap = liTabWrapSelector + '.livechats';
  var liveChatGroupSeparator = '.' + wrapDivClass + ' .separator.livechatgroup';
  var displayNames = [];
  var groupNames = [];
  var usersStatus = {};

  /* Add an example chat box. */

  var addExampleBox = function () {
    var tabId = 'example';
    jQuery(liContentWrapSelector).append(getLiContent(tabId));
    jQuery(liContentWrapSelector).find('li[data-content="' + tabId + '"]').addClass('selected').find('.chat-input').attr('disabled', true);
  };

  /**
   * Get a contact template.
   *
   * @param {object} user
   *   User.
   * @param {string} active
   *   Active.
   *
   * @return {string}
   *   Returns an item of contact list
   */
  var getLiContact = function (user, active) {
    var username = user.contact_user_name || user.full_user_id;
    var real_id = '';
    if (typeof user.user_email != 'undefined') {
      username = user.user_email;
      real_id = 'data-real-id="' + user.contact_user_name + '" ';
    }
    var displayName = user.display_name;
    var id = username.replace(/[.@]/g, '_');
    var liClass = (typeof active !== 'undefined') ? active : '';
    return '<li id="' + id + '" class="' + liClass + '"><a ' + real_id + userHoldingAttribute + '="' + username + '" href="#">' + displayName + '</a><i class="status"></i></li>';
  };

  /**
   * Get contact content template.
   *
   * @param {string} user
   *   User.
   * @param {string} real_id
   *   Real user id.
   *
   * @return {string} result
   */
  var getLiContent = function (user, real_id) {
    var uid = '';
    if (typeof real_id != 'undefined') {
      uid = real_id;
    }
    var result = '<li ' + userHoldingAttribute + '="' + user + '">' +
      '<div class="kandyMessages" data-user="' + user + '">' +
      '</div><div >Messages:</div><div>' +
      '<form class="send-message" data-real-id="' + uid + '" data-user="' + user + '">' +
      '<div class="input-message">' +
      '<input class="imMessageToSend chat-input" type="text" data-user="' + user + '">' +
      '<div class="send-file"><label><span class="icon-file"></span></label><input class="file-input" type="file" />' +
      '</div>' +
      '</div><div class="button-send">' +
      '<input class="btnSendMessage chat-input" type="submit" value="Send"  data-user="' + user + '" >' +
      '</div></form></div></li>';
    return result;

  };

  /**
   * Kandy Contact Filter Change.
   *
   * @param {string} val
   *   Changed value
   */
  var kandyContactFilterChanged = function (val) {
    var liUserchat = jQuery('.kandyChat .cd-tabs-navigation li');
    jQuery.each(liUserchat, function (index, target) {
      var liClass = jQuery(target).attr('class');
      var currentClass = 'kandy-chat-status-' + val;
      var currentGroupClass = 'kandy-chat-status-g-' + val;
      if (val === 'all') {
        jQuery(target).show();
      }
      else if ((currentClass === liClass) || jQuery(target).hasClass(currentGroupClass)) {
        jQuery(target).show();
      }
      else {
        jQuery(target).hide();
      }
    });
  };

  /* Load Contact for KandyChat.*/
  var kandyLoadContactsChat = function () {
    var contactListForPresence = [];
    kandy.addressbook.retrievePersonalAddressBook(
      function (results) {
        if (results.length) {
          var get_name_for_contact_url = jQuery('.kandyChat #get_name_for_contact_url').val();
          results = getDisplayNameForContact(results, get_name_for_contact_url);
          emptyContact();
          for (var i = 0; i < results.length; i++) {
            prependContact(results[i]);
            contactListForPresence.push(results[i].contact_user_name);
          }
          addExampleBox();
          getLastSeenInterval(contactListForPresence);
        }
        else {
          getLastSeenInterval();
        }
      },
      function () {
        addExampleBox();
      }
    );
  };

  /**
   * Send a message with kandyChat.
   *
   * @param {string} username
   *   Username to send message
   * @param {string} dataHolder
   *   Holder
   */
  var kandySendMessage = function (username, dataHolder) {
    var displayName = jQuery('.kandyChat .kandy_current_username').val();
    dataHolder = (typeof dataHolder != 'undefined') ? dataHolder : username;
    var inputMessage = jQuery('.kandyChat .imMessageToSend[data-user="' + dataHolder + '"]');
    var message = inputMessage.val();
    inputMessage.val('');
    kandy.messaging.sendIm(username, message,
      function () {
        var newMessage = '<div class="my-message"><span class="imUsername">' + displayName +
          ':</span> <span class="imMessage">' + message + '</span></div>';
        var messageDiv = jQuery('.kandyChat .kandyMessages[data-user="' + dataHolder + '"]');
        messageDiv.append(newMessage);
        messageDiv.scrollTop(messageDiv[0].scrollHeight);
      },
      function () {
        alert('IM send failed');
      }
    );
  };

  // Gather the user input then send the image.
  var kandySendFile = function () {
    // Gather user input.
    var recipient = jQuery(".livechats a.selected").data('real-id');
    if (typeof recipient == "undefined") {
      recipient = jQuery(".contacts a.selected").data('content');
      if (typeof recipient == "undefined") {
        recipient = jQuery(".cd-tabs-content form.send-message").data('real-id');
      }
    }

    var file = jQuery(".send-file input")[0].files[0];

    if (file.type.indexOf('image') >=0) {
      kandy.messaging.sendImWithImage(recipient, file, onFileSendSuccess, onFileSendFailure);
    } else if (file.type.indexOf('audio') >=0) {
      kandy.messaging.sendImWithAudio(recipient, file, onFileSendSuccess, onFileSendFailure);
    } else if (file.type.indexOf('video') >=0) {
      kandy.messaging.sendImWithVideo(recipient, file, onFileSendSuccess, onFileSendFailure);
    } else if (file.type.indexOf('vcard') >=0) {
      kandy.messaging.sendImWithContact(recipient, file, onFileSendSuccess, onFileSendFailure);
    } else {
      kandy.messaging.sendImWithFile(recipient, file, onFileSendSuccess, onFileSendFailure);
    }
  };

  // What to do on a file send success.
  function onFileSendSuccess(message) {
    console.log(message.message.content_name + " sent successfully.");
    var displayName = jQuery('.kandyChat .kandy_current_username').val();
    var dataHolder = jQuery('.cd-tabs-content > li.selected').data('content');
    var newMessage = '<div class="my-message">\
                    <b><span class="imUsername">' + displayName + ': </span></b>';


    var fileUrl = kandy.messaging.buildFileUrl(message.message.content_uuid);
    var html = '';
    if (message.contentType == 'image') {
      html = '<div class="wrapper-img"><img src="' + fileUrl + '"></div>';
    }
    html += '<a class="icon-download" href="' + fileUrl + '" target="_blank">' + message.message.content_name + '</a>';
    newMessage += '<span class="imMessage">' + html + '</span>';
    newMessage += '</div>';

    var messageDiv = jQuery('.kandyChat .kandyMessages[data-user="' + dataHolder + '"]');
    messageDiv.append(newMessage);
    messageDiv.scrollTop(messageDiv[0].scrollHeight);
  }

  function onFileSendFailure() {
    console.log('File wasn\'t sent!');
  }

  /**
   * On Message event listener callback.
   *
   * @param {object} msg
   *   Message object received
   */
  var kandyOnMessage = function (msg) {
    if (msg) {
      var url = jQuery('.kandyChat #get_name_for_chat_content_url').val();
      msg = getDisplayNameForChatContent(msg, url);
      var sender_full_id = msg.sender.full_user_id;
      // if user is not chatting with someone
      if(!jQuery('.cd-tabs-navigation > li > a.selected').length) {
        setActiveChatWindow(jQuery('.cd-tabs-navigation > li > a[data-content="'+sender_full_id+'"]'));
      }
    }
    if (msg.messageType === 'chat') {
      // Get user info.
      var username = msg.sender.full_user_id;
      if (typeof msg.sender.user_email != 'undefined') {
        username = msg.sender.user_email;
      }
      var displayName = msg.sender.display_name;
      // Process tabs.
      if (!jQuery(liTabWrapSelector + ' li a[' + userHoldingAttribute + '="' + username + '"]').length) {
        prependContact(msg.sender);
      }
      if (!jQuery('input.imMessageToSend').is(':focus')) {
        moveContactToTopAndSetActive(msg.sender);
      }
      else {
        moveContactToTop(msg.sender);
      }
      // Process message.
      if ((msg.hasOwnProperty('message'))) {
        var message = msg.message.text;
        var newMessage = '<div class="their-message"><span class="imUsername">' +
          displayName + ':</span> ';
        if(msg.contentType == 'text' && msg.message.mimeType == 'text/plain') {
          newMessage += '<span class="imMessage">' + message + '</span>';
        } else {
          var fileUrl = kandy.messaging.buildFileUrl(msg.message.content_uuid);
          var html = '';
          if (msg.contentType == 'image') {
            html = '<div class="wrapper-img"><img src="' + fileUrl + '"></div>';
          }
          html += '<a class="icon-download" href="' + fileUrl + '" target="_blank">' + msg.message.content_name + '</a>';
          newMessage += '<span class="imMessage">' + html + '</span>';
        }
        newMessage += '</div>';
        var messageDiv = jQuery('.kandyChat .kandyMessages[data-user="' + username + '"]');
        messageDiv.append(newMessage);
        messageDiv.scrollTop(messageDiv[0].scrollHeight);
      }
    }

  };

  /* Empty all contacts.*/
  var emptyContact = function () {
    jQuery(liTabContactWrap).html('');
  };

  /**
   * Prepend a contact.
   *
   * @param {object} user
   *   User to prepend
   */
  var prependContact = function (user) {
    var isLiveChat = false;
    var username = user.contact_user_name;
    if (typeof user.user_email != 'undefined') {
      isLiveChat = true;
      username = user.user_email;
    }

    var liParent = jQuery(liTabContactWrap + ' li a[' + userHoldingAttribute + '="' + username + '"]').parent();
    var liContact = '';
    if (liParent.length) {
      liContact = liParent[0].outerHTML;
    }
    else {
      liContact = getLiContact(user);
    }
    if (!isLiveChat) {
      jQuery(liTabContactWrap).prepend(liContact);
    }
    else {
      jQuery(liTabLiveChatWrap).prepend(liContact);
      if (jQuery(liveChatGroupSeparator).hasClass('hidden')) {
        jQuery(liveChatGroupSeparator).removeClass('hidden');
      }
    }
    if (!jQuery(liContentWrapSelector + ' li[' + userHoldingAttribute + '="' + username + '"]').length) {
      var liContent = getLiContent(username, user.contact_user_name);
      jQuery(liContentWrapSelector).prepend(liContent);
    }
  };

  /**
   * Set focus to a user.
   *
   * @param {string} user
   *   User to be focused
   */
  var setFocusContact = function (user) {
    jQuery(liTabWrapSelector + ' li a[' + userHoldingAttribute + '="' + user + '"]').trigger('click');
  };

  /**
   * Move a contact user to top of the list.
   *
   * @param {object} user
   *   User to be moved
   */
  var moveContactToTop = function (user) {
    var username = user.contact_user_name;
    if (typeof user.user_email != 'undefined') {
      username = user.user_email;
    }
    var contact = jQuery(liTabWrapSelector + ' li a[' + userHoldingAttribute + '="' + username + '"]').parent();
    var active = contact.hasClass(activeClass);

    // Add to top.
    prependContact(user, active);
    // Remove.
    contact.remove();
  };

  /**
   * Move a contact user to top of the list set set focus to it.
   *
   * @param {object} user
   *   User to be moved
   */
  var moveContactToTopAndSetActive = function (user) {
    moveContactToTop(user);
    setFocusContact(user);
    jQuery(liTabWrapSelector).scrollTop(0);
  };

  /**
   * Build list of participants.
   *
   * @param {string} sessionId
   *   Session id of group
   * @param {Array} participants
   *   Participants of group
   * @param {string} admin_id
   *   Id of admin
   */
  var buildListParticipants = function (sessionId, participants, admin_id) {
    var listUsersGroup = jQuery(liTabWrapSelector + ' li[data-group="' + sessionId + '"] ' + ' .' + listUserClass);
    listUsersGroup.empty();
    var get_name_for_contact_url = jQuery('.kandyChat #get_name_for_contact_url').val();
    participants.push({full_user_id: admin_id});
    participants = getDisplayNameForContact(participants, get_name_for_contact_url);
    if (participants.length) {
      participants.forEach(function (item) {
        displayNames[item.full_user_id] = item.display_name;
        if (!jQuery(listUsersGroup).find('li[data-user="' + item.full_user_id + '"]').length) {
          var status = '';
          var additionBtn = '';
          var displayName = displayNames[item.full_user_id];
          if (admin_id === item.full_user_id) {
            displayName += '<span> (owner)</span>';
          }
          jQuery(listUsersGroup).append(
            '<li data-user="' + item.full_user_id + '"><a>' + displayName + '</a>' +
            '<span class="actions">' + additionBtn + '</span><div class="statusContainer"><i class="status"></i>' +
            ((status) ? '<i class="group-status">(' + status + ')</i>' : '') + '</div></li>'
          );
        }
      });
    }

  };

  /**
   * Load open group chat.
   */
  var kandyLoadGroups = function () {
    kandy.messaging.getGroups(
      function (result) {
        jQuery(liTabGroupsWrap).empty();
        if (result.hasOwnProperty('groups')) {
          if (result.groups.length) {
            jQuery(groupSeparator).removeClass('hidden');
            for (var i in result.groups) {
              // Build sessions list here.
              if (!groupNames.hasOwnProperty(result.groups[i].group_id)) {
                groupNames[result.groups[i].group_id] = result.groups[i].group_name;
              }
              if (!jQuery(liTabGroupsWrap + " li[data-group='" + result.groups[i].session_id + "']").length) {
                jQuery(liTabGroupsWrap).append(
                  '<li data-group="' + result.groups[i].group_id + '" class="group">' +
                  '<i class="toggle fa fa-plus-square-o"></i><a data-content="' + result.groups[i].group_id + '" href="#">' +
                  result.groups[i].group_name + '</a><div class="groupAction"></div><ul class="list-users"></ul></li>'
                );
              }
              if (!jQuery(liContentWrapSelector + ' li[' + userHoldingAttribute + '="' + result.groups[i].group_id + '"]').length) {
                var liContent = getGroupContent(result.groups[i].group_id);
                jQuery(liContentWrapSelector).prepend(liContent);
              }
              kandyLoadGroupDetails(result.groups[i].group_id);

            }
          }
          else {
            jQuery(groupSeparator).addClass('hidden');
          }
        }
      }
    );
  };

  /**
   * Event handler for onData event.
   *
   * @param {object} msg
   *   Group message object
   */
  var kandyOnGroupMessage = function (msg) {
    if (typeof msg !== 'undefined') {
      var msgType = msg.messageType;
      var sender = displayNames[msg.sender.full_user_id] || msg.sender.user_id;
      if (msgType === 'groupChat') {
        if (msg.contentType === 'text') {
          var newMessage = '<div class="their-message">' +
            '<b><span class="imUsername">' + sender + ':</span></b>' +
            '<span class="imMessage">' + msg.message.text + '</span></div>';
          var messageDiv = jQuery('.kandyChat .kandyMessages[data-group="' + msg.group_id + '"]');
          messageDiv.append(newMessage);
          messageDiv.scrollTop(messageDiv[0].scrollHeight);
        }
      }
    }

  };

  /**
   * Add member to a group.
   *
   * @param {string} group_id
   *   Id of group to invite user in
   * @param {Array} members
   *   Members to be invited
   */
  var kandyInviteUserToGroup = function (group_id, members) {
    kandy.messaging.addGroupMembers(group_id, members,
      function (results) {
        kandyLoadGroupDetails(group_id);
      }
    );
  };

  /* On group invite user event */

  var kandyOnGroupInvite = function () {
    kandyLoadGroups();
  };

  /**
   * User removed from group chat event.
   *
   * @param {object} message
   *   Message
   */
  var kandyOnRemoveFromGroup = function (message) {
    if (message.messageType === 'chatGroupBoot') {
      var bootedUser = message.booted[0];
      var notify;
      if (bootedUser !== current_kandy_user) {
        notify = (displayNames[bootedUser] || bootedUser.split('@')[0]) + ' is removed from this group';
        kandyLoadGroupDetails(message.group_id);
      }
      else {
        notify = 'You are removed from this group';
        kandyLoadGroups();
        changeGroupInputState(message.group_id, true);
      }
      var newMessage = '<div class="their-message"><span class="imMessage"><i>' + notify + '</i></span></div>';
      var messageDiv = jQuery('.kandyChat .kandyMessages[data-group="' + message.group_id + '"]');
      messageDiv.append(newMessage);
    }
  };

  /**
   * Get group content.
   *
   * @param {string} groupId
   *   Group id to get content
   *
   * @return {string}
   *   Group HTML snippet
   */
  var getGroupContent = function (groupId) {
    var result = '<li ' + userHoldingAttribute + '="' + groupId + '">' +
      '<div class="kandyMessages" data-group="' + groupId + '"></div>' +
      '<div >Messages:</div><div class="">' +
      '<form class="send-message" data-group="' + groupId + '">' +
      '<div class="input-message"><input class="imMessageToSend chat-input" type="text" data-group="' + groupId + '"></div>' +
      '<div class="button-send"><input class="btnSendMessage chat-input" type="submit" value="Send"  data-group="' + groupId + '" >' +
      '</div></form></div></li>';
    return result;
  };

  /**
   * Change group input state.
   *
   * @param {string} groupId
   *   Group id to change
   * @param {boolean} state
   *   State to change
   */
  var changeGroupInputState = function (groupId, state) {
    var messageInput = jQuery(liContentWrapSelector + ' li[data-content="' + groupId + '"] form .imMessageToSend');
    messageInput.prop('disabled', !!state);
  };

  /**
   * Create new group.
   *
   * @param {string} groupName
   *   Group name
   * @param {function} successCallback
   *   Creating group success callback
   * @param {function} failCallback
   *   Creating group fail callback
   */
  var kandyCreateGroup = function (groupName, successCallback, failCallback) {
    kandy.messaging.createGroup(groupName, '', successCallback, failCallback);
  };

  /**
   * Send group IM.
   *
   * @param {string} groupId
   *   Group Id to send message
   * @param {string} msg
   *   Message to be sent
   */
  var kandySendGroupIm = function (groupId, msg) {
    var username = jQuery('input.kandy_current_username').val();
    kandy.messaging.sendGroupIm(groupId, msg,
      function () {
        var newMessage = '<div class="my-message"><b><span class="imUsername">' + username +
          ':</span></b><span class="imMessage">' + msg + '</span></div>';
        var messageDiv = jQuery('.kandyChat .kandyMessages[data-group="' + groupId + '"]');
        messageDiv.append(newMessage);
        messageDiv.scrollTop(messageDiv[0].scrollHeight);
      },
      function (msg) {
        // Show error message for current user.
        var errorMessage = '<div class="their-message"><span class="imMessage"><i>Error: ' + msg + '</i></span></div>';
        var messageDiv = jQuery('.kandyChat .kandyMessages[data-group="' + groupId + '"]');
        messageDiv.append(errorMessage);
      }
    );
  };

  /**
   * Leave group callback.
   *
   * @param {object} message
   *   Leave group message
   */
  var kandyOnLeaveGroup = function (message) {
    if (message.messageType === 'chatGroupLeave') {
      var leaverDisplayName = displayNames[message.leaver] || message.split('@')[0];
      var groupId = message.group_id;
      if (message.leaver !== current_kandy_user) {
        kandyLoadGroupDetails(message.group_id);
      }
      else {
        kandyLoadGroups();
        changeGroupInputState(message.group_id, true);
      }
      var newMessage = '<div class="their-message"><span class="imMessage"><i>' + leaverDisplayName + ' has left</i></span></div>';
      var messageDiv = jQuery('.kandyChat .kandyMessages[data-group="' + groupId + '"]');
      messageDiv.append(newMessage);
    }
  };

  /**
   * Remove user from group.
   *
   * @param {string} groupId
   *   Group id where user is belongs to
   * @param {string} userId
   *   User id to be removed
   */
  var kandyRemoveFromGroup = function (groupId, userId) {
    var members = [];
    members.push(userId);
    var displayName = displayNames[userId] || userId.split('@')[0];
    var confirm = window.confirm('Do you want to remove ' + displayName + ' from this group?');
    if (confirm) {
      kandy.messaging.removeGroupMembers(groupId, members,
        function () {
          kandyLoadGroupDetails(groupId);
        }
      );
    }
  };

  /**
   * User Leave Group event.
   *
   * @param {string} groupId
   *   Group id to leave.
   * @param {function} successCallback
   *   Leave group success callback.
   * @param {function} failCallback
   *   Leave group fail callback.
   */
  var kandyLeaveGroup = function (groupId, successCallback, failCallback) {
    var confirm = window.confirm('Do you want to leave group ' + groupNames[groupId] + '?');
    if (confirm) {
      kandy.messaging.leaveGroup(groupId, successCallback, failCallback);
    }
  };

  /**
   * Terminate a session.
   *
   * @param {string} groupId
   *   Group id to terminate
   * @param {function} successCallback
   *   Terminate success callback
   * @param {function} failCallback
   *   Terminate fail callback
   */
  var kandyTerminateGroup = function (groupId, successCallback, failCallback) {
    var confirm = window.confirm('Do you want to remove group ' + groupNames[groupId] + '?');
    if (confirm) {
      kandy.messaging.deleteGroup(groupId, successCallback, failCallback);
    }
  };

  /**
   * Session terminate event callback.
   *
   * @param {object} notification
   *   Group terminate notification data
   */
  var kandyOnTerminateGroup = function (notification) {
    removeGroupContent(notification.group_id);
    kandyLoadGroups();
  };

  /**
   * Clean things up after remove group.
   *
   * @param {string} sessionId
   *   Session Id
   */
  var removeGroupContent = function (sessionId) {
    var toBeRemove = jQuery(liContentWrapSelector + ' li[data-content="' + sessionId + '"]');
    if (toBeRemove.hasClass('selected')) {
      toBeRemove.siblings('[data-content="example"]').addClass('selected');
    }
    toBeRemove.remove();
  };

  /* Update User Group Status.*/
  var updateUserGroupStatus = function () {
    if (usersStatus) {
      if (jQuery(liTabGroupsWrap).length) {
        for (var u in usersStatus) {
          if (usersStatus.hasOwnProperty(u)) {
            var liUserGroup = jQuery(liTabGroupsWrap + ' li[data-user="' + u + '"]');
            var status = usersStatus[u].replace(/ /g, '-').toLowerCase();
            liUserGroup.find('i.status').html(usersStatus[u]);
            liUserGroup.removeClass();
            liUserGroup.addClass('kandy-chat-status-' + status);
            liUserGroup.attr('title', usersStatus[u]);
            jQuery(liUserGroup).closest('li[data-group]').addClass('kandy-chat-status-g-' + status);
          }

        }
      }
    }
  };

  /**
   * Load group chat detail.
   *
   * @param {string} groupId
   *   Group id to load
   */
  var kandyLoadGroupDetails = function (groupId) {
    kandy.messaging.getGroupById(groupId,
      function (result) {
        var isOwner = false;
        var groupActivity = '';
        var groupAction = jQuery(liTabWrapSelector + ' li a[data-content="' + groupId + '"]').parent().find('.groupAction');
        var messageInput = jQuery(liContentWrapSelector + ' li[data-content="' + groupId + '"] form .imMessageToSend');
        buildListParticipants(groupId, result.members, result.owners[0].full_user_id);
        // If current user is owner of this group.
        if (current_kandy_user === result.owners[0].full_user_id) {
          // Add admin functionality.
          isOwner = true;
          groupActivity = '<a class="btnRemoveGroup" data-group-id="' + result.group_id + '" href="javascipt:;"><i title="Remove group" class="fa fa-remove"></i></a>';
          jQuery(liTabWrapSelector + ' li[data-group="' + groupId + '"] ' + ' .' + listUserClass + ' li[data-user!="' + result.owners[0].full_user_id + '"] .actions').append(
            '<i title="Remove user" class="remove fa fa-remove"></i>'
          );
        }
        if (isOwner) {
          groupActivity += '<a class="btnInviteUser" title="Add user"  href="javascript:;"><i class="fa fa-plus"></i></a>';
        }
        else {
          groupActivity = '<a class="leave btnLeaveGroup" title="Leave group" data-group-id="' + result.group_id + '" href="javascript:;"><i class="fa fa-sign-out"></i></a>';
          if (messageInput.is(':disabled')) {
            messageInput.prop('disabled', false);
          }
        }
        groupAction.html(groupActivity);
        updateUserGroupStatus();
      }
    );
  };

  /**
   * Send SMS message.
   *
   * @param {string} receiver
   *   Receiver number
   * @param {string} sender
   *   Sender
   * @param {string} message
   *   Message to be sent
   * @param {function} successCallback
   *   Sent success callback
   * @param {function} errorCallback
   *   Send fail callback
   */
  var kandySendSms = function (receiver, sender, message, successCallback, errorCallback) {
    kandy.messaging.sendSMS(
      receiver,
      sender,
      message,
      function () {
        if (typeof successCallback === 'function') {
          successCallback();
        }
      },
      function (message, status) {
        if (typeof errorCallback === 'function') {
          errorCallback(message, status);
        }
      }
    );
  };

  /**
   * Login kandy user.
   *
   * @param {string} apiKey
   *   Kandy API key
   * @param {string} username
   *   Kandy username
   * @param {string} password
   *   Kandy password
   * @param {function} successCallback
   *   Login success callback
   * @param {function} failCallback
   *   Login fail callback
   */
  var login = function (apiKey, username, password, successCallback, failCallback) {
    kandy.login(apiKey, username, password, function () {
      if (typeof successCallback === 'function') {
        successCallback();
      }
    }, function () {
      if (typeof failCallback === 'function') {
        failCallback();
      }
    });
  };

  var loginSSO = function (user_access_token, success_callback, failure_callback, password) {
    kandy.loginSSO(user_access_token, function(){
      if(typeof success_callback === 'function') {
        success_callback();
      }
    }, function() {
      if(typeof failure_callback === 'function') {
        failure_callback();
      }
    }, password);

  }

  /**
   * OnJoinApprove event use for co-browsing session.
   *
   * @param {object} notification
   *   Session join notification obj.
   */
  window.kandyOnSessionJoinApprove = function (notification) {
    if (typeof sessionJoinApprovedCallback !== 'undefined') {
      sessionJoinApprovedCallback(notification.session_id);
    }
  };

  /**
   * Approve join session request.
   *
   * @param {string} sessionId
   *   Session to approve
   * @param {string} userId
   *   User If to approve
   * @param {function} successCallback
   *   Approve success callback
   */
  window.kandyApproveJoinSession = function (sessionId, userId, successCallback) {
    kandy.session.acceptJoinRequest(sessionId, userId,
      function () {
        if (typeof successCallback === 'function') {
          successCallback(sessionId);
        }
      }
    );
  };

  /**
   * Get opened sessions by specific type.
   *
   * @param {string} sessionType
   *   Session type to get
   * @param {function} successCallback
   *   Get open session success callback
   */
  window.kandyGetOpenSessionsByType = function (sessionType, successCallback) {
    kandy.session.getOpenSessionsByType(
      sessionType,
      function (result) {
        for (var i = 0; i < result.sessions.length; i++) {
          if (result.sessions[i].session_type !== sessionType) {
            result.sessions.splice(i, 1);
          }
        }
        if (typeof successCallback === 'function') {
          successCallback(result.sessions);
        }
      },
      function (msg, code) {

      }
    );
  };

  /**
   * Get information of a session.
   *
   * @param {string} sessionId
   *   Session id to get information
   * @param {function} successCallback
   *   Get info success callback
   * @param {function} failCallback
   *   Get info fail callback
   */
  window.kandyGetSessionInfo = function (sessionId, successCallback, failCallback) {
    kandy.session.getInfoById(sessionId,
      function (result) {
        if (typeof successCallback === 'function') {
          successCallback(result);
        }
      },
      function (msg, code) {
        if (typeof failCallback === 'function') {
          failCallback(msg, code);
        }
      }
    );
  };

  /**
   * Terminate a session.
   *
   * @param {string} sessionId
   *   Session id to terminate
   * @param {function} successCallback
   *   Terminate success callback
   */
  window.kandyTerminateSession = function (sessionId, successCallback) {
    kandy.session.terminate(
      sessionId,
      successCallback
    );
  };

  /**
   * Join a session.
   *
   * @param {string} sessionId
   *   Session id to join.
   * @param {function} successCallback
   *   Session join success callback.
   */
  window.kandyJoinSession = function (sessionId, successCallback) {
    kandy.session.join(
      sessionId,
      {},
      function () {
        if (typeof successCallback === 'function') {
          successCallback(sessionId);
        }
      }
    );
  };

  /**
   * Leave a session.
   *
   * @param {string} sessionId
   *   Session id to leave.
   * @param {function} successCallBack
   *   Leave session success callback.
   */
  window.kandyLeaveSession = function (sessionId, successCallBack) {
    kandy.session.leave(sessionId,
      '',
      function () {
        if (typeof successCallBack === 'function') {
          successCallBack(sessionId);
        }
      }
    );
  };

  /**
   * Ajax function to be called continuously to know that user still online.
   *
   * @param {number} interval
   *   Interval to call ajax
   *
   * @return {number}
   *   Identity number of interval
   */
  window.heartBeat = function (interval) {
    return setInterval(function () {
      jQuery.get('/kandy/kandy_still_alive');
    }, parseInt(interval));
  };

  /**
   * Check tabs scrolling.
   *
   * @param {object} tabs
   *   Tab so scroll
   */
  function checkScrolling(tabs) {
    var totalTabWidth = parseInt(tabs.children('.cd-tabs-navigation').width());
    var tabsViewport = parseInt(tabs.width());
    if (tabs.scrollLeft() >= totalTabWidth - tabsViewport) {
      tabs.parent('.cd-tabs').addClass('is-ended');
    }
    else {
      tabs.parent('.cd-tabs').removeClass('is-ended');
    }
  }

  function kandyStartScreenSharing(callId, success_callback, fail_callback) {
    kandy.call.startScreenSharing(callId, success_callback, fail_callback);
  }

  function kandyStopScreenSharing(callId, success_callback, fail_callback) {
    kandy.call.stopScreenSharing(callId, success_callback, fail_callback);
  }

  function setActiveChatWindow(selectedItem) {
    var tabContentWrapper = jQuery(liContentWrapSelector);
    var selectedTab = selectedItem.data('content');
    var selectedContent = tabContentWrapper.find('li[data-content="' + selectedTab + '"]');
    selectedContent.find('.imMessageToSend').focus();
    selectedContent.addClass('selected').siblings('li').removeClass('selected');
  }

  /**
   * Kandy Ready.
   */
  jQuery(document).ready(function (jQuery) {
    // Register kandy widget event.
    setup();
    if(Drupal.settings.loginInfo.password) {
      login(Drupal.settings.loginInfo.apiKey, Drupal.settings.loginInfo.username, Drupal.settings.loginInfo.password, kandyLoginSuccessCallback, kandyLoginFailedCallback);
    } else {
      loginSSO(Drupal.settings.loginInfo.user_access_token, kandyLoginSuccessCallback, kandyLoginFailedCallback);
    }

    if (jQuery('.kandyButton').length) {
      // Active Select2.
      var ajaxOptions = {
        quietMillis: 100,
        url: jQuery('.kandyButton .select2').attr('data-ajax-url'),
        dataType: 'json',
        delay: 250,
        data: function (params) {
          return {term: params};
        },
        results: function (data) {
          return {results: data};
        }
      };
      jQuery('.kandyButton .select2').select2({
        ajax: ajaxOptions,
        minimumInputLength: 1
      });
      jQuery('.kandyButton .btnVoiceCall').click(function () {
        kandyMakeVoiceCall(this);
      });

      jQuery('.kandyButton .btnEndCall').click(function () {
        kandyEndCall(this);
      });

      jQuery('.kandyButton .btnAnswerVoiceCall').click(function () {
        kandyAnswerVoiceCall(this);
      });

      jQuery('.kandyButton .btnCallPstn').click(function () {
        kandyMakePstnCall(this);
      });

      jQuery('.kandyButton .btnVideoCall').click(function () {
        kandyMakeVideoCall(this);
      });

      jQuery('.kandyButton .btmAnswerVideoCall').click(function () {
        kandyAnswerVideoCall(this);
      });

    }

    if (jQuery('.kandyAddressBook').length) {
      jQuery('.kandyAddressBook .select2').select2({
        ajax: {
          quietMillis: 100,
          url: jQuery('.kandyButton .select2').attr('data-ajax-url'),
          dataType: 'json',
          delay: 250,
          data: function (params) {
            return {term: params};
          },
          results: function (data) {
            return {results: data};
          }
        },
        minimumInputLength: 1
      });

      jQuery('#btnAddContact').bind('click', addContacts);

      jQuery('.removeContactBtn').live('click', function () {
        kandyRemoveFromContacts(jQuery(this).data('contact-id'));
      });

    }
    jQuery('.kandyMyStatusDropDown').on('change', function () {
      kandyMyStatusChanged(jQuery(this).val());
    });

    // Only work when kandyChat exists.
    if (jQuery('.kandyChat').length) {
      jQuery('.kandyChat form.send-message').live('submit', function (e) {
        var username = jQuery(this).attr('data-user');
        var realID = jQuery(this).data('real-id');
        if (realID === '') {
          realID = username;
        }
        if (jQuery(this).is('[data-user]')) {
          kandySendMessage(realID, username);
        }
        else {
          kandySendGroupIm(jQuery(this).data('group'), jQuery(this).find('.imMessageToSend').val());
          jQuery(this).find('.imMessageToSend').val('');
        }
        e.preventDefault();
      });

      jQuery('.kandyChat #btn-create-group-modal').click(function () {
        jQuery('#kandy-chat-create-group-modal').show();
        jQuery('#kandy-chat-create-session-name').focus();
      });

      jQuery('#kandy-chat-modal-button-create-group').click(function () {
        var groupName = jQuery('#kandy-chat-create-session-name').val();
        var errorContainer = jQuery('.errors');
        errorContainer.empty();
        if (groupName === '') {
          alert('Group must have a name.');
          jQuery('#kandy-chat-create-session-name').focus();
        }
        else {
          kandyCreateGroup(groupName, kandyLoadGroups);
          jQuery('#kandy-chat-create-session-name').val('');
          jQuery('#kandy-chat-create-group-modal').hide();
        }
      });
      jQuery('#kandy-chat-modal-button-add-user').live('click', function () {
        var username = jQuery('#kandy-chat-invite-username').val();
        var errorContainer = jQuery('.errors');
        var groupId = jQuery('#kandy-chat-add-user-modal').data('group');
        errorContainer.empty();
        if (username === '') {
          alert('Please provide a username');
          jQuery('#kandy-chat-create-session-name').focus();
        }
        else {
          kandyInviteUserToGroup(groupId, [username]);
          jQuery('#kandy-chat-invite-username').val('');
          jQuery('#kandy-chat-add-user-modal').hide();
        }
      });

      jQuery('#contactFilter').on('change', function () {
        kandyContactFilterChanged(jQuery(this).val());
      });

      jQuery('#kandy-chat-modal-button-close').click(function () {
        jQuery('#kandy-chat-create-session-name').val('');
        jQuery('#kandy-chat-create-group-modal').hide();

      });
      jQuery('#kandy-chat-modal-invite-button-close').click(function () {
        jQuery('#kandy-chat-invite-username').val('');
        jQuery('#kandy-chat-add-user-modal').hide();
      });

      jQuery('.kandyChat .btnInviteUser').live('click', function () {
        jQuery('#kandy-chat-add-user-modal').attr('data-group', jQuery(this).closest('li.group').data('group')).show();
        jQuery('#kandy-chat-invite-username').focus();
      });

      jQuery('.kandyChat').on('click', '.btnLeaveGroup', function () {
        kandyLeaveGroup($(this).data('group-id'), kandyLoadGroups);
      });

      jQuery('.kandyChat').on('click', '.btnRemoveGroup', function () {
        kandyTerminateGroup($(this).data('group-id'), kandyLoadGroups);
      });

      jQuery('.kandyChat').on('click','.send-file label', function(){
        $(this).siblings('input[type="file"]').trigger('click');
      });

      jQuery('.kandyChat').on('change', '.send-file input[type="file"]', function(){
        if($(this).val()) {
          kandySendFile();
        }
      });

      jQuery('.list-users li .remove').live('click', function (e) {
        var userId = jQuery(this).closest('li').data('user');
        var groupId = jQuery(this).closest('[data-group]').data('group');
        kandyRemoveFromGroup(groupId, userId);
      });

      var tabContentWrapper = jQuery(liContentWrapSelector);

      jQuery('.cd-tabs-navigation > li > a').live('click', function (event) {
        event.preventDefault();
        var selectedItem = jQuery(this);
        if (!selectedItem.hasClass('selected')) {
          setActiveChatWindow(selectedItem);
          var selectedContentHeight = jQuery('.cd-tabs-navigation').parent('nav').height();
          jQuery('.cd-tabs-navigation a').removeClass('selected');
          selectedItem.addClass('selected');
          jQuery('.chat-with-message').show();
          jQuery('.chat-friend-name').html(selectedItem.html());

          // Animate tabContentWrapper height when content changes.
          tabContentWrapper.animate({
            height: selectedContentHeight
          }, 200);
        }
      });

      // Hide the .cd-tabs::after element when tabbed navigation has scrolled to the end (mobile version).
      checkScrolling(jQuery('.cd-tabs nav'));

      jQuery(window).live('resize', function () {
        checkScrolling(jQuery('.cd-tabs nav'));
      });

      jQuery('.cd-tabs nav').live('scroll', function () {
        checkScrolling(jQuery(this));
      });

      jQuery('.toggle').live('click', function () {
        jQuery(this).toggleClass('fa-plus-square-o').toggleClass('fa-minus-square-o');
        jQuery(this).siblings('.list-users').toggleClass('expanding');
      });
      jQuery('.kandyChat .kandyModal .select2').select2({
        ajax: {
          quietMillis: 100,
          url: jQuery('.kandyChat .select2').attr('data-ajax-url'),
          dataType: 'json',
          delay: 250,
          data: function (params) {
            return {term: params};
          },
          results: function (data) {
            return {results: data};
          }
        },
        minimumInputLength: 1
      });
    }

    /* Click on send sms button. */
    jQuery('.kandy-sms-send-btn').live('click', function () {
      var wrapper = jQuery(this).closest('.kandy-sms-wrapper');
      var to = wrapper.find('.kandy-sms-to').val();
      var message = wrapper.find('.kandy-sms-content').val();
      kandySendSms(to, '', message, function (data) {
        alert('Sent!');
      }, function (message, status) {
        alert('SMS send failed!');
      });
    });

    /* Validate send sms button. */
    jQuery('.kandy-sms-content, .kandy-sms-to').live('input', function () {
      var wrapper = jQuery(this).closest('.kandy-sms-wrapper');
      var to = wrapper.find('.kandy-sms-to').val();
      var message = wrapper.find('.kandy-sms-content').val();
      var sendBtn = wrapper.find('.kandy-sms-send-btn');
      if (to !== '' && message !== '') {
        sendBtn.removeAttr('disabled');
      }
      else {
        sendBtn.attr('disabled', true);
      }
    });

    jQuery('.kandyButton .btnHoldCall').click(function () {
      kandyHoldCall(this);
    });

    jQuery('.kandyButton .btnResumeCall').click(function () {
      kandyUnholdCall(this);
    });

    jQuery('.kandyButton .btnShareScreen').click(function () {
      var container = jQuery(this).data('container');
      var callId = jQuery('#' + container).data('call-id');
      if (callId) {
        kandyStartScreenSharing(callId, function () {
          changeAnswerButtonState('SHARING_SCREEN', '#' + container);
        });
      }
    });
    jQuery('.kandyButton .btnStopScreenSharing').click(function () {
      var container = jQuery(this).data('container');
      var callId = jQuery('#' + container).data('call-id');
      if (callId) {
        kandyStopScreenSharing(callId, function () {
          changeAnswerButtonState('STOP_SHARING_SCREEN', '#' + container);
        });
      }
    });
  });
  jQuery('#theirVideo, #myVideo').on('DOMSubtreeModified', function () {
    if (jQuery(this).is(':hidden')) {
      jQuery(this).show();
    }
  });
})();
