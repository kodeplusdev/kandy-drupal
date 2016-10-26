/**
 * @file
 * Contains functions used for live chat feature.
 */

var LiveChatUI = {};
(function () {

  'use strict';

  var agent;
  var checkAvailable;
  var rateData = {};

  LiveChatUI.changeState = function (state) {
    switch (state) {
      case 'WAITING':
        jQuery('.liveChat #waiting').show();
        jQuery('.liveChat #registerForm').hide();
        jQuery('.liveChat .customerService ,.liveChat #messageBox, .liveChat .formChat').hide();
        break;

      case 'READY':
        jQuery('.liveChat #registerForm').hide();
        jQuery('.liveChat #waiting').hide();
        jQuery('.liveChat .customerService, .liveChat #messageBox, .liveChat .formChat').show();
        jQuery('.liveChat .agentName').html(agent.name);
        jQuery('.liveChat #messageBox li.their-message span.username').html(agent.name);
        jQuery('.liveChat .handle.closeChat').show();
        break;

      case 'UNAVAILABLE':
        jQuery('.liveChat #waiting p').html('There is something wrong, please try again later.');
        jQuery('.liveChat #loading').hide();
        break;

      case 'RECONNECTING':
        jQuery('.liveChat #waiting p').html('Chat agents not available, please wait...');
        jQuery('.liveChat #loading').show();
        break;

      case 'RATING':
        jQuery('.liveChat #ratingForm').show();
        jQuery('.liveChat .customerService, .liveChat #messageBox, .liveChat .formChat').hide();
        break;

      case 'ENDING_CHAT':
        jQuery('.liveChat #ratingForm form').hide();
        jQuery('.liveChat #ratingForm .formTitle').hide();
        jQuery('.liveChat #ratingForm .message').show();
        break;

      default:
        jQuery('.liveChat #registerForm').show();
        jQuery('.liveChat .customerService, .liveChat #messageBox, .liveChat .formChat').hide();
        break;

    }
  };

  var loginSSO = function (user_access_token, success_callback, failure_callback, password) {
    kandy.loginSSO(user_access_token, function () {
      if(typeof success_callback === 'function') {
        success_callback();
      }
    }, function () {
      if(typeof failure_callback === 'function') {
        failure_callback();
      }
    }, password);
  };

  var logout = function () {
    kandy.logout();
  };
  function loginSuccessCallback () {
    LiveChatUI.changeState('READY');
  }

  function loginFailCallback () {
    LiveChatUI.changeState('UNAVAILABLE');
  }

  function heartBeat (interval) {
    return setInterval(function () {
      jQuery.get('/kandy/kandy_still_alive');
    }, parseInt(interval));
  }

  var setup = function () {
    kandy.setup({
      listeners: {
        message: onMessage
      }
    });
  };

  var getKandyUsers = function () {
    jQuery.ajax({
      url: '/kandy/kandy_get_free_user',
      type: 'GET',
      async: false,
      dataType: 'json',
      success: function (res) {
        if (checkAvailable) {
          LiveChatUI.changeState('RECONNECTING');
        }
        else {
          LiveChatUI.changeState('WAITING');
        }
        if (res.status === 'success') {
          if (checkAvailable) {
            clearInterval(checkAvailable);
          }
          loginSSO(res.user.user_access_token, loginSuccessCallback, loginFailCallback);
          setup();
          agent = res.agent;
          heartBeat(60000);
        }
        else {
          if (!checkAvailable) {
            checkAvailable = setInterval(getKandyUsers, 5000);
          }
        }
      },
      error: function () {
        LiveChatUI.changeState('UNAVAILABLE');
      }
    });
  };

  var endChatSession = function () {
    logout();
    jQuery.ajax({
      url: '/kandy/kandy_end_chat_session',
      type: 'GET',
      async: false,
      success: function () {
        window.onbeforeunload = null;
      }
    });
  };

  var sendIM = function (username, message) {
    kandy.messaging.sendIm(username, message,
      function () {
        var messageBox = jQuery('#messageBox');
        messageBox.find('ul').append('<li class="my-message">' +
          '<span class="username">Me: </span>' +
          jQuery('#messageToSend').val() + '</li>'
        );
        jQuery('#formChat')[0].reset();
        messageBox.scrollTop(messageBox[0].scrollHeight);
      },
      function () {
        alert('IM send failed');
      }
    );
  };

  var onMessage = function (msg) {
    if (msg) {
      if (msg.messageType === 'chat' && msg.contentType === 'text' && msg.message.mimeType === 'text/plain') {
        if (msg.messageType === 'chat') {
          var sender = agent.name;
          var message = msg.message.text;
          var messageBox = jQuery('#messageBox');
          messageBox.find('ul').append('<li class="their-message"><span class="username">' +
            sender + ': </span>' + message + '</li>'
          );
          messageBox.scrollTop(messageBox[0].scrollHeight);
        }
      }
    }

  };

  jQuery(function () {
    // Hide vs restore box chat.
    jQuery('.handle.minimize, #restoreBtn').click(function () {
      jQuery('.liveChat').toggleClass('kandy_hidden');
    });

    jQuery('.handle.closeChat').click(function () {
      LiveChatUI.changeState('RATING');
    });

    jQuery('#customerInfo').on('submit', function (e) {
      var form = jQuery(this);
      e.preventDefault();
      jQuery.ajax({
        url: '/kandy/kandy_register_guest',
        data: form.serialize(),
        type: 'POST',
        success: function (res) {
          if (res.hasOwnProperty('errors')) {
            form.find('span.error').empty().hide();
            for (var e in res.errors) {
              if (res.errors.hasOwnProperty(e)) {
                form.find('span[data-input="' + e + '"]').html(res.errors[e]).show();
              }
            }
          }
          else {
            LiveChatUI.changeState('WAITING');
            getKandyUsers();
          }
        }
      });
    });

    // Form chat submit handle.
    jQuery('#formChat').on('submit', function (e) {
      e.preventDefault();
      sendIM(agent.full_user_id, jQuery('#messageToSend').val());
    });
    // End chat session if user close browser or tab.
    window.onbeforeunload = function () {
      endChatSession();
    };

    /**
     * Rating for agents JS code.
     */
    jQuery('.liveChat #ratingForm #btnEndSession').click(function (e) {
      e.preventDefault();
      LiveChatUI.changeState('ENDING_CHAT');
      setTimeout(endChatSession, 3000);
      window.location.reload();
    });
    jQuery('.liveChat #ratingForm #btnSendRate').click(function (e) {
      e.preventDefault();
      if (agent) {
        rateData.agent_id = agent.main_user_id;
      }
      var rateComment = jQuery('.liveChat #rateComment').val();
      if (rateComment) {
        rateData.comment = rateComment;
      }
      jQuery.ajax({
        url: '/kandy/kandy_rate_agent',
        data: rateData,
        type: 'POST',
        dataType: 'json',
        success: function (res) {
          if (res.success) {
            LiveChatUI.changeState('ENDING_CHAT');
            setTimeout(endChatSession, 3000);
            window.location.reload();
          }
        }
      });
    });
    jQuery('.liveChat #ratingForm .rateit').bind('rated', function () {
      var ri = jQuery(this);
      rateData.rate = {point: ri.rateit('value')};
    });

    jQuery('.liveChat #ratingForm .rateit').bind('reset', function () {
      if (rateData.hasOwnProperty('rate')) {
        delete rateData.rate;
      }
    });
  });

})();
