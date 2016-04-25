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
        callincoming: kandy_incoming_call_callback,
        // When an outgoing call is connected.
        oncall: kandy_on_call_callback,
        // When an incoming call is connected.
        // You indicated that you are answering the call.
        callanswered: kandy_call_answered_callback,
        callended: kandy_call_ended_callback,
        callendedfailed: kandy_on_call_ended_failed,
        callinitiated: kandy_on_call_initiate,
        callinitiatefailed: kandy_on_call_initiate_fail,
        callrejected: kandy_on_call_rejected,
        media: kandy_on_media_error
      }
    });
    if (jQuery('.kandyChat').length) {
      kandy.setup({
        listeners: {
          message: kandy_onMessage,
          chatGroupMessage: kandy_onGroupMessage,
          chatGroupInvite: kandy_onGroupInvite,
          chatGroupBoot: kandy_onRemovedFromGroup,
          chatGroupLeave: kandy_onLeaveGroup,
          chatGroupUpdate: '',
          chatGroupDelete: kandy_onTerminateGroup
        }
      });
    }
  };

  /**
   * Login Success Callback.
   */
  var kandy_login_success_callback = function () {
    kandy.getLastSeen([Drupal.settings.loginInfo.username]);
    // Have kandy Address Book widget.
    if (jQuery('.kandyAddressBook').length) {
      kandy_load_contacts_addressbook();
    }
    // Have kandy Chat widget.
    if (jQuery('.kandyChat').length) {
      kandy_load_contacts_chat();
      kandy_loadGroups();
      setTimeout(updateUserGroupStatus, 3000);

    }

    if (jQuery('#coBrowsing').length) {
      kandy_getOpenSessionsByType('cobrowsing', loadSessionList);
    }

    // Call user callback.
    if (typeof login_success_callback === 'function') {
      login_success_callback();
    }

    // Call user logout if exists.
    if (typeof kandy_logout === 'function') {
      kandy_logout();
    }
  };

  /**
   * Login Fail Callback.
   */
  var kandy_login_failed_callback = function () {
    if (typeof login_failed_callback === 'function') {
      login_failed_callback();
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
  var kandy_presence_notification_callback = function (userId, state, description) {
    // HTML id can't contain @ and jquery doesn't like periods (in id).
    var id_attrib = '.kandyAddressBook .kandyAddressContactList #presence_' + userId.replace(/[.@]/g, '_');
    jQuery(id_attrib).text(description);
    if (typeof presence_notification_callback === 'function') {
      presence_notification_callback(userId, state, description);
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
  function kandy_on_call_initiate(call) {
    jQuery('#' + activeContainerId).attr('data-call-id', call.getId());

    $audioRingIn[0].pause();
    $audioRingOut[0].play();
  }

  /**
   * Event handler for callinitiatefail event..
   */
  function kandy_on_call_initiate_fail() {
    $audioRingOut[0].pause();

  }

  /**
   * Event handler for callrejected event.
   */

  function kandy_on_call_rejected() {
    $audioRingIn[0].pause();
    UIState.callrejected();
  }

  /**
   * OnCall Callback.
   *
   * @param {object} call
   *   Kandy call object
   */
  var kandy_on_call_callback = function (call) {
    if (typeof on_call_callback === 'function') {
      on_call_callback(call);
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
  var kandy_incoming_call_callback = function (call, isAnonymous) {
    if (typeof call_incoming_callback === 'function') {
      call_incoming_callback(call, isAnonymous);
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
  var kandy_call_answered_callback = function (call, isAnonymous) {
    if (typeof call_answered_callback === 'function') {
      call_answered_callback(call, isAnonymous);
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
  var kandy_call_ended_callback = function (call) {

    $audioRingOut[0].play();
    $audioRingIn[0].pause();

    if (typeof call_ended_callback === 'function') {
      call_ended_callback();
    }

    var target = jQuery('.kandyButton[data-call-id="' + call.getId() + '"]');
    changeAnswerButtonState('READY_FOR_CALLING', target);
  };

  /**
   * Event handler for callendedfailed event.
   */
  function kandy_on_call_ended_failed() {

  }

  function kandy_on_media_error(error) {
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
        break;

      case 'RESUME_CALL':

        kandyButton.find('.kandyVideoButtonOnCall .btnResumeCall').hide();
        kandyButton.find('.kandyVideoButtonOnCall .btnHoldCall').show();
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
  var kandy_answer_video_call = function (target) {
    var kandyButtonId = jQuery(target).data('container');
    var currentCallId = jQuery('div#' + kandyButtonId).attr('data-call-id');

    activeContainerId = kandyButtonId;
    kandy.call.answerCall(currentCallId, true);
    changeAnswerButtonState('ANSWERING_CALL', '#' + kandyButtonId);
    if (typeof answer_video_call_callback === 'function') {
      answer_video_call_callback('ANSWERING_CALL');
    }
  };

  /**
   * Event when click call button PSTN.
   *
   * @param {string} target
   *   Container of button
   */
  var kandy_make_pstn_call = function (target) {

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
  var kandy_make_video_call = function (target) {

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
  var kandy_answer_voice_call = function (target) {
    var kandyButtonId = jQuery(target).data('container');
    var currentCallId = jQuery('div#' + kandyButtonId).attr('data-call-id');
    activeContainerId = kandyButtonId;
    kandy.call.answerCall(currentCallId, false);
    changeAnswerButtonState('ANSWERING_CALL', '#' + kandyButtonId);

    if (typeof answer_voice_call_callback === 'function') {
      answer_voice_call_callback('ANSWERING_CALL');
    }

  };

  /**
   * Event when click call button.
   *
   * @param {string} target
   *   Container of button
   */
  var kandy_make_voice_call = function (target) {
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
  var kandy_end_call = function (target) {
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
  var kandy_hold_call = function (target) {
    var kandyButtonId = jQuery(target).data('container');
    var currentCallId = jQuery('#' + kandyButtonId).attr('data-call-id');

    kandy.call.holdCall(currentCallId);

    activeContainerId = kandyButtonId;
    if (typeof hold_callback === 'function') {
      hold_call_callback('HOLD_CALL');
    }

    changeAnswerButtonState('HOLD_CALL', '#' + kandyButtonId);
  };

  var kandy_unhold_call = function (target) {
    var kandyButtonId = jQuery(target).data('container');
    var currentCallId = jQuery('#' + kandyButtonId).attr('data-call-id');
    activeContainerId = kandyButtonId;
    kandy.call.unHoldCall(currentCallId, function () {
      changeAnswerButtonState('ON_CALL', '#' + kandyButtonId);
    }, function () {

    });
  };

  /**
   * Presence changed callback.
   */
  var presence_changed_callback = function () {
    for (var userId in kandyPresence) {
      kandy_presence_notification_callback(userId, kandyPresence[userId].toLowerCase(), kandyPresence[userId]);
    }
  };

  /**
   * Get presence status of users.
   *
   * @param {object} lastSeen
   *   The last time user has been seen
   */
  var kandy_get_presence = function (lastSeen) {
    var get_presence_url = Drupal.settings.basePath + 'kandy/get_presence';
    jQuery.post(get_presence_url, lastSeen, function (presences) {
      presences.forEach(function (user, index) {
        kandyPresence[user.full_user_id] = user.presence_status;
      });
      presence_changed_callback();
    }, 'json');
  };

  /**
   * Get last seen of contacts.
   *
   * @param {Array} contacts
   *   Array of contacts
   */
  var get_last_seen = function (contacts) {
    contacts = contacts || [current_kandy_user];
    kandy.getLastSeen(contacts, function (result) {
      kandy_get_presence(result);
    });
  };

  /**
   * Get contacts last seen continuously.
   *
   * @param {Array} contacts
   *   Array of contacts
   */
  var get_last_seen_interval = function (contacts) {
    get_last_seen(contacts);
    if (last_seen_interval) {
      clearInterval(last_seen_interval);
    }
    last_seen_interval = setInterval(get_last_seen, 10000, contacts);
  };

  /**
   * Add AddressBook widget.
   */
  var kandy_load_contacts_addressbook = function () {
    var contactListForPresence = [];
    var i = 0;
    var deleteContact = [];
    kandy.addressbook.retrievePersonalAddressBook(
      function (results) {
        var get_name_for_contact_url = jQuery('.kandyAddressBook #get_name_for_contact_url').val();
        results = get_display_name_for_contact(results, get_name_for_contact_url);
        // Clear out the current address book list.
        jQuery('.kandyAddressBook .kandyAddressContactList div:not(:first)').remove();
        var div = null;
        if (results.length === 0) {
          div = "<div class='kandyAddressBookNoResult'>-- No Contacts --</div>";
          jQuery('.kandyAddressBook .kandyAddressContactList').append(div);
          get_last_seen_interval();
        }
        else {
          jQuery('.kandyAddressBook .kandyAddressContactList').append("<div class='kandy-contact-heading'><span class='displayname'><b>Username</b></span><span class='userId'><b>Contact</b></span><span class='presence'><b>Status</b></span></div>");
          for (i = 0; i < results.length; i++) {
            if (results[i].display_name !== 'kandy-un-assign-user') {
              contactListForPresence.push(results[i].contact_user_name);

              var id_attr = results[i].contact_user_name.replace(/[.@]/g, '_');
              var markup = // HTML id can't contain @ and jquery doesn't like periods (in id).
                '<div class="kandyContactItem" id="uid_' + id_attr + '">' +
                '<span class="displayname">' + results[i].display_name + '</span>' +
                '<span class="userId">' + results[i].contact_user_name + '</span>' +
                '<span id="presence_' + id_attr + '" class="presence"></span>' +
                '<input class="removeContactBtn" type="button" value="Remove" ' +
                ' data-contact-id="' + results[i].contact_id + '">' +
                '</div>';
              jQuery('.kandyAddressBook .kandyAddressContactList').append(markup);
            }
            else {
              deleteContact.push({id_attr: id_attr, contact_id: results[i].contact_id});
            }
          }
          get_last_seen_interval(contactListForPresence);

          // Delete empty contact id.
          for (i = 0; i < deleteContact.length; i++) {
            var contact_id = deleteContact[i].contact_id;
            kandy_removeFromContacts(contact_id);
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
  var get_display_name_for_contact = function (data, url) {
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
  var get_display_name_for_chat_content = function (msg, url) {
    if (msg) {
      jQuery.ajax({
        url: url,
        type: 'POST',
        data: {data: msg},
        async: false
      }).done(function (response) {
        msg = response;
      }).fail(function (e) {
      });
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
  var kandy_myStatusChanged = function (status) {
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
                kandy_load_contacts_addressbook,
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
  var kandy_removeFromContacts = function (nickname) {
    kandy.addressbook.removeFromPersonalAddressBook(nickname, kandy_load_contacts_addressbook);
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
    var username = user.contact_user_name;
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
    var result =
      '<li ' + userHoldingAttribute + '="' + user + '">' +
      '<div class="kandyMessages" data-user="' + user + '">' +
      '</div>' +
      '<div >Messages:</div>' +
      '<div>' +
      '<form class="send-message" data-real-id="' + uid + '" data-user="' + user + '">' +
      '<div class="input-message">' +
      '<input class="imMessageToSend chat-input" type="text" data-user="' + user + '">' +
      '</div>' +
      '<div class="button-send">' +
      '<input class="btnSendMessage chat-input" type="submit" value="Send"  data-user="' + user + '" >' +
      '</div>' +
      '</form>' +
      '</div>' +
      '</li>';
    return result;

  };

  /**
   * Kandy Contact Filter Change.
   *
   * @param {string} val
   *   Changed value
   */
  var kandy_contactFilterChanged = function (val) {
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
  var kandy_load_contacts_chat = function () {
    var contactListForPresence = [];
    kandy.addressbook.retrievePersonalAddressBook(
      function (results) {
        if (results.length) {
          var get_name_for_contact_url = jQuery('.kandyChat #get_name_for_contact_url').val();
          results = get_display_name_for_contact(results, get_name_for_contact_url);
          emptyContact();
          for (var i = 0; i < results.length; i++) {
            prependContact(results[i]);
            contactListForPresence.push(results[i].contact_user_name);
          }
          addExampleBox();
          get_last_seen_interval(contactListForPresence);
        }
        else {
          get_last_seen_interval();
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
  var kandy_send_message = function (username, dataHolder) {
    var displayName = jQuery('.kandyChat .kandy_current_username').val();
    dataHolder = (typeof dataHolder != 'undefined') ? dataHolder : username;
    var inputMessage = jQuery('.kandyChat .imMessageToSend[data-user="' + dataHolder + '"]');
    var message = inputMessage.val();
    inputMessage.val('');
    kandy.messaging.sendIm(username, message,
      function () {
        var newMessage = '<div class="my-message">' +
          '<b><span class="imUsername">' + displayName + ':</span></b>' +
          '<span class="imMessage">' + message + '</span>' +
          '</div>';
        var messageDiv = jQuery('.kandyChat .kandyMessages[data-user="' + dataHolder + '"]');
        messageDiv.append(newMessage);
        messageDiv.scrollTop(messageDiv[0].scrollHeight);
      },
      function () {
        alert('IM send failed');
      }
    );
  };

  /**
   * On Message event listener callback.
   *
   * @param {object} msg
   *   Message object received
   */
  var kandy_onMessage = function (msg) {
    if (msg) {
      var url = jQuery('.kandyChat #get_name_for_chat_content_url').val();
      msg = get_display_name_for_chat_content(msg, url);
    }
    if (msg.messageType === 'chat' && msg.contentType === 'text' && msg.message.mimeType === 'text/plain') {
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
        move_contact_to_top_and_set_active(msg.sender);
      }
      else {
        move_contact_to_top(msg.sender);
      }
      // Process message.
      if ((msg.hasOwnProperty('message'))) {
        msg = msg.message.text;
        var newMessage = '<div class="their-message">' +
          '<b><span class="imUsername">' + displayName + ':</span></b>' +
          '<span class="imMessage">' + msg + '</span>' +
          '</div>';
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
  var move_contact_to_top = function (user) {
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
  var move_contact_to_top_and_set_active = function (user) {
    move_contact_to_top(user);
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
    participants = get_display_name_for_contact(participants, get_name_for_contact_url);
    if (participants.length) {
      for (var i in participants) {
        displayNames[participants[i].full_user_id] = participants[i].display_name;
        if (!jQuery(listUsersGroup).find('li[data-user="' + participants[i].full_user_id + '"]').length) {
          var status = '';
          var additionBtn = '';
          var displayName = displayNames[participants[i].full_user_id];
          if (admin_id === participants[i].full_user_id) {
            displayName += '<span> (owner)</span>';
          }
          jQuery(listUsersGroup).append(
            '<li data-user="' + participants[i].full_user_id + '">' +
            '<a>' + displayName + '</a>' +
            '<span class="actions">' + additionBtn + '</span>' +
            '<div class="statusContainer"><i class="status"></i>' + ((status) ? '<i class="group-status">(' + status + ')</i>' : '') + '</div>' +
            '</li>'
          );
        }
      }
    }

  };

  /**
   * Load open group chat.
   */
  var kandy_loadGroups = function () {
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
                  '<i class="toggle fa fa-plus-square-o"></i>' +
                  '<a data-content="' + result.groups[i].group_id + '" href="#">' +
                  result.groups[i].group_name +
                  '</a>' +
                  '<div class="groupAction"></div>' +
                  '<ul class="list-users"></ul>' +
                  '</li>'
                );
              }
              if (!jQuery(liContentWrapSelector + ' li[' + userHoldingAttribute + '="' + result.groups[i].group_id + '"]').length) {
                var liContent = getGroupContent(result.groups[i].group_id);
                jQuery(liContentWrapSelector).prepend(liContent);
              }
              kandy_loadGroupDetails(result.groups[i].group_id);

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
  var kandy_onGroupMessage = function (msg) {
    if (typeof msg !== 'undefined') {
      var msgType = msg.messageType;
      var sender = displayNames[msg.sender.full_user_id] || msg.sender.user_id;
      if (msgType === 'groupChat') {
        if (msg.contentType === 'text') {
          var newMessage = '<div class="their-message">' +
            '<b><span class="imUsername">' + sender + ':</span></b>' +
            '<span class="imMessage">' + msg.message.text + '</span>' +
            '</div>';
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
  var kandy_inviteUserToGroup = function (group_id, members) {
    kandy.messaging.addGroupMembers(group_id, members,
      function (results) {
        kandy_loadGroupDetails(group_id);
      }
    );
  };

  /* On group invite user event */

  var kandy_onGroupInvite = function () {
    kandy_loadGroups();
  };

  /**
   * User removed from group chat event.
   *
   * @param {object} message
   *   Message
   */
  var kandy_onRemovedFromGroup = function (message) {
    if (message.messageType === 'chatGroupBoot') {
      var bootedUser = message.booted[0];
      var notify;
      if (bootedUser !== current_kandy_user) {
        notify = (displayNames[bootedUser] || bootedUser.split('@')[0]) + ' is removed from this group';
        kandy_loadGroupDetails(message.group_id);
      }
      else {
        notify = 'You are removed from this group';
        kandy_loadGroups();
        changeGroupInputState(message.group_id, true);
      }
      var newMessage = '<div class="their-message"><span class="imMessage">' +
        '<i>' + notify + '</i></span></div>';
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
    var result =
      '<li ' + userHoldingAttribute + '="' + groupId + '">' +
      '<div class="kandyMessages" data-group="' + groupId + '"></div>' +
      '<div >Messages:</div>' +
      '<div class="">' +
      '<form class="send-message" data-group="' + groupId + '">' +
      '<div class="input-message">' +
      '<input class="imMessageToSend chat-input" type="text" data-group="' + groupId + '">' +
      '</div>' +
      '<div class="button-send">' +
      '<input class="btnSendMessage chat-input" type="submit" value="Send"  data-group="' + groupId + '" >' +
      '</div>' +
      '</form>' +
      '</div>' +
      '</li>';
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
  var kandy_createGroup = function (groupName, successCallback, failCallback) {
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
  var kandy_sendGroupIm = function (groupId, msg) {
    var username = jQuery('input.kandy_current_username').val();
    kandy.messaging.sendGroupIm(groupId, msg,
      function () {
        var newMessage = '<div class="my-message">' +
          '<b><span class="imUsername">' + username + ':</span></b>' +
          '<span class="imMessage">' + msg + '</span>' +
          '</div>';
        var messageDiv = jQuery('.kandyChat .kandyMessages[data-group="' + groupId + '"]');
        messageDiv.append(newMessage);
        messageDiv.scrollTop(messageDiv[0].scrollHeight);
      },
      function (msg) {
        // Show error message for current user.
        var errorMessage = '<div class="their-message">' +
          '<span class="imMessage"><i>Error: ' + msg + '</i></span>' +
          '</div>';
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
  var kandy_onLeaveGroup = function (message) {
    if (message.messageType === 'chatGroupLeave') {
      var leaverDisplayName = displayNames[message.leaver] || message.split('@')[0];
      var groupId = message.group_id;
      if (message.leaver !== current_kandy_user) {
        kandy_loadGroupDetails(message.group_id);
      }
      else {
        kandy_loadGroups();
        changeGroupInputState(message.group_id, true);
      }
      var newMessage = '<div class="their-message">' +
        '<span class="imMessage"><i>' + leaverDisplayName + ' has left</i></span>' +
        '</div>';
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
  var kandy_removeFromGroup = function (groupId, userId) {
    var members = [];
    members.push(userId);
    var displayName = displayNames[userId] || userId.split('@')[0];
    var confirm = window.confirm('Do you want to remove ' + displayName + ' from this group?');
    if (confirm) {
      kandy.messaging.removeGroupMembers(groupId, members,
        function () {
          kandy_loadGroupDetails(groupId);
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
  var kandy_leaveGroup = function (groupId, successCallback, failCallback) {
    var confirm = window.confirm('Do you want to leave group ' + groupNames[groupId] + '?');
    if (confirm) {
      kandy.messaging.leaveGroup(groupId, successCallback, failCallback);
    }
  };

  /**
   * Terminate a session.
   *
   * @param groupId
   *   Group id to terminate
   * @param {function} successCallback
   *   Terminate success callback
   * @param {function} failCallback
   *   Terminate fail callback
   */
  var kandy_terminateGroup = function (groupId, successCallback, failCallback) {
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
  var kandy_onTerminateGroup = function (notification) {
    removeGroupContent(notification.group_id);
    kandy_loadGroups();
  };

  /**
   * Clean things up after remove group.
   *
   * @param {string} sessionId
   *   Session id to be removed
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
  };

  /**
   * Load group chat detail.
   *
   * @param {string} groupId
   *   Group id to load
   */
  var kandy_loadGroupDetails = function (groupId) {
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
  var kandy_sendSms = function (receiver, sender, message, successCallback, errorCallback) {
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

  /**
   * OnJoinApprove event use for co-browsing session.
   *
   * @param {object} notification
   *   Session join notification obj.
   */
  window.kandy_onSessionJoinApprove = function (notification) {
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
  window.kandy_approveJoinSession = function (sessionId, userId, successCallback) {
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
  window.kandy_getOpenSessionsByType = function (sessionType, successCallback) {
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
  window.kandy_getSessionInfo = function (sessionId, successCallback, failCallback) {
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
  window.kandy_terminateSession = function (sessionId, successCallback) {
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
  window.kandy_joinSession = function (sessionId, successCallback) {
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
  window.kandy_leaveSession = function (sessionId, successCallBack) {
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
  function check_scrolling(tabs) {
    var totalTabWidth = parseInt(tabs.children('.cd-tabs-navigation').width());
    var tabsViewport = parseInt(tabs.width());
    if (tabs.scrollLeft() >= totalTabWidth - tabsViewport) {
      tabs.parent('.cd-tabs').addClass('is-ended');
    }
    else {
      tabs.parent('.cd-tabs').removeClass('is-ended');
    }
  }

  function kandy_start_screen_sharing(callId, success_callback, fail_callback) {
    kandy.call.startScreenSharing(callId, success_callback, fail_callback);
  }

  function kandy_stop_screen_sharing(callId, success_callback, fail_callback) {
    kandy.call.stopScreenSharing(callId, success_callback, fail_callback);
  }

  /**
   * Kandy Ready.
   */
  jQuery(document).ready(function (jQuery) {
    // Register kandy widget event.
    setup();
    login(Drupal.settings.loginInfo.apiKey, Drupal.settings.loginInfo.username, Drupal.settings.loginInfo.password, kandy_login_success_callback, kandy_login_failed_callback);

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
        kandy_make_voice_call(this);
      });

      jQuery('.kandyButton .btnEndCall').click(function () {
        kandy_end_call(this);
      });

      jQuery('.kandyButton .btnAnswerVoiceCall').click(function () {
        kandy_answer_voice_call(this);
      });

      jQuery('.kandyButton .btnCallPstn').click(function () {
        kandy_make_pstn_call(this);
      });

      jQuery('.kandyButton .btnVideoCall').click(function () {
        kandy_make_video_call(this);
      });

      jQuery('.kandyButton .btmAnswerVideoCall').click(function () {
        kandy_answer_video_call(this);
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
        kandy_removeFromContacts(jQuery(this).data('contact-id'));
      });

    }
    jQuery('.kandyMyStatusDropDown').on('change', function () {
      kandy_myStatusChanged(jQuery(this).val());
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
          kandy_send_message(realID, username);
        }
        else {
          kandy_sendGroupIm(jQuery(this).data('group'), jQuery(this).find('.imMessageToSend').val());
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
          kandy_createGroup(groupName, kandy_loadGroups);
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
          kandy_inviteUserToGroup(groupId, [username]);
          jQuery('#kandy-chat-invite-username').val('');
          jQuery('#kandy-chat-add-user-modal').hide();
        }
      });

      jQuery('#contactFilter').on('change', function () {
        kandy_contactFilterChanged(jQuery(this).val());
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
        kandy_leaveGroup($(this).data('group-id'), kandy_loadGroups);
      });

      jQuery('.kandyChat').on('click', '.btnRemoveGroup', function () {
        kandy_terminateGroup($(this).data('group-id'), kandy_loadGroups);
      });

      jQuery('.list-users li .remove').live('click', function (e) {
        var userId = jQuery(this).closest('li').data('user');
        var groupId = jQuery(this).closest('[data-group]').data('group');
        kandy_removeFromGroup(groupId, userId);
      });

      var tabContentWrapper = jQuery(liContentWrapSelector);

      jQuery('.cd-tabs-navigation > li > a').live('click', function (event) {
        event.preventDefault();
        var selectedItem = jQuery(this);
        if (!selectedItem.hasClass('selected')) {
          var selectedTab = selectedItem.data('content');
          var selectedContent = tabContentWrapper.find('li[data-content="' + selectedTab + '"]');
          var selectedContentHeight = jQuery('.cd-tabs-navigation').parent('nav').height();

          jQuery('.cd-tabs-navigation a').removeClass('selected');
          selectedItem.addClass('selected');
          selectedContent.addClass('selected').siblings('li').removeClass('selected');
          selectedContent.find('.imMessageToSend').focus();

          jQuery('.chat-with-message').show();
          jQuery('.chat-friend-name').html(selectedItem.html());

          // Animate tabContentWrapper height when content changes.
          tabContentWrapper.animate({
            height: selectedContentHeight
          }, 200);
        }
      });

      // Hide the .cd-tabs::after element when tabbed navigation has scrolled to the end (mobile version).
      check_scrolling(jQuery('.cd-tabs nav'));

      jQuery(window).live('resize', function () {
        check_scrolling(jQuery('.cd-tabs nav'));
      });

      jQuery('.cd-tabs nav').live('scroll', function () {
        check_scrolling(jQuery(this));
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
      kandy_sendSms(to, '', message, function (data) {
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
      kandy_hold_call(this);
    });

    jQuery('.kandyButton .btnResumeCall').click(function () {
      kandy_unhold_call(this);
    });

    jQuery('.kandyButton .btnShareScreen').click(function () {
      var container = jQuery(this).data('container');
      var callId = jQuery('#' + container).data('call-id');
      if (callId) {
        kandy_start_screen_sharing(callId, function () {
          changeAnswerButtonState('SHARING_SCREEN', '#' + container);
        });
      }
    });
    jQuery('.kandyButton .btnStopScreenSharing').click(function () {
      var container = jQuery(this).data('container');
      var callId = jQuery('#' + container).data('call-id');
      if (callId) {
        kandy_stop_screen_sharing(callId, function () {
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
