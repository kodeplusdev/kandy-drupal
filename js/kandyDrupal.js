/**
 * @file
 * KANDY SETUP AND LISTENER CALLBACK.
 */

var callId, username;

// Create audio objects to play incoming calls and outgoing calls sound
var $audioRingIn = jQuery('<audio>', { loop: 'loop', id: 'ring-in' });
var $audioRingOut = jQuery('<audio>', { loop: 'loop', id: 'ring-out' });

// Load audio source to DOM to indicate call events
var audioSource = {
  ringIn: [
    { src: 'https://kandy-portal.s3.amazonaws.com/public/sounds/ringin.mp3', type: 'audio/mp3' },
    { src: 'https://kandy-portal.s3.amazonaws.com/public/sounds/ringin.ogg', type: 'audio/ogg' }
  ],
  ringOut: [
    { src: 'https://kandy-portal.s3.amazonaws.com/public/sounds/ringout.mp3', type: 'audio/mp3' },
    { src: 'https://kandy-portal.s3.amazonaws.com/public/sounds/ringout.ogg', type: 'audio/ogg' }
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

setup = function () {
  // Initialize KandyAPI.Phone, passing a config JSON object that contains listeners (event callbacks).
  KandyAPI.Phone.setup({

    remoteVideoContainer: jQuery('#theirVideo')[0],
    localVideoContainer: jQuery('#myVideo')[0],
    pstnOutNumber: '71',
    fcsConfig: {
      restPlatform: 'kandy', // 'spidr' or 'kandy'
      kandyApiUrl: 'https://api.kandy.io/v1.1/users/gateway',
      useInternalJquery: true
    },
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
};

/**
 * Login Success Callback.
 */
kandy_login_success_callback = function () {
  KandyAPI.Phone.updatePresence(0);

  // Have kandy Address Book widget.
  if (jQuery(".kandyAddressBook").length) {
    kandy_loadContacts_addressBook();
  }
  // Have kandy Chat widget.
  if (jQuery(".kandyChat").length) {
    kandy_load_contacts_chat();
    setInterval(kandy_getIms, 3000);

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
kandy_login_failed_callback = function () {
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
kandy_presence_notification_callback = function (userId, state, description, activity) {
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
};

/**
 * Event handler for callinitiate
 * @param call
 */
function kandy_on_call_initiate(call) {
  callId = call.getId();

  $audioRingIn[0].pause();
  $audioRingOut[0].play();
}

// Event handler for callinitiatefail event
function kandy_on_call_initiate_fail() {
  $audioRingOut[0].pause();

}

/**
 * Event handler for callrejected event
 */

function kandy_on_call_rejected() {
  callId = null;
  $audioRingIn[0].pause();
  UIState.callrejected();
}

/**
 * OnCall Callback.
 *
 * @param call
 */
kandy_on_call_callback = function (call) {
  if (typeof on_call_callback == 'function') {
    on_call_callback(call);
  }
  $audioRingOut[0].pause();
  changeAnswerButtonState("ON_CALL");
};

/**
 * Incoming Callback.
 *
 * @param call
 * @param isAnonymous
 */
kandy_incoming_call_callback = function (call, isAnonymous) {
  if (typeof call_incoming_callback == 'function') {
    call_incoming_callback(call, isAnonymous);
  }

  $audioRingIn[0].play();
  callId = call.getId();

  changeAnswerButtonState('BEING_CALLED');
};

/**
 * Kandy call answered callback.
 *
 * @param call
 * @param isAnonymous
 */
kandy_call_answered_callback = function (call, isAnonymous) {
  if (typeof call_answered_callback == 'function') {
    call_answered_callback(call, isAnonymous);
  }
  callId = call.getId();

  $audioRingOut[0].pause();
  $audioRingIn[0].pause();

  changeAnswerButtonState("ON_CALL");
};

/**
 * Kandy call ended callback.
 */
kandy_call_ended_callback = function () {
  callId = null;

  $audioRingOut[0].play();
  $audioRingIn[0].pause();

  if (typeof call_ended_callback == 'function') {
    call_ended_callback();
  }
  changeAnswerButtonState("READY_FOR_CALLING");
};

/**
 * Event handler for callendedfailed event.
 */
function kandy_on_call_ended_failed() {

  callId = null;
}

/**
 * Change AnswerButtonState with KandyButton Widget.
 *
 * @param state
 */
changeAnswerButtonState = function (state) {
  switch (state) {
    case 'READY_FOR_CALLING':
      $audioRingIn[0].pause();
      $audioRingOut[0].pause();
      jQuery('.kandyButton .kandyVideoButtonSomeonesCalling').hide();
      jQuery('.kandyButton .kandyVideoButtonCallOut').show();
      jQuery('.kandyButton .kandyVideoButtonCalling').hide();
      jQuery('.kandyButton .kandyVideoButtonOnCall').hide();
      break;

    case 'BEING_CALLED':
      jQuery('.kandyButton .kandyVideoButtonSomeonesCalling').show();
      jQuery('.kandyButton .kandyVideoButtonCallOut').hide();
      jQuery('.kandyButton .kandyVideoButtonCalling').hide();
      jQuery('.kandyButton .kandyVideoButtonOnCall').hide();
      break;

    case 'CALLING':
      jQuery('.kandyButton .kandyVideoButtonSomeonesCalling').hide();
      jQuery('.kandyButton .kandyVideoButtonCallOut').hide();
      jQuery('.kandyButton .kandyVideoButtonCalling').show();
      jQuery('.kandyButton .kandyVideoButtonOnCall').hide();
      break;
    case 'HOLD_CALL':

      jQuery('.kandyButton .kandyVideoButtonOnCall .btnHoldCall').hide();
      jQuery('.kandyButton .kandyVideoButtonOnCall .btnResumeCall').show();
      break;

    case 'RESUME_CALL':

      jQuery('.kandyButton .kandyVideoButtonOnCall .btnResumeCall').hide();
      jQuery('.kandyButton .kandyVideoButtonOnCall .btnHoldCall').show();
      break;

    case 'ON_CALL':
      jQuery('.kandyButton .kandyVideoButtonSomeonesCalling').hide();
      jQuery('.kandyButton .kandyVideoButtonCallOut').hide();
      jQuery('.kandyButton .kandyVideoButtonCalling').hide();
      jQuery('.kandyButton .kandyVideoButtonOnCall').show();
      jQuery('.kandyButton .kandyVideoButtonOnCall .btnResumeCall').hide();
      break;
  }
};

/**
 * Event when answer a call.
 *
 * @param target
 */
kandy_answer_video_call = function (target) {
  KandyAPI.Phone.answerCall(callId, true);
  changeAnswerButtonState("ANSWERING_CALL");
  if (typeof answer_video_call_callback == 'function') {
    answer_video_call_callback("ANSWERING_CALL");
  }
}

/**
 * Event when answer a call.
 *
 * @param target
 */
kandy_reject_video_call = function (target) {
  KandyAPI.Phone.rejectCall(callId);
  changeAnswerButtonState("READY_FOR_CALLING");
  if (typeof reject_video_call_callback == 'function') {
    reject_video_call_callback("READY_FOR_CALLING");
  }
}

/**
 * Event when click call button.
 *
 * @param target
 */
kandy_make_video_call = function (target) {

  KandyAPI.Phone.makeCall(jQuery('.kandyButton .kandyVideoButtonCallOut #callOutUserId').val(), true);
  changeAnswerButtonState("CALLING");
};

/**
 * Event when answer a voice call.
 *
 * @param target
 */
kandy_answerVoiceCall = function (target) {
  KandyAPI.Phone.answerCall(callId, false);
  changeAnswerButtonState("ANSWERING_CALL");

  if (typeof answer_voice_call_callback == 'function') {
    answer_voice_call_callback("ANSWERING_CALL");
  }

};

/**
 * Event when click call button.
 *
 * @param target
 */
kandy_makeVoiceCall = function (target) {

  KandyAPI.Phone.makeCall(jQuery('.kandyButton .kandyVideoButtonCallOut #callOutUserId').val(), false);
  changeAnswerButtonState("CALLING");
};

/**
 * Event when click end call button.
 */
kandy_end_call = function (target) {
  KandyAPI.Phone.endCall(callId);
  if (typeof end_call_callback == 'function') {
    end_call_callback('READY_FOR_CALLING');
  }

  changeAnswerButtonState("READY_FOR_CALLING");
};

/**
 * Event when click hold call button.
 */
kandy_hold_call = function (target) {
  KandyAPI.Phone.holdCall(callId);
  if (typeof hold_callback == 'function') {
    hold_call_callback('HOLD_CALL');
  }

  changeAnswerButtonState("HOLD_CALL");
};

/**
 * Event when click resume call button.
 */
kandy_resume_call = function (target) {
  KandyAPI.Phone.unHoldCall(callId);
  if (typeof hold_callback == 'function') {
    hold_call_callback('RESUME_CALL');
  }

  changeAnswerButtonState("RESUME_CALL");
};

/**
 * Add AddressBook widget.
 */
kandy_loadContacts_addressBook = function () {
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
kandy_myStatusChanged = function (status) {
  KandyAPI.Phone.updatePresence(status);

};

var userIdToAddToContacts = null;

/**
 * Add a user to contact list with kandyAddressBook.
 *
 * @param userId
 */
kandy_addToContacts = function (userId) {
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
kandy_removeFromContacts = function (nickname) {
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
kandy_searchDirectoryByUserName = function () {
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
    if (val == "all") {
      jQuery(target).show();
    }
    else if (liClass == currentClass) {
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
kandy_load_contacts_chat = function () {
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
kandy_send_message = function (username) {
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
kandy_getIms = function () {
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
  jQuery(liTabWrapSelector).html("");
  jQuery(liContentWrapSelector).html("");
};

/**
 * Prepend a contact.
 *
 * @param user
 */
var prependContact = function (user) {
  var username = user.contact_user_name;

  var liParent = jQuery(liTabWrapSelector + " li a[" + userHoldingAttribute + "='" + username + "']").parent();
  var liContact = "";
  if (liParent.length) {
    liContact = liParent[0].outerHTML;
  }
  else {
    liContact = getLiContact(user);
  }

  jQuery(liTabWrapSelector).prepend(liContact);
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

jQuery(document).ready(function (jQuery) {

  // Register kandy widget event.
  if (typeof login == 'function') {
    setup();
    login();
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
    jQuery("form.send-message").live("submit", function (e) {
      var username = jQuery(this).attr('data-user');
      kandy_send_message(username);
      e.preventDefault();
    });

    var tabContentWrapper = jQuery(liContentWrapSelector);

    jQuery('.cd-tabs-navigation a').live('click', function (event) {
      event.preventDefault();
      var selectedItem = jQuery(this);
      if (!selectedItem.hasClass('selected')) {
        var selectedTab = selectedItem.data('content'),
          selectedContent = tabContentWrapper.find('li[data-content="' + selectedTab + '"]'),
          selectedContentHeight = jQuery(".cd-tabs-navigation").parent('nav').height();

        jQuery('.cd-tabs-navigation a').removeClass('selected');
        selectedItem.addClass('selected');
        selectedContent.addClass('selected').siblings('li').removeClass('selected');

        // Set focus.
        selectedContent.find(".imMessageToSend").focus();

        // Set chat heading.
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
  }
});
