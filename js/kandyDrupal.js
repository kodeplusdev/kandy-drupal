/**
 * KANDY SETUP AND LISTENER CALLBACK.
 */

setup = function () {
  // Initialize KandyAPI.Phone, passing a config JSON object that contains listeners (event callbacks).
  KandyAPI.Phone.setup({
    allowAutoLogin: true,
    // Respond to Kandy events.
    listeners: {
      media: function (event) {
        switch (event.type) {
          case KandyAPI.Phone.MediaErrors.WRONG_VERSION:
            alert("Media Plugin Version Not Supported");
            break;

          case KandyAPI.Phone.MediaErrors.NEW_VERSION_WARNING:
            promptPluginDownload(event.urlWin32bit, event.urlWin64bit, event.urlMacUnix);
            break;

          case KandyAPI.Phone.MediaErrors.NOT_INITIALIZED:
            alert("Media couldn't be initialized");
            break;

          case KandyAPI.Phone.MediaErrors.NOT_FOUND:
            // YOUR CODE GOES HERE.
            break;
        }

      },
      loginsuccess: kandy_login_success_callback,
      loginfailed: kandy_login_failed_callback,
      callincoming: kandy_incoming_call_callback,
      // When an outgoing call is connected.
      oncall: kandy_on_call_callback,
      // When an incoming call is connected.
      // You indicated that you are answering the call.
      callanswered: kandy_call_answered_callback,
      callended: kandy_call_ended_callback,
      localvideoinitialized: kandy_local_video_initialized_callback,
      // A video tag is being provided (required for both audio and video calls).
      // You must insert it into the DOM for communication to happen (although for audio calls, it can remain hidden).
      remotevideoinitialized: kandy_remote_video_initialized_callack,
      presencenotification: kandy_presence_notification_callack
    }
  });
};

/**
 * Login Success Callback.
 */
kandy_login_success_callback = function () {
  KandyAPI.Phone.updatePresence(0);

  // Have kandy Address Book widget.
  if ($(".kandyAddressBook").length) {
    kandy_loadContacts_addressBook();
  }
  // Have kandy Chat widget.
  if ($(".kandyChat").length) {
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
 * Local Video Initialized callback.
 *
 * @param videoTag
 */
kandy_local_video_initialized_callback = function (videoTag) {

  // Have video widget.
  if ($(".kandyVideo").length) {
    $('#myVideo').append(videoTag);
  }

  if (typeof local_video_initialized_callback == 'function') {
    local_video_initialized_callback(videoTag);
  }

};

/**
 * Remote Video Initialized Callback.
 *
 * @param videoTag
 */
kandy_remote_video_initialized_callack = function (videoTag) {

  // Have video widget.
  if ($(".kandyVideo").length) {
    $('#theirVideo').append(videoTag);
  }
  // Have voice call widget.
  if ($(".kandyButton .videoVoiceCallHolder").length) {
    $('.kandyButton .videoVoiceCallHolder .video').append(videoTag);
  }
  if (typeof remote_video_initialized_callack == 'function') {
    remote_video_initialized_callack(videoTag);
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
kandy_presence_notification_callack = function (userId, state, description, activity) {
  // HTML id can't contain @ and jquery doesn't like periods (in id).
  var id_attrib = '.kandyAddressBook .kandyAddressContactList #presence_' + userId.replace(/[.@]/g, '_');
  $(id_attrib).text(description);
  if (typeof presence_notification_callack == 'function') {
    presence_notification_callack(userId, state, description, activity);
  }

  // Update chat status.
  if ($('.kandyChat').length > 0) {
    var liUser = $('.kandyChat .cd-tabs-navigation li#' + userId.replace(/[.@]/g, '_'));
    var statusItem = liUser.find('i.status');
    statusItem.text(description);

    liUser.removeClass().addClass('kandy-chat-status-' + description.replace(/ /g, '-').toLowerCase());
    liUser.attr('title', description);
  }
};

/**
 * OnCall Callback.
 *
 * @param call
 */
kandy_on_call_callback = function (call) {
  if (typeof on_call_callback == 'function') {
    on_call_callback(call);
  }
  change_answer_button_state("ON_CALL");
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
  change_answer_button_state('BEING_CALLED');
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
  change_answer_button_state("ON_CALL");
};

/**
 * Kandy call ended callback.
 */
kandy_call_ended_callback = function () {
  // Have video widget.
  if ($(".kandyVideo").length) {
    $('#theirVideo').empty();
    $('#myVideo').empty();
  }
  if (typeof call_ended_callback == 'function') {
    call_ended_callback();
  }
  change_answer_button_state("READY_FOR_CALLING");
};

/**
 * Change AnswerButtonState with KandyButton Widget.
 *
 * @param state
 */
change_answer_button_state = function (state) {
  switch (state) {
    case 'READY_FOR_CALLING':

      $('.kandyButton .kandyVideoButtonSomeonesCalling').hide();
      $('.kandyButton .kandyVideoButtonCallOut').show();
      $('.kandyButton .kandyVideoButtonCalling').hide();
      $('.kandyButton .kandyVideoButtonOnCall').hide();
      break;

    case 'BEING_CALLED':
      $('.kandyButton .kandyVideoButtonSomeonesCalling').show();
      $('.kandyButton .kandyVideoButtonCallOut').hide();
      $('.kandyButton .kandyVideoButtonCalling').hide();
      $('.kandyButton .kandyVideoButtonOnCall').hide();
      break;

    case 'CALLING':
      $('.kandyButton .kandyVideoButtonSomeonesCalling').hide();
      $('.kandyButton .kandyVideoButtonCallOut').hide();
      $('.kandyButton .kandyVideoButtonCalling').show();
      $('.kandyButton .kandyVideoButtonOnCall').hide();
      break;

    case 'ON_CALL':
      $('.kandyButton .kandyVideoButtonSomeonesCalling').hide();
      $('.kandyButton .kandyVideoButtonCallOut').hide();
      $('.kandyButton .kandyVideoButtonCalling').hide();
      $('.kandyButton .kandyVideoButtonOnCall').show();
      break;
  }
};

/**
 * Event when answer a call.
 *
 * @param target
 */
kandy_answer_video_call = function (target) {
  KandyAPI.Phone.answerVideoCall();
  change_answer_button_state("ANSWERING_CALL");
  if (typeof answer_video_call_callback == 'function') {
    answer_video_call_callback("ANSWERING_CALL");
  }
}

/**
 * Event when click call button.
 *
 * @param target
 */
kandy_make_video_call = function (target) {

  KandyAPI.Phone.makeVideoCall($('.kandyButton .kandyVideoButtonCallOut #callOutUserId').val());
  change_answer_button_state("CALLING");
};

/**
 * Event when answer a voice call.
 *
 * @param target
 */
kandy_answerVoiceCall = function (target) {
  KandyAPI.Phone.answerVoiceCall();
  change_answer_button_state("ANSWERING_CALL");
  answer_voice_call_callback("ANSWERING_CALL");
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

  KandyAPI.Phone.makeVoiceCall($('.kandyButton .kandyVideoButtonCallOut #callOutUserId').val());
  change_answer_button_state("CALLING");
};

/**
 * Event when click end call button.
 */
kandy_end_call = function (target) {
  KandyAPI.Phone.endCall();
  if (typeof end_all_callback == 'function') {
    end_all_callback('READY_FOR_CALLING');
  }

  change_answer_button_state("READY_FOR_CALLING");
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
      var get_name_for_contact_url = $(".kandyAddressBook #get_name_for_contact_url").val();
      results = get_display_name_for_contact(results, get_name_for_contact_url);

      // Clear out the current address book list.
      $(".kandyAddressBook .kandyAddressContactList div:not(:first)").remove();
      var div = null;
      if (results.length == 0) {
        div = "<div class='kandyAddressBookNoResult'>-- No Contacts --</div>";
        $('.kandyAddressBook .kandyAddressContactList').append(div);
      } else {
        $('.kandyAddressBook .kandyAddressContactList').append("<div class='kandy-contact-heading'><span class='displayname'><b>Username</b></span><span class='userId'><b>Contact</b></span><span class='presence'><b>Status</b></span></div>");
        for (i = 0; i < results.length; i++) {
          if(results[i].display_name != "kandy-un-assign-user") {
            contactListForPresence.push({full_user_id: results[i].contact_user_name});

            var id_attr = results[i].contact_user_name.replace(/[.@]/g, '_');
            $('.kandyAddressBook .kandyAddressContactList').append(
              // HTML id can't contain @ and jquery doesn't like periods (in id).
              "<div class='kandyContactItem' id='uid_" + id_attr + "'>" +
                "<span class='displayname'>" + results[i].display_name + "</span>" +
                "<span class='userId'>" + results[i].contact_email + "</span>" +
                "<span id='presence_" + id_attr + "' class='presence'></span>" +
                "<input class='removeBtn' type='button' value='Remove' " +
                " onclick='kandy_removeFromContacts(\"" + results[i].contact_id + "\")'>" +
                "</div>"
            );
          } else {
            deleteContact.push({id_attr: id_attr, contact_id : results[i].contact_id});
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
    $.ajax({
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
    $.ajax({
      url: url,
      data: {data:data.messages},
      async: false
    }).done(function(response) {
        data.messages = JSON.parse(response);
      }).fail(function(e) {
      });
  }
  return data;

};
/**
 * Add contact.
 */
var addContacts = function() {
  var contactId = $(".kandyAddressBook #kandySearchUserName").val();
  kandy_addToContacts(contactId);
  $(".kandyAddressBook #kandySearchUserName").select2('val', '');

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
  if ($('#uid_' + userId.replace(/[.@]/g, '_')).length > 0) {
    alert("This person is already in your contact list.")
  } else {
    // Get and AddressBook.Entry object for this contact.
    KandyAPI.Phone.searchDirectoryByUserName(
      userId,
      function (results) {
        for (var i = 0; i < results.length; ++i) {
          if (results[i].primaryContact === userIdToAddToContacts) {
            // User name and nickname are required.
            contact = {
              contact_user_name: results[i].primaryContact,
              contact_nickname: results[i].primaryContact
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
  var userName = $('.kandyAddressBook .kandyDirectorySearch #kandySearchUserName').val();
  var get_name_for_contact_url = $(".kandyAddressBook #get_user_for_search_url").val();
  $.ajax({
    url: get_name_for_contact_url.ajax_url,
    data: {query:userName}
  }).done(function (results) {
      results = JSON.parse(results);
      $(".kandyAddressBook .kandyDirSearchResults div:not(:first)").remove();
      var div = null;
      if (results.length == 0) {
        div = "<div class='kandyAddressBookNoResult'>-- No Matches Found --</div>";
        $('.kandyAddressBook .kandyDirSearchResults').append(div);
      } else {
        for (var i = 0; i < results.length; i++) {
          $('.kandyDirSearchResults').append(
            "<div class='kandySearchItem'><span class='userId'>" + results[i].main_username + "</span><input type='button' value='Add Contact' onclick='kandy_addToContacts(\"" +
              results[i].kandy_full_username + "\")' /></div>"
          );
        }
      }
    }).fail(function() {
      $(".kandyAddressBook .kandyDirSearchResults div:not(:first)").remove();
      var div = "<div class='kandyAddressBookNoResult'>There was an error with your request.</div>";
      $('.kandyAddressBook .kandyDirSearchResults').append(div);
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
  $(liContentWrapSelector).append(getLiContent(tabId));
  $(liContentWrapSelector).find('li[data-content="' + tabId + '"]').addClass('selected').find(".chat-input").attr('disabled', true);
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
  var liUserchat = $(".kandyChat .cd-tabs-navigation li");
  $.each(liUserchat, function (index, target) {
    var liClass = $(target).attr('class');
    var currentClass = "kandy-chat-status-" + val;
    if (val == "all") {
      $(target).show();
    } else if (liClass == currentClass) {
      $(target).show();
    } else {
      $(target).hide();
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
      var get_name_for_contact_url = $(".kandyChat #get_name_for_contact_url").val();
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
  var displayName = $('.kandyChat .kandy_current_username').val();
  var inputMessage = $('.kandyChat .imMessageToSend[data-user="' + username + '"]');
  var message = inputMessage.val();
  inputMessage.val('');
  KandyAPI.Phone.sendIm(username, message, function () {
      var newMessage = '<div class="my-message">\
                    <b><span class="imUsername">' + displayName + ':</span></b>\
                    <span class="imMessage">' + message + '</span>\
                </div>';
      var messageDiv = $('.kandyChat .kandyMessages[data-user="' + username + '"]');
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
        var get_name_for_chat_content_url = $(".kandyChat #get_name_for_chat_content_url").val();
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
          if (!$(liTabWrapSelector + " li a[" + userHoldingAttribute + "='" + username + "']").length) {
            prependContact(data.messages[i].sender);
          }
          if (!$('input.imMessageToSend').is(':focus')) {
            move_contact_to_top_and_set_active(data.messages[i].sender);
          } else {
            move_contact_to_top(data.messages[i].sender);
          }

          // Process message.
          var msg = data.messages[i].message.text;
          var newMessage = '<div class="their-message">\
                            <b><span class="imUsername">' + displayName + ':</span></b>\
                            <span class="imMessage">' + msg + '</span>\
                        </div>';

          var messageDiv = $('.kandyChat .kandyMessages[data-user="' + username + '"]');
          messageDiv.append(newMessage);
          messageDiv.scrollTop(messageDiv[0].scrollHeight);
        } else {
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
  $(liTabWrapSelector).html("");
  $(liContentWrapSelector).html("");
};

/**
 * Prepend a contact.
 *
 * @param user
 */
var prependContact = function (user) {
  var username = user.contact_user_name;

  var liParent = $(liTabWrapSelector + " li a[" + userHoldingAttribute + "='" + username + "']").parent();
  var liContact = "";
  if(liParent.length){
    liContact = liParent[0].outerHTML;
  } else {
    liContact = getLiContact(user);
  }

  $(liTabWrapSelector).prepend(liContact);
  if (!$(liContentWrapSelector + " li[" + userHoldingAttribute + "='" + username + "']").length) {
    var liContent = getLiContent(username);
    $(liContentWrapSelector).prepend(liContent);
  }
};

/**
 * Get current active user name.
 *
 * @returns {*|jQuery}
 */
var getActiveContact = function () {
  return $(liTabWrapSelector + " li." + activeClass).attr(userHoldingAttribute);
};

/**
 * Set focus to a user.
 *
 * @param user
 */
var setFocusContact = function (user) {
  $(liTabWrapSelector + " li a[" + userHoldingAttribute + "='" + user + "']").trigger("click");
};

/**
 * Move a contact user to top of the list.
 *
 * @param user
 */
var move_contact_to_top = function (user) {
  var username = user.contact_user_name;

  var contact = $(liTabWrapSelector + " li a[" + userHoldingAttribute + "='" + username + "']").parent();
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
  $(liTabWrapSelector).scrollTop(0);
};

jQuery(document).ready(function ($) {

  // Register kandy widget event.
  if (typeof login == 'function') {
    setup();
    login();
    console.log('login....');
  }

  // Active Select2.
  if($('.kandyButton').length){
    var ajaxUrl = $(".kandyButton .select2").attr('data-ajax-url');
    $(".kandyButton .select2").select2({
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

  if($('.kandyAddressBook').length){
    var ajaxUrl = $(".kandyButton .select2").attr('data-ajax-url');
    $(".kandyAddressBook .select2").select2({
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
  if ($('.kandyChat').length) {
    $("form.send-message").live("submit", function (e) {
      var username = $(this).attr('data-user');
      kandy_send_message(username);
      e.preventDefault();
    });

    var tabContentWrapper = $(liContentWrapSelector);

    $('.cd-tabs-navigation a').live('click', function (event) {
      event.preventDefault();
      var selectedItem = $(this);
      if (!selectedItem.hasClass('selected')) {
        var selectedTab = selectedItem.data('content'),
          selectedContent = tabContentWrapper.find('li[data-content="' + selectedTab + '"]'),
          selectedContentHeight = $(".cd-tabs-navigation").parent('nav').height();

        $('.cd-tabs-navigation a').removeClass('selected');
        selectedItem.addClass('selected');
        selectedContent.addClass('selected').siblings('li').removeClass('selected');

        // Set focus.
        selectedContent.find(".imMessageToSend").focus();

        // Set chat heading.
        $(".chat-with-message").show();
        $(".chat-friend-name").html(selectedItem.html());

        // Animate tabContentWrapper height when content changes.
        tabContentWrapper.animate({
          'height': selectedContentHeight
        }, 200);
      }
    });

    // Hide the .cd-tabs::after element when tabbed navigation has scrolled to the end (mobile version).
    check_scrolling($('.cd-tabs nav'));

    $(window).live('resize', function () {
      check_scrolling($('.cd-tabs nav'));
    });

    $('.cd-tabs nav').live('scroll', function () {
      check_scrolling($(this));
    });

    function check_scrolling(tabs) {
      var totalTabWidth = parseInt(tabs.children('.cd-tabs-navigation').width()),
        tabsViewport = parseInt(tabs.width());
      if (tabs.scrollLeft() >= totalTabWidth - tabsViewport) {
        tabs.parent('.cd-tabs').addClass('is-ended');
      } else {
        tabs.parent('.cd-tabs').removeClass('is-ended');
      }
    }
  }
});
