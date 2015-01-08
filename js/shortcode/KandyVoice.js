window.loginsuccess_callback = function () {
    changeUIState('READY_FOR_CALLING');
}
window.loginfailed_callback = function () {
    alert("Login failed");
}
window.callincoming_callback = function (call, isAnonymous) {
    changeUIState('BEING_CALLED');
}
window.oncall_callback = function (call) {
    changeUIState("ON_CALL");
}
window.callanswered_callback = function (call, isAnonymous) {
    changeUIState("ON_CALL");
}

window.callended_callback = function () {
    changeUIState('READY_FOR_CALLING');
}
/*
*   Callback when click AnswerVideo Button
 */
window.answerVideoCall_callback = function (stage) {
    changeUIState(stage);
}

/*
 *   Callback when click AnswerVideo Button
 */
window.answerVoiceCall_callback = function (stage) {
    changeUIState(stage);
}

/*
 *   Callback when click Call Button
 */
window.makeCall_callback = function (stage) {
    changeUIState(stage);
}

/*
 *   Callback when click End call Button
 */
window.endCall_callback = function (stage) {
    changeUIState(stage);
}

window.changeUIState = function (state) {
    switch (state) {
        case 'LOGGED_OUT':
            $('#loggedIn').hide();
            break;
        case 'READY_FOR_CALLING':
            $('#loggedIn').show();
            $("#loading").hide();
            $("#voiceCallWrapper").show();
            break;
        case 'BEING_CALLED':
            $('#loggedIn').hide();
            break;
        case 'CALLING':
            $('#loggedIn').hide();
            break;
        case 'ON_CALL':
            $('#loggedIn').hide();
            break;
    }
}

