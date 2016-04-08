/**
 * @file
 *
 * Kandy cobrowsing feature.
 *
 */
(function () {
  /**
   * On join request callback, currently use for co-browser.
   *
   * @param notification
   */
  var kandy_onSessionJoinRequest = function (notification) {
    var message = 'User ' + notification.full_user_id + ' request to join session ' + sessionNames[notification.session_id];
    var confirm = window.confirm(message);
    if (confirm) {
      kandy_approveJoinSession(notification.session_id, notification.full_user_id);
    }
  };
  var openSessions = [];
  var currentSession;
  // Sessions that current user created.
  var myOwnSessions = [];
  // Sessions that current user is a participant.
  var mySessions = [];
  var browsingType;
  var sessionNames = {};
  var sessionListeners = {
    'onUserJoinRequest': kandy_onSessionJoinRequest,
    'onJoinApprove': kandy_onSessionJoinApprove
  };
  var currentKandyUser, btnTerminate, btnStartCoBrowsing, btnStartCoBrowsing, btnConnect,
    btnStartBrowsingViewer, btnLeave, slSessionList, btnStop;
  var cobrowsing = window.cobrowsing || {};
  jQuery(document).ready(function () {
    currentKandyUser = cobrowsing.current_user.user_id + '@' + cobrowsing.current_user.domain_name;
    btnTerminate = jQuery("#coBrowsing .buttons #" + cobrowsing.btn_terminate_id);
    btnStartCoBrowsing = jQuery("#coBrowsing .buttons #" + cobrowsing.btn_start_cobrowsing_id);
    btnConnect = jQuery("#coBrowsing .buttons #" + cobrowsing.btn_connect_session_id);
    btnStartBrowsingViewer = jQuery("#coBrowsing .buttons #" + cobrowsing.btn_start_browsing_viewer_id);
    btnLeave = jQuery("#coBrowsing .buttons #" + cobrowsing.btn_leave_id);
    slSessionList = jQuery('#' + cobrowsing.session_list_id);
    btnStop = jQuery('#' + cobrowsing.btn_stop_id);
  });

  function displayButtons() {
    var isAdmin = false, isMember = false;
    currentSession = openSessions[parseInt(slSessionList.val())];
    if (typeof  currentSession != 'undefined') {
      isAdmin = myOwnSessions.indexOf(currentSession.session_id) > -1;
      isMember = (mySessions.indexOf(currentSession.session_id) > -1 && !isAdmin);
    }

    // If current user is owner of this session.
    if (isAdmin) {
      btnTerminate.show();
      btnStartCoBrowsing.show();
      btnConnect.hide();
      btnStartBrowsingViewer.hide();
      btnLeave.hide();
    }
    else {
      if (isMember) {
        btnStartBrowsingViewer.show();
        btnConnect.hide();
        btnStartCoBrowsing.hide();
        btnTerminate.hide();
        btnLeave.show();
      }
      else {
        btnConnect.show();
        btnStartCoBrowsing.hide();
        btnStartBrowsingViewer.hide();
        btnTerminate.hide();
        btnLeave.hide();
      }
    }
  }

  var hideAllButtons = function () {
    btnConnect.hide();
    btnLeave.hide();
    btnStartBrowsingViewer.hide();
    btnStartCoBrowsing.hide();
    btnStop.hide();
    btnTerminate.hide();
  };

  window.loadSessionList = function (sessions) {
    var i = 0;
    var sessionList = slSessionList;
    sessionList.empty();
    openSessions = [];
    if (sessions.length) {
      sessions.forEach(function (session) {
        // Only use session with type = cobrowsing.
        if (session.session_type == 'cobrowsing') {
          sessionNames[session.session_id] = session.session_name;
          openSessions.push(session);
          if ((session.admin_full_user_id == currentKandyUser) && (myOwnSessions.indexOf(session.session_id) == -1)) {
            myOwnSessions.push(session.session_id);
          }
          kandy_getSessionInfo(session.session_id, function (result) {
            result.session.participants.forEach(function (p) {
              if ((p.full_user_id == currentKandyUser) && (mySessions.indexOf(session.session_id) == -1)) {
                mySessions.push(session.session_id);
              }
            })
          });
          KandyAPI.Session.setListeners(session.session_id, sessionListeners);
          var option = jQuery("<option>").val(i).text(session.session_name || session.session_id);
          sessionList.append(option);
          i++;
        }
      });
      setTimeout(displayButtons, 3000);
    }
    else {
      var option = jQuery("<option>").val('').text('No Session');
      sessionList.append(option);
      hideAllButtons();
    }
  };
  window.sessionJoinApprovedCallback = function (sessionId) {
    mySessions.push(sessionId);
    displayButtons();
  };
  /**
   * Start co-browsing agent.
   *
   * @param sessionId
   * @param holder - id of browsing holder
   */
  var kandy_startCoBrowsingAgent = function (sessionId, holder) {
    KandyAPI.CoBrowse.startBrowsingAgent(sessionId, holder);
  };

  /**
   * Create session.
   *
   * @param config
   * @param successCallback
   * @param failCallback
   */

  var kandy_createSession = function (config, successCallback, failCallback) {
    KandyAPI.Session.create(
      config,
      function (result) {
        if (typeof successCallback == "function") {
          activateSession(result.session_id);
          successCallback(result);
        }
      },
      function () {
        if (typeof failCallback == "function") {
          failCallback();
        }
      }
    )
  };

  /**
   * Activate session.
   *
   * @param sessionId
   */
  var activateSession = function (sessionId) {
    KandyAPI.Session.activate(
      sessionId
    );
  };

  /* Stop co-browsing agent. */
  var kandy_stopCoBrowsingAgent = function () {
    KandyAPI.CoBrowse.stopBrowsingAgent();
  };

  /* Start co-browsing session. */
  var kandy_startCoBrowsing = function (sessionId) {
    KandyAPI.CoBrowse.startBrowsingUser(sessionId);
  };

  /* Stop co-browsing session. */
  var kandy_stopCoBrowsing = function () {
    KandyAPI.CoBrowse.stopBrowsingUser();
  };
  /* Get all co-browsing sessions. */
  var getCoBrowsingSessions = function () {
    kandy_getOpenSessionsByType('cobrowsing', loadSessionList);
  };
  /* Document ready. */
  jQuery(function () {
    jq("#kandy-chat-create-group-modal").dialog({
      autoOpen: false,
      height: 300,
      width: 600,
      modal: true,
      buttons: {
        "Save": function () {
          var groupName = jq('#kandy-chat-create-session-name').val();
          var creationTime = new Date().getTime();
          // Expire in 1 year.
          var timeExpire = creationTime + 31536000;
          if (groupName == '') {
            alert('Session must have a name.');
            jQuery('#kandy-chat-create-session-name').focus();
          }
          else {
            // Config.
            var config = {
              session_type: 'cobrowsing',
              session_name: groupName,
              creation_timestamp: creationTime,
              expiry_timestamp: timeExpire
            };
            kandy_createSession(config, function () {
              getCoBrowsingSessions();
            });
            jQuery('#kandy-chat-create-session-name').val('');
            jq(this).dialog("close");
          }
        },
        Cancel: function () {
          jq(this).dialog("close");
        }
      }
    });

    jQuery("#btnCreateSession").click(function () {
      jq("#kandy-chat-create-group-modal").dialog('open');
      jQuery('#kandy-chat-create-session-name').focus();
    });

    btnConnect.click(function () {
      currentSession = openSessions[parseInt(slSessionList.val())];
      kandy_joinSession(currentSession.session_id);
    });
    slSessionList.on('change', displayButtons);

    btnTerminate.on('click', function () {
      var confirm = window.confirm("Are you sure to terminate this session?");
      if (confirm) {
        var session = openSessions[parseInt(slSessionList.val())];
        myOwnSessions.splice(myOwnSessions.indexOf(session.session_id, 1));
        mySessions.splice(mySessions.indexOf(session.session_id), 1);
        kandy_terminateSession(session.session_id, getCoBrowsingSessions);
      }
    });
    btnStartCoBrowsing.on('click', function () {
      if (currentSession) {
        jQuery("#coBrowsing").addClass("browsing");
        slSessionList.attr("disabled", true);
        browsingType = 'user';
        kandy_startCoBrowsing(currentSession.session_id);
      }
    });
    btnStartBrowsingViewer.on('click', function () {
      if (currentSession) {
        browsingType = 'agent';
        slSessionList.attr("disabled", true);
        jQuery("#coBrowsing").addClass("browsing");
        kandy_startCoBrowsingAgent(currentSession.session_id, document.getElementById(cobrowsing.holder_id));
      }
    });

    btnStop.on('click', function () {
      jQuery("#coBrowsing").removeClass("browsing");
      try {
        if (browsingType == 'user') {
          kandy_stopCoBrowsing();
        }
        else if (browsingType == 'agent') {
          kandy_stopCoBrowsingAgent();
        }
      } catch (e) {
        alert('An error has occurred!');
      } finally {
        slSessionList.attr("disabled", false);
      }
    });
    btnLeave.on('click', function () {
      var confirm = window.confirm("Are you sure to leave this session?");
      if (confirm) {
        if (currentSession) {
          // Delete from my session array.
          kandy_leaveSession(currentSession.session_id, function (sessionId) {
            mySessions.splice(mySessions.indexOf(sessionId), 1);
            displayButtons();
          });
        }
      }
    })
  });
})();
