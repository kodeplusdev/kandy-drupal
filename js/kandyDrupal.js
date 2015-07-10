/**
 * @file
 * KANDY SETUP AND LISTENER CALLBACK.
 */
(function() {
  var activeContainerId;

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
    // Initialize KandyAPI.Phone, passing a config JSON object that contains listeners (event callbacks).
    KandyAPI.Phone.setup({

      remoteVideoContainer: jQuery('#theirVideo')[0],
      localVideoContainer: jQuery('#myVideo')[0],

      // Respond to Kandy events.
      listeners: {
        loginsuccess: kandy_login_success_callback,
        loginfailed: kandy_login_failed_callback,
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
        presencenotification: kandy_presence_notification_callback
      }
    });
    if (jQuery(".kandyChat").length) {
      kandy.setup({
        listeners: {
          chatGroupMessage: kandy_onGroupMessage,
          chatGroupInvite: kandy_onGroupInvite,
          chatGroupBoot: kandy_onRemovedFromGroup,
          chatGroupLeave: kandy_onLeaveGroup,
          chatGroupUpdate: '',
          chatGroupDelete: kandy_onTerminateGroup
        }
      })
    }
  };

  /**
   * Login Success Callback.
   */
  var kandy_login_success_callback = function () {
    KandyAPI.Phone.updatePresence(0);

    // Have kandy Address Book widget.
    if (jQuery(".kandyAddressBook").length) {
      kandy_loadContacts_addressBook();
    }
    // Have kandy Chat widget.
    if (jQuery(".kandyChat").length) {
      kandy_load_contacts_chat();
      kandy_loadGroups();
      setInterval(kandy_getIms, 3000);
      setTimeout(updateUserGroupStatus, 3000);

    }
    // Call user callback.
    if (typeof login_success_callback == 'function') {
      login_success_callback();
    }

    // Call user logout if exists.
    if (typeof kandy_logout == 'function') {
      kandy_logout();
    }
  };

  /**
   * Login Fail Callback.
   */
  var kandy_login_failed_callback = function () {
    if (typeof login_failed_callback == 'function') {
      login_failed_callback();
    }
  };

  /**
   * Status Notification Callback.
   *
   * @param userId
   * @param state
   * @param description
   * @param activity
   */
  var kandy_presence_notification_callback = function (userId, state, description, activity) {
    // HTML id can't contain @ and jquery doesn't like periods (in id).
    var id_attrib = '.kandyAddressBook .kandyAddressContactList #presence_' + userId.replace(/[.@]/g, '_');
    jQuery(id_attrib).text(description);
    if (typeof presence_notification_callback == 'function') {
      presence_notification_callback(userId, state, description, activity);
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
   * @param call
   */
  function kandy_on_call_initiate(call) {
    jQuery("#" + activeContainerId).attr("data-call-id", call.getId());

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
   * @param call
   */
  var kandy_on_call_callback = function (call) {
    if (typeof on_call_callback == 'function') {
      on_call_callback(call);
    }
    $audioRingOut[0].pause();

    var target = jQuery('.kandyVideoButtonCalling:visible').get(0).closest('.kandyButton');
    changeAnswerButtonState("ON_CALL", target);
  };

  /**
   * Incoming Callback.
   *
   * @param call
   * @param isAnonymous
   */
  var kandy_incoming_call_callback = function (call, isAnonymous) {
    if (typeof call_incoming_callback == 'function') {
      call_incoming_callback(call, isAnonymous);
    }

    $audioRingIn[0].play();

    var target = jQuery('.kandyVideoButtonCallOut:visible').get(0).closest('.kandyButton');
    jQuery(target).attr("data-call-id", call.getId());
    changeAnswerButtonState('BEING_CALLED', target);
  };

  /**
   * Kandy call answered callback.
   *
   * @param call
   * @param isAnonymous
   */
  var kandy_call_answered_callback = function (call, isAnonymous) {
    if (typeof call_answered_callback == 'function') {
      call_answered_callback(call, isAnonymous);
    }

    $audioRingOut[0].pause();
    $audioRingIn[0].pause();

    var target = jQuery('.kandyVideoButtonSomeonesCalling:visible').get(0).closest('.kandyButton');
    changeAnswerButtonState("ON_CALL", target);
  };

  /**
   * Kandy call ended callback.
   */
  var kandy_call_ended_callback = function (call) {

    $audioRingOut[0].play();
    $audioRingIn[0].pause();

    if (typeof call_ended_callback == 'function') {
      call_ended_callback();
    }

    var $target = jQuery('.kandyButton[data-call-id="' + call.getId() + '"]');
    changeAnswerButtonState("READY_FOR_CALLING", $target);
  };

  /**
   * Event handler for callendedfailed event.
   */
  function kandy_on_call_ended_failed() {

  }

  /**
   * Change AnswerButtonState with KandyButton Widget.
   *
   * @param target
   * @param state
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
        break;

      case 'BEING_CALLED':
        kandyButton.find('.kandyVideoButtonSomeonesCalling').show();
        kandyButton.find('.kandyVideoButtonCallOut').hide();
        kandyButton.find('.kandyVideoButtonCalling').hide();
        kandyButton.find('.kandyVideoButtonOnCall').hide();
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
        break;
    }
  };

  /**
   * Event when answer a call.
   *
   * @param target
   */
  var kandy_answer_video_call = function (target) {
    var kandyButtonId = jQuery(target).data('container');
    var currentCallId = jQuery("div#" + kandyButtonId).attr("data-call-id");

    activeContainerId = kandyButtonId;
    KandyAPI.Phone.answerCall(currentCallId, true);
    changeAnswerButtonState("ANSWERING_CALL", '#' + kandyButtonId);
    if (typeof answer_video_call_callback == 'function') {
      answer_video_call_callback("ANSWERING_CALL");
    }
  };

  /**
   * Event when answer a call.
   *
   * @param target
   */
  var kandy_reject_video_call = function (target) {
    var kandyButtonId = jQuery(target).data('container');
    var currentCallId = jQuery("div#" + kandyButtonId).attr("data-call-id");
    KandyAPI.Phone.rejectCall(currentCallId);

    target = jQuery(target).closest('.kandyButton');
    changeAnswerButtonState("READY_FOR_CALLING", target);
    if (typeof reject_video_call_callback == 'function') {
      reject_video_call_callback("READY_FOR_CALLING");
    }
  };

  /**
   * Event when click call button PSTN.
   *
   * @param target
   */
  var kandy_make_pstn_call = function (target) {

    var kandyButtonId = jQuery(target).data('container');
    activeContainerId = kandyButtonId;
    var number = jQuery('#' + kandyButtonId + ' .kandyVideoButtonCallOut #' + kandyButtonId + '-callOutUserId').val();
    var userName = jQuery('#' + kandyButtonId + ' .kandyVideoButtonCallOut #' + kandyButtonId + '-callOutUserId').val()

    KandyAPI.Phone.makePSTNCall(number, userName);

    target = jQuery(target).closest('.kandyButton');
    changeAnswerButtonState("CALLING", target);
  };

  /**
   * Event when click call button.
   *
   * @param target
   */
  var kandy_make_video_call = function (target) {

    var kandyButtonId = jQuery(target).data('container');
    activeContainerId = kandyButtonId;
    var userName = jQuery('#' + kandyButtonId + ' .kandyVideoButtonCallOut #' + kandyButtonId + '-callOutUserId').val();

    KandyAPI.Phone.makeCall(userName, true);
    changeAnswerButtonState("CALLING", '#' + kandyButtonId);
  };

  /**
   * Event when answer a voice call.
   *
   * @param target
   */
  var kandy_answerVoiceCall = function (target) {
    var kandyButtonId = jQuery(target).data('container');
    var currentCallId = jQuery("div#" + kandyButtonId).attr("data-call-id");
    activeContainerId = kandyButtonId;
    KandyAPI.Phone.answerCall(currentCallId, false);
    changeAnswerButtonState("ANSWERING_CALL", '#' + kandyButtonId);

    if (typeof answer_voice_call_callback == 'function') {
      answer_voice_call_callback("ANSWERING_CALL");
    }

  };

  /**
   * Event when click call button.
   *
   * @param target
   */
  var kandy_makeVoiceCall = function (target) {
    var kandyButtonId = jQuery(target).data('container');
    activeContainerId = kandyButtonId;
    var userName = jQuery('#' + kandyButtonId + ' .kandyVideoButtonCallOut #' + kandyButtonId + '-callOutUserId').val();
    KandyAPI.Phone.makeCall(userName, false);
    changeAnswerButtonState("CALLING", '#' + kandyButtonId);
  };

  /**
   * Event when click end call button.
   */
  var kandy_end_call = function (target) {
    var kandyButtonId = jQuery(target).data('container');
    var currentCallId = jQuery("div#" + kandyButtonId).attr("data-call-id");
    KandyAPI.Phone.endCall(currentCallId);
    activeContainerId = kandyButtonId;
    if (typeof end_call_callback == 'function') {
      end_call_callback('READY_FOR_CALLING');
    }
    changeAnswerButtonState("READY_FOR_CALLING", '#' + kandyButtonId);
  };

  /**
   * Event when click hold call button.
   */
  var kandy_hold_call = function (target) {
    var kandyButtonId = jQuery(target).data('container');
    var currentCallId = jQuery("#" + kandyButtonId).attr("data-call-id");

    KandyAPI.Phone.holdCall(currentCallId);

    activeContainerId = kandyButtonId;
    if (typeof hold_callback == 'function') {
      hold_call_callback('HOLD_CALL');
    }

    changeAnswerButtonState("HOLD_CALL", '#' + kandyButtonId);
  };

  /**
   * Event when click resume call button.
   */
  var kandy_resume_call = function (target) {
    var kandyButtonId = jQuery(target).data('container');
    var currentCallId = jQuery("#" + kandyButtonId).attr("data-call-id");

    KandyAPI.Phone.unHoldCall(currentCallId);

    activeContainerId = kandyButtonId;
    if (typeof hold_callback == 'function') {
      hold_call_callback('RESUME_CALL');
    }

    changeAnswerButtonState("RESUME_CALL", '#' + kandyButtonId);
  };

  /**
   * Add AddressBook widget.
   */
  var kandy_loadContacts_addressBook = function () {
    var contactListForPresence = [];
    var i = 0;
    var deleteContact = [];
    KandyAPI.Phone.retrievePersonalAddressBook(
      function (results) {
        var get_name_for_contact_url = jQuery(".kandyAddressBook #get_name_for_contact_url").val();
        results = get_display_name_for_contact(results, get_name_for_contact_url);

        // Clear out the current address book list.
        jQuery(".kandyAddressBook .kandyAddressContactList div:not(:first)").remove();
        var div = null;
        if (results.length == 0) {
          div = "<div class='kandyAddressBookNoResult'>-- No Contacts --</div>";
          jQuery('.kandyAddressBook .kandyAddressContactList').append(div);
        }
        else {
          jQuery('.kandyAddressBook .kandyAddressContactList').append("<div class='kandy-contact-heading'><span class='displayname'><b>Username</b></span><span class='userId'><b>Contact</b></span><span class='presence'><b>Status</b></span></div>");
          for (i = 0; i < results.length; i++) {
            if (results[i].display_name != "kandy-un-assign-user") {
              contactListForPresence.push({full_user_id: results[i].contact_user_name});

              var id_attr = results[i].contact_user_name.replace(/[.@]/g, '_');
              jQuery('.kandyAddressBook .kandyAddressContactList').append(
                // HTML id can't contain @ and jquery doesn't like periods (in id).
                "<div class='kandyContactItem' id='uid_" + id_attr + "'>" +
                "<span class='displayname'>" + results[i].display_name + "</span>" +
                "<span class='userId'>" + results[i].contact_user_name + "</span>" +
                "<span id='presence_" + id_attr + "' class='presence'></span>" +
                "<input class='removeBtn' type='button' value='Remove' " +
                " onclick='kandy_removeFromContacts(\"" + results[i].contact_id + "\")'>" +
                "</div>"
              );
            }
            else {
              deleteContact.push({id_attr: id_attr, contact_id: results[i].contact_id});
            }
          }
          KandyAPI.Phone.watchPresence(contactListForPresence);

          // Delete empty contact id.
          for (i = 0; i < deleteContact.length; i++) {
            var contact_id = deleteContact[i].contact_id;
            kandy_removeFromContacts(contact_id);
          }
        }
      },
      function () {
        console.log("Error kandy_loadContacts_addressBook");
      }
    );
  };

  /**
   * Get display name for contacts.
   *
   * @param data
   * Data.
   *
   * @returns {*}
   */
  var get_display_name_for_contact = function (data, url) {
    if (data.length) {
      jQuery.ajax({
        url: url,
        type: "POST",
        data: {data: data},
        async: false
      }).done(function (response) {
        data = JSON.parse(response);
      }).fail(function (e) {
      });
    }
    return data;

  };

  /**
   * Get display name for chat content.
   *
   * @param data
   * Data.
   *
   * @returns {*}
   */
  var get_display_name_for_chat_content = function (data, url) {
    if (data.messages.length) {
      jQuery.ajax({
        url: url,
        type: "POST",
        data: {data: data.messages},
        async: false
      }).done(function (response) {
        data.messages = JSON.parse(response);
      }).fail(function (e) {
      });
    }
    return data;

  };
  /**
   * Add contact.
   */
  var addContacts = function () {
    var contactId = jQuery(".kandyAddressBook #kandySearchUserName").val();
    kandy_addToContacts(contactId);
    jQuery(".kandyAddressBook #kandySearchUserName").select2('val', '');

  };

  /**
   * Change current user status with kandyAddressBook.
   *
   * @param status
   */
  var kandy_myStatusChanged = function (status) {
    KandyAPI.Phone.updatePresence(status);

  };

  var userIdToAddToContacts = null;

  /**
   * Add a user to contact list with kandyAddressBook.
   *
   * @param userId
   */
  var kandy_addToContacts = function (userId) {
    userIdToAddToContacts = userId;
    var contact;
    // HTML id can't contain @ and jquery doesn't like periods (in id).
    if (jQuery('#uid_' + userId.replace(/[.@]/g, '_')).length > 0) {
      alert("This person is already in your contact list.")
    }
    else {
      // Get and AddressBook.Entry object for this contact.
      KandyAPI.Phone.searchDirectoryByUserName(
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

              KandyAPI.Phone.addToPersonalAddressBook(
                contact,
                kandy_loadContacts_addressBook,
                function (message) {
                  alert("Error: " + message);
                }
              );
              break;
            }
          }
        },
        function (statusCode) {
          console.log("Error getting contact details: " + statusCode)
        }
      );
    }
  };

  /**
   * Remove a user from Contact List with kandyAddressBook.
   *
   * @param nickname
   */
  var kandy_removeFromContacts = function (nickname) {
    KandyAPI.Phone.removeFromPersonalAddressBook(nickname,
      kandy_loadContacts_addressBook,
      function () {
        console.log('Error kandy_removeFromContacts ');
      }
    );
  };

  /**
   * Search contact list by username with kandyAddressBook.
   */
  var kandy_searchDirectoryByUserName = function () {
    var userName = jQuery('.kandyAddressBook .kandyDirectorySearch #kandySearchUserName').val();
    var get_name_for_contact_url = jQuery(".kandyAddressBook #get_user_for_search_url").val();
    jQuery.ajax({
      url: get_name_for_contact_url,
      data: {query: userName}
    }).done(function (results) {
      results = JSON.parse(results);
      jQuery(".kandyAddressBook .kandyDirSearchResults div:not(:first)").remove();
      var div = null;
      if (results.length == 0) {
        div = "<div class='kandyAddressBookNoResult'>-- No Matches Found --</div>";
        jQuery('.kandyAddressBook .kandyDirSearchResults').append(div);
      }
      else {
        for (var i = 0; i < results.length; i++) {
          jQuery('.kandyDirSearchResults').append(
            "<div class='kandySearchItem'><span class='userId'>" + results[i].main_username + "</span><input type='button' value='Add Contact' onclick='kandy_addToContacts(\"" +
            results[i].kandy_full_username + "\")' /></div>"
          );
        }
      }
    }).fail(function () {
      jQuery(".kandyAddressBook .kandyDirSearchResults div:not(:first)").remove();
      var div = "<div class='kandyAddressBookNoResult'>There was an error with your request.</div>";
      jQuery('.kandyAddressBook .kandyDirSearchResults').append(div);
    });
  };

  /**
   * KANDY CHAT WIDGET FUNCTION.
   */

  var wrapDivClass = "kandyChat";
  var liTabWrapClass = "cd-tabs-navigation";
  var liContentWrapClass = "cd-tabs-content";
  var liTabWrapSelector = "." + wrapDivClass + " ." + liTabWrapClass;
  var liContentWrapSelector = "." + wrapDivClass + " ." + liContentWrapClass;

  var userHoldingAttribute = "data-content";
  var activeClass = "selected";
  var chatMessageTimeStamp = 0;

  var listUserClass = 'list-users';
  var liTabGroupsWrap = liTabWrapSelector + '.groups';
  var liTabContactWrap = liTabWrapSelector + '.contacts';
  var groupSeparator = '.' + wrapDivClass + ' .separator';
  var displayNames = [];
  var groupNames = [];
  var usersStatus = {};

  var sessionListeners = [];

  /**
   * Add an example chat box.
   */
  var addExampleBox = function () {
    var tabId = "example";
    jQuery(liContentWrapSelector).append(getLiContent(tabId));
    jQuery(liContentWrapSelector).find('li[data-content="' + tabId + '"]').addClass('selected').find(".chat-input").attr('disabled', true);
  };

  /**
   * Get a contact template.
   *
   * @param user
   * User.
   * @param active
   * Active.
   *
   * @returns {string}
   */
  var getLiContact = function (user, active) {
    var username = user.contact_user_name;
    var displayName = user.display_name;
    var id = username.replace(/[.@]/g, '_');
    var liClass = (typeof active !== 'undefined') ? active : "";
    return '<li id="' + id + '" class="' + liClass + '"><a ' + userHoldingAttribute + '="' + username + '" href="#">' + displayName + '</a><i class="status"></i></li>';
  };

  /**
   * Get contact content template.
   *
   * @param user
   * User.
   *
   * @returns {string}
   */
  var getLiContent = function (user) {
    var result =
      '<li ' + userHoldingAttribute + '="' + user + '">\
                <div class="kandyMessages" data-user="' + user + '">\
                </div>\
                <div >\
                    Messages:\
                </div>\
                <div>\
                            <form class="send-message" data-user="' + user + '">\
                        <div class="input-message">\
                            <input class="imMessageToSend chat-input" type="text" data-user="' + user + '">\
                        </div>\
                        <div class="button-send">\
                            <input class="btnSendMessage chat-input" type="submit" value="Send"  data-user="' + user + '" >\
                        </div>\
                    </form>\
                </div>\
            </li>';
    return result;

  };

  /**
   * Kandy Contact Filter Change.
   *
   * @param val
   */
  var kandy_contactFilterChanged = function (val) {
    var liUserchat = jQuery(".kandyChat .cd-tabs-navigation li");
    jQuery.each(liUserchat, function (index, target) {
      var liClass = jQuery(target).attr('class');
      var currentClass = "kandy-chat-status-" + val;
      var currentGroupClass = "kandy-chat-status-g-" + val;
      if (val == "all") {
        jQuery(target).show();
      }
      else if ((currentClass == liClass) || jQuery(target).hasClass(currentGroupClass)) {
        jQuery(target).show();
      }
      else {
        jQuery(target).hide();
      }
    });
  };
  /**
   * Load Contact for KandyChat.
   */
  var kandy_load_contacts_chat = function () {
    var contactListForPresence = [];

    KandyAPI.Phone.retrievePersonalAddressBook(
      function (results) {
        var get_name_for_contact_url = jQuery(".kandyChat #get_name_for_contact_url").val();
        results = get_display_name_for_contact(results, get_name_for_contact_url);
        emptyContact();
        for (var i = 0; i < results.length; i++) {
          prependContact(results[i]);
          contactListForPresence.push({full_user_id: results[i].contact_user_name});
        }
        addExampleBox();
        KandyAPI.Phone.watchPresence(contactListForPresence);

      },
      function () {
        console.log("Error");
        addExampleBox();
      }
    );
  };

  /**
   * Send a message with kandyChat.
   *
   * @param username
   */
  var kandy_send_message = function (username) {
    var displayName = jQuery('.kandyChat .kandy_current_username').val();
    var inputMessage = jQuery('.kandyChat .imMessageToSend[data-user="' + username + '"]');
    var message = inputMessage.val();
    inputMessage.val('');
    KandyAPI.Phone.sendIm(username, message, function () {
        var newMessage = '<div class="my-message">\
                    <b><span class="imUsername">' + displayName + ':</span></b>\
                    <span class="imMessage">' + message + '</span>\
                </div>';
        var messageDiv = jQuery('.kandyChat .kandyMessages[data-user="' + username + '"]');
        messageDiv.append(newMessage);
        messageDiv.scrollTop(messageDiv[0].scrollHeight);
      },
      function () {
        alert("IM send failed");
      }
    );
  };

  /**
   * Get messages with kandyChat.
   */
  var kandy_getIms = function () {
    KandyAPI.Phone.getIm(
      function (data) {
        if (data.messages.length) {
          var get_name_for_chat_content_url = jQuery(".kandyChat #get_name_for_chat_content_url").val();
          data = get_display_name_for_chat_content(data, get_name_for_chat_content_url);
        }

        var i;
        for (i = 0; i < data.messages.length; ++i) {
          var msg = data.messages[i];
          if (msg.messageType == 'chat') {
            if (chatMessageTimeStamp == msg.timestamp) {
              continue;

            }
            else {
              chatMessageTimeStamp = msg.timestamp;
            }
            // Get user info.
            var username = data.messages[i].sender.full_user_id;
            var displayName = data.messages[i].sender.display_name;

            // Process tabs.
            if (!jQuery(liTabWrapSelector + " li a[" + userHoldingAttribute + "='" + username + "']").length) {
              prependContact(data.messages[i].sender);
            }
            if (!jQuery('input.imMessageToSend').is(':focus')) {
              move_contact_to_top_and_set_active(data.messages[i].sender);
            }
            else {
              move_contact_to_top(data.messages[i].sender);
            }

            // Process message.
            var msg = data.messages[i].message.text;
            var newMessage = '<div class="their-message">\
                            <b><span class="imUsername">' + displayName + ':</span></b>\
                            <span class="imMessage">' + msg + '</span>\
                        </div>';

            var messageDiv = jQuery('.kandyChat .kandyMessages[data-user="' + username + '"]');
            messageDiv.append(newMessage);
            messageDiv.scrollTop(messageDiv[0].scrollHeight);
          }
          else {
            // Alert("received " + msg.messageType + ": ");
          }
        }
      },
      function () {
        console.log("error receiving IMs");
      }
    );
  };

  /**
   * Empty all contacts.
   */
  var emptyContact = function () {
    jQuery(liTabContactWrap).html("");
  };

  /**
   * Prepend a contact.
   *
   * @param user
   */
  var prependContact = function (user) {
    var username = user.contact_user_name;

    var liParent = jQuery(liTabContactWrap + " li a[" + userHoldingAttribute + "='" + username + "']").parent();
    var liContact = "";
    if (liParent.length) {
      liContact = liParent[0].outerHTML;
    }
    else {
      liContact = getLiContact(user);
    }

    jQuery(liTabContactWrap).prepend(liContact);
    if (!jQuery(liContentWrapSelector + " li[" + userHoldingAttribute + "='" + username + "']").length) {
      var liContent = getLiContent(username);
      jQuery(liContentWrapSelector).prepend(liContent);
    }
  };

  /**
   * Get current active user name.
   *
   * @returns {*|jQuery}
   */
  var getActiveContact = function () {
    return jQuery(liTabWrapSelector + " li." + activeClass).attr(userHoldingAttribute);
  };

  /**
   * Set focus to a user.
   *
   * @param user
   */
  var setFocusContact = function (user) {
    jQuery(liTabWrapSelector + " li a[" + userHoldingAttribute + "='" + user + "']").trigger("click");
  };

  /**
   * Move a contact user to top of the list.
   *
   * @param user
   */
  var move_contact_to_top = function (user) {
    var username = user.contact_user_name;

    var contact = jQuery(liTabWrapSelector + " li a[" + userHoldingAttribute + "='" + username + "']").parent();
    var active = contact.hasClass(activeClass);

    // Add to top.
    prependContact(user, active);
    // Remove.
    contact.remove();
  };

  /**
   * Move a contact user to top of the list set set focus to it.
   *
   * @param user
   */
  var move_contact_to_top_and_set_active = function (user) {
    move_contact_to_top(user);
    setFocusContact(user);
    jQuery(liTabWrapSelector).scrollTop(0);
  };

  /**
   * Build list of participants.
   *
   * @param sessionDetails
   */

  var buildListParticipants = function (sessionId, participants, admin_id) {
    var listUsersGroup = jQuery(liTabWrapSelector + ' li[data-group="' + sessionId + '"] ' + ' .' + listUserClass);
    listUsersGroup.empty();
    var get_name_for_contact_url = jQuery(".kandyChat #get_name_for_contact_url").val();
    participants.push({full_user_id: admin_id});
    participants = get_display_name_for_contact(participants, get_name_for_contact_url);
    var currentUser = jQuery(".kandy_user").val();
    if (participants.length) {
      for (var i in participants) {
        displayNames[participants[i].full_user_id] = participants[i].display_name;
        if (!jQuery(listUsersGroup).find('li[data-user="' + participants[i].full_user_id + '"]').length) {
          var status = '';
          var additionBtn = '';
          var displayName = displayNames[participants[i].full_user_id];
          if (admin_id == participants[i].full_user_id) {
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
              //build sessions list here
              groupNames[result.groups[i].group_id] = result.groups[i].group_name;
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
              if (!jQuery(liContentWrapSelector + " li[" + userHoldingAttribute + "='" + result.groups[i].group_id + "']").length) {
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
      },
      function (msg, code) {
        console.debug('load sessions fail. Code:' + code + '. Message:' + msg);
      }
    );
  };

  /**
   *  Event handler for onData event
   */
  var kandy_onGroupMessage = function (msg) {
    if (typeof msg != 'undefined') {
      var msgType = msg.messageType;
      var sender = displayNames[msg.sender.full_user_id] || msg.sender.user_id;
      if (msgType == 'groupChat') {
        if (msg.contentType == 'text') {
          var newMessage = '<div class="their-message">\
                            <b><span class="imUsername">' + sender + ':</span></b>\
                            <span class="imMessage">' + msg.message.text + '</span>\
                        </div>';
          var messageDiv = jQuery('.kandyChat .kandyMessages[data-group="' + msg.group_id + '"]');
          messageDiv.append(newMessage);
          messageDiv.scrollTop(messageDiv[0].scrollHeight);
        }

      }
    }

  };

  /**
   * Add member to a group
   * @param group_id
   * @param members
   */
  var kandy_inviteUserToGroup = function (group_id, members) {
    kandy.messaging.addGroupMembers(group_id, members,

      function (results) {
        kandy_loadGroupDetails(group_id);
      },
      function (msg, code) {
        console.log('Error: ' + code + '-' + msg);
      }
    );
  };

  /**
   * on group invite user event
   */
  var kandy_onGroupInvite = function () {
    kandy_loadGroups();
  };

  /**
   * user removed from group chat event
   * @param message
   */
  var kandy_onRemovedFromGroup = function (message) {
    if (message.messageType == 'chatGroupBoot') {
      var bootedUser = message.booted[0];
      var notify;
      var currentUser = jQuery('.kandy_user').val();
      if (bootedUser != currentUser) {
        notify = (displayNames[bootedUser] || bootedUser.split('@')[0]) + ' is removed from this group';
        kandy_loadGroupDetails(message.group_id);
      } else {
        notify = 'You are removed from this group';
        kandy_loadGroups();
        changeGroupInputState(message.group_id, true);
      }
      var newMessage = '<div class="their-message">\
                    <span class="imMessage"><i>' + notify + '</i></span>\
                </div>';
      var messageDiv = jQuery('.kandyChat .kandyMessages[data-group="' + message.group_id + '"]');
      messageDiv.append(newMessage);
    }
  };


  var getGroupContent = function (groupId) {
    var result =
      '<li ' + userHoldingAttribute + '="' + groupId + '">\
                <div class="kandyMessages" data-group="' + groupId + '">\
                </div>\
                <div >\
                    Messages:\
                </div>\
                <div class="">\
                            <form class="send-message" data-group="' + groupId + '">\
                        <div class="input-message">\
                            <input class="imMessageToSend chat-input" type="text" data-group="' + groupId + '">\
                        </div>\
                        <div class="button-send">\
                            <input class="btnSendMessage chat-input" type="submit" value="Send"  data-group="' + groupId + '" >\
                        </div>\
                    </form>\
                </div>\
            </li>';
    return result;
  };

  var changeGroupInputState = function (groupId, state) {
    var messageInput = jQuery(liContentWrapSelector + ' li[data-content="' + groupId + '"] form .imMessageToSend');
    messageInput.prop('disabled', !!state);
  };


  var kandy_createGroup = function (groupName, successCallback, failCallback) {
    kandy.messaging.createGroup(groupName, "", successCallback, failCallback);
  };

  /**
   * Send group IM.
   *
   * @param groupId
   * @param msg
   */
  var kandy_sendGroupIm = function (groupId, msg) {
    var username = jQuery("input.kandy_current_username").val();
    kandy.messaging.sendGroupIm(groupId, msg,
      function () {
        var newMessage = '<div class="my-message">\
                    <b><span class="imUsername">' + username + ':</span></b>\
                    <span class="imMessage">' + msg + '</span>\
                </div>';
        var messageDiv = jQuery('.kandyChat .kandyMessages[data-group="' + groupId + '"]');
        messageDiv.append(newMessage);
        messageDiv.scrollTop(messageDiv[0].scrollHeight);
      },
      function (msg, code) {
        // Show error message for current user
        var errorMessage = '<div class="their-message">\
                    <span class="imMessage"><i>Error: ' + msg + '</i></span>\
                </div>';
        var messageDiv = jQuery('.kandyChat .kandyMessages[data-group="' + groupId + '"]');
        messageDiv.append(errorMessage);

        console.log('Error sending Data (' + code + '): ' + msg);
      }
    );
  };

  var kandy_onLeaveGroup = function (message) {
    if (message.messageType == 'chatGroupLeave') {
      var leaverDisplayName = displayNames[message.leaver] || message.split('@')[0];
      var groupId = message.group_id;
      var LoggedUser = jQuery(".kandy_user").val();
      if (message.leaver != LoggedUser) {
        kandy_loadGroupDetails(message.group_id);
      } else {
        kandy_loadGroups();
        changeGroupInputState(message.group_id, true);
      }
      var newMessage = '<div class="their-message">\
                    <span class="imMessage"><i>' + leaverDisplayName + ' has left</i></span>\
                </div>';
      var messageDiv = jQuery('.kandyChat .kandyMessages[data-group="' + groupId + '"]');
      messageDiv.append(newMessage);
    }
  };
  /**
   * Remove user from group.
   *
   * @param sessionId
   * @param userId
   */
  var kandy_removeFromGroup = function (groupId, userId) {
    var members = [];
    members.push(userId);
    var displayName = displayNames[userId] || userId.split('@')[0];
    var confirm = window.confirm("Do you want to remove " + displayName + ' from this group?');
    if (confirm) {
      kandy.messaging.removeGroupMembers(groupId, members,
        function () {
          kandy_loadGroupDetails(groupId);
        },
        function (msg, code) {
          console.log(code + ': ' + msg);
        }
      );
    }
  };

  var activateGroup = function (groupId) {
    KandyAPI.Session.activate(
      groupId,
      function () {

        console.log('activate group successful');
      }, function () {

        console.log('Error activating group');
      }
    );

  };

  /**
   * User Join Group Event.
   *
   * @param sessionId
   */
  var kandy_JoinGroup = function (sessionId) {
    KandyAPI.Session.join(
      sessionId,
      {},
      function () {
        kandy_loadGroupDetails(sessionId);
      },
      function (msg, code) {
        console.log(code + ": " + msg);
      }
    );
  };

  /**
   * User Leave Group event.
   *
   * @param sessionId
   */
  var kandy_leaveGroup = function (groupId, successCallback, failCallback) {
    var confirm = window.confirm("Do you want to leave group " + groupNames[groupId] + '?');
    if (confirm) {
      kandy.messaging.leaveGroup(groupId, successCallback, failCallback);
    }
  };
  /**
   * Terminate a session.
   *
   * @param sessionId
   */
  var kandy_terminateGroup = function (groupId, successCallback, failCallback) {
    var confirm = window.confirm("Do you want to remove group " + groupNames[groupId] + "?");
    if (confirm) {
      kandy.messaging.deleteGroup(groupId, successCallback, failCallback);
    }
  };
  /**
   * Session terminate event callback.
   *
   * @param notification
   */
  var kandy_onTerminateGroup = function (notification) {
    removeGroupContent(notification.group_id);
    kandy_loadGroups();
  };
  /**
   * Clean things up after remove group.
   *
   * @param sessionId
   */
  var removeGroupContent = function (sessionId) {
    var toBeRemove = jQuery(liContentWrapSelector + ' li[data-content="' + sessionId + '"]');
    if (toBeRemove.hasClass('selected')) {
      toBeRemove.siblings('[data-content="example"]').addClass('selected');
    }
    toBeRemove.remove();
  };

  /**
   * Update User Group Status.
   */
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
          jQuery(liUserGroup).closest("li[data-group]").addClass('kandy-chat-status-g-' + status);
        }
      }
    }
  };

  /**
   * Load group chat detail.
   *
   * @param sessionId
   */
  var kandy_loadGroupDetails = function (groupId) {
    kandy.messaging.getGroupById(groupId,
      function (result) {
        var isOwner = false, notInGroup = true, groupActivity = '', currentUser = jQuery(".kandy_user").val();
        var groupAction = jQuery(liTabWrapSelector + ' li a[data-content="' + groupId + '"]').parent().find('.groupAction');
        var messageInput = jQuery(liContentWrapSelector + ' li[data-content="' + groupId + '"] form .imMessageToSend');
        buildListParticipants(groupId, result.members, result.owners[0].full_user_id);

        // If current user is owner of this group.
        if (currentUser === result.owners[0].full_user_id) {
          // Add admin functionality.
          isOwner = true;
          groupActivity = '<a class="btnRemoveGroup" data-group-id="' + result.group_id + '" href="javascipt:;"><i title="Remove group" class="fa fa-remove"></i></a>';
          jQuery(liTabWrapSelector + ' li[data-group="' + groupId + '"] ' + ' .' + listUserClass + ' li[data-user!="' + result.owners[0].full_user_id + '"] .actions').append(
            '<i title="Remove user" class="remove fa fa-remove"></i>'
          );
        }
        if (isOwner) {
          groupActivity += '<a class="btnInviteUser" title="Add user"  href="javascript:;"><i class="fa fa-plus"></i></a>';
        } else {
          groupActivity = '<a class="leave btnLeaveGroup" title="Leave group" data-group-id="' + result.group_id + '" href="javascript:;"><i class="fa fa-sign-out"></i></a>';
          if (messageInput.is(':disabled')) {
            messageInput.prop('disabled', false);
          }
        }
        groupAction.html(groupActivity);
        updateUserGroupStatus();
      },
      function (msg, code) {
        console.log('Error: ' + code + ' - ' + msg);
      }
    );

  };

  function check_scrolling(tabs) {
    var totalTabWidth = parseInt(tabs.children('.cd-tabs-navigation').width()),
      tabsViewport = parseInt(tabs.width());
    if (tabs.scrollLeft() >= totalTabWidth - tabsViewport) {
      tabs.parent('.cd-tabs').addClass('is-ended');
    }
    else {
      tabs.parent('.cd-tabs').removeClass('is-ended');
    }
  }

  /**
   * Send SMS message.
   *
   * @param receiver
   * @param sender
   * @param message
   * @param successCallback
   * @param errorCallback
   */
  var kandy_sendSms = function (receiver, sender, message, successCallback, errorCallback) {
    KandyAPI.Phone.sendSMS(
      receiver,
      sender,
      message,
      function () {
        if (typeof successCallback == 'function') {
          successCallback();
        }
      },
      function (message, status) {
        console.log(message);
        console.log(status);
        if (typeof errorCallback == 'function') {
          errorCallback(message, status);
        }
      }
    );
  };

  function login(apiKey, username, passsword) {
    KandyAPI.Phone.login(apiKey, username, passsword);
  }

  function kandy_logout() {
    KandyAPI.Phone.logout();
  }

  /**
   * Kandy Ready.
   */
  jQuery(document).ready(function (jQuery) {

    // Register kandy widget event.
    if(typeof Drupal.settings.loginInfo != "undefined") {
      setup();
      login(Drupal.settings.loginInfo.apiKey, Drupal.settings.loginInfo.username, Drupal.settings.loginInfo.password);
      console.log('login....');
    }

    // Active Select2.
    if (jQuery('.kandyButton').length) {
      var ajaxUrl = jQuery(".kandyButton .select2").attr('data-ajax-url');
      jQuery(".kandyButton .select2").select2({
        ajax: {
          quietMillis: 100,
          url: ajaxUrl,
          dataType: 'json',
          delay: 250,
          data: function (params) {
            return {'term': params};
          },
          results: function (data) {
            return {results: data};
          }
        },
        minimumInputLength: 1
      });

      jQuery(".btnVideoCall").click(function(e){
        kandy_make_video_call(this);
      });

      jQuery(".btnEndCall").click(function(e){
        kandy_end_call(this);
      });

      jQuery(".btmAnswerVideoCall").click(function(e){
        kandy_answer_video_call(this);
      });

      jQuery(".btmAnswerRejectCall").click(function(e){
        kandy_reject_video_call(this);
      });
      jQuery(".btnHoldCall").click(function(e){
        kandy_hold_call(this)
      });
      jQuery(".btnResumeCall").click(function(e){
        kandy_resume_call(this);
      });

      jQuery(".btnAnswerVoiceCall").click(function(e){
        kandy_answerVoiceCall(this);
      });
      jQuery(".btnCallPstn").click(function(){
        kandy_make_pstn_call(this);
      });

      jQuery(".btnVoiceCall").click(function(){
        kandy_makeVoiceCall(this);
      })
    }

    if (jQuery('.kandyAddressBook').length) {
      var ajaxUrl = jQuery(".kandyButton .select2").attr('data-ajax-url');
      jQuery(".kandyAddressBook .select2").select2({
        ajax: {
          quietMillis: 100,
          url: ajaxUrl,
          dataType: 'json',
          delay: 250,
          data: function (params) {
            return {'term': params};
          },
          results: function (data) {
            return {results: data};
          }
        },
        minimumInputLength: 1
      });
    }
    // Only work when kandyChat exists.
    if (jQuery('.kandyChat').length) {
      jQuery(".kandyChat form.send-message").live("submit", function (e) {
        var username = jQuery(this).attr('data-user');

        if (jQuery(this).is('[data-user]')) {
          kandy_send_message(username);
        }
        else {
          kandy_sendGroupIm(jQuery(this).data('group'), jQuery(this).find('.imMessageToSend').val());
          jQuery(this).find('.imMessageToSend').val('');
        }
        e.preventDefault();
      });

      jQuery(".kandyChat #btn-create-group-modal").click(function () {

        jQuery("#kandy-chat-create-group-modal").show();
        jQuery('#kandy-chat-create-session-name').focus();
      });

      jQuery("#kandy-chat-modal-button-create-group").click(function () {
        var groupName = jQuery('#kandy-chat-create-session-name').val();
        var errors = [];
        var errorContainer = jQuery(".errors");
        errorContainer.empty();
        if (groupName == '') {
          alert('Group must have a name.');
          jQuery('#kandy-chat-create-session-name').focus();
        }
        else {
          kandy_createGroup(groupName, kandy_loadGroups);
          jQuery('#kandy-chat-create-session-name').val('');
          jQuery("#kandy-chat-create-group-modal").hide();
        }
      });
      jQuery("#kandy-chat-modal-button-add-user").live('click', function () {
        var username = jQuery('#kandy-chat-invite-username').val();
        var errors = [];
        var errorContainer = jQuery(".errors");
        var groupId = jQuery("#kandy-chat-add-user-modal").data('group');
        errorContainer.empty();
        if (username == '') {
          alert('Please provide a username');
          jQuery('#kandy-chat-create-session-name').focus();
        }
        else {
          kandy_inviteUserToGroup(groupId, [username]);
          jQuery('#kandy-chat-invite-username').val('');
          jQuery("#kandy-chat-add-user-modal").hide();
        }
      });


      jQuery("#kandy-chat-modal-button-close").click(function () {
        jQuery('#kandy-chat-create-session-name').val('');
        jQuery("#kandy-chat-create-group-modal").hide();

      });
      jQuery("#kandy-chat-modal-invite-button-close").click(function () {
        jQuery('#kandy-chat-invite-username').val('');
        jQuery("#kandy-chat-add-user-modal").hide();
      });

      jQuery(".kandyChat .btnInviteUser").live('click', function () {
        jQuery("#kandy-chat-add-user-modal").attr('data-group', jQuery(this).closest('li.group').data('group')).show();
        jQuery("#kandy-chat-invite-username").focus();
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
          var selectedTab = selectedItem.data('content'),
            selectedContent = tabContentWrapper.find('li[data-content="' + selectedTab + '"]'),
            selectedContentHeight = jQuery(".cd-tabs-navigation").parent('nav').height();

          jQuery('.cd-tabs-navigation a').removeClass('selected');
          selectedItem.addClass('selected');
          selectedContent.addClass('selected').siblings('li').removeClass('selected');

          selectedContent.find(".imMessageToSend").focus();

          jQuery(".chat-with-message").show();
          jQuery(".chat-friend-name").html(selectedItem.html());

          // Animate tabContentWrapper height when content changes.
          tabContentWrapper.animate({
            'height': selectedContentHeight
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



      jQuery(".toggle").live('click', function () {
        jQuery(this).toggleClass('fa-plus-square-o').toggleClass('fa-minus-square-o');
        jQuery(this).siblings('.list-users').toggleClass('expanding');
      });
      var ajaxUrl = jQuery(".kandyChat .select2").attr('data-ajax-url');
      jQuery(".kandyChat .kandyModal .select2").select2({
        ajax: {
          quietMillis: 100,
          url: ajaxUrl,
          dataType: 'json',
          delay: 250,
          data: function (params) {
            return {'term': params};
          },
          results: function (data) {
            return {results: data};
          }
        },
        minimumInputLength: 1
      });
      jQuery(".btnRemoveGroup").live('click', function () {
        kandy_terminateGroup($(this).data('group-id'));
      });

      jQuery("#contactFilter").on('change', function () {
        kandy_contactFilterChanged($(this).val());
      });

      jQuery(".btnLeaveGroup").live('click', function () {
        kandy_leaveGroup($(this).data('group-id'));
      })
    }

    /**
     * Click on send sms button.
     */
    jQuery('.kandy-sms-send-btn').live('click', function () {
      var wrapper = jQuery(this).closest('.kandy-sms-wrapper');
      var to = wrapper.find('.kandy-sms-to').val();
      var message = wrapper.find('.kandy-sms-content').val();
      kandy_sendSms(to, "", message, function (data) {
        alert('Sent!');
      }, function (message, status) {
        alert('SMS send failed!');
        console.log(message);
      });
    });

    /**
     * Validate send sms button.
     */
    jQuery('.kandy-sms-content, .kandy-sms-to').live('input', function () {
      var wrapper = jQuery(this).closest('.kandy-sms-wrapper');
      var to = wrapper.find('.kandy-sms-to').val();
      var message = wrapper.find('.kandy-sms-content').val();
      var sendBtn = wrapper.find('.kandy-sms-send-btn');
      if (to != '' && message != '') {
        sendBtn.removeAttr('disabled');
      } else {
        sendBtn.attr('disabled', true);
      }
    });
  });
})();