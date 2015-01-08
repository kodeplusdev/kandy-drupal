/**
 * You login success
 */
window.loginsuccess_callback = function () {
    changeUIState('READY_FOR_CALLING');
}

/**
 * you login fail
 */
window.loginfailed_callback = function () {
    alert("Login failed");
}

/**
 * Someone are calling you
 * @param call
 * @param isAnonymous
 */
window.callincoming_callback = function (call, isAnonymous) {
    changeUIState('BEING_CALLED');
}

/**
 * You are on call
 * @param call
 */
window.oncall_callback = function (call) {
    changeUIState("ON_CALL");
}
/**
 * Some one answer your call
 * @param call
 * @param isAnonymous
 */
window.callanswered_callback = function (call, isAnonymous) {
    changeUIState("ON_CALL");
}

/**
 * end call callback
 */
window.callended_callback = function () {
    changeUIState('READY_FOR_CALLING');
}


/**
 * Callback when click AnswerVideo Button
 * @param stage
 */
window.answerVideoCall_callback = function (stage) {
    changeUIState(stage);
}


/**
 * Callback when click AnswerVideo Button
 * @param stage
 */
window.answerVoiceCall_callback = function (stage) {
    changeUIState(stage);
}

/**
 * Callback when click Call Button
 * @param stage
 */
window.makeCall_callback = function (stage) {
    changeUIState(stage);
}

/**
 * Callback when click End call Button
 * @param stage
 */
window.endCall_callback = function (stage) {
    changeUIState(stage);
}

/**
 * remote video callback
 * @param state
 */
window.remotevideoinitialized_callack = function(videoTag){
    //do some thing with your remote video
}
/**
 * Your local video callback
 * @param videoTag
 */
window.localvideoinitialized_callback = function(videoTag){
    //do some thing with your local video
}
window.changeUIState = function (state) {
    switch (state) {
        case 'READY_FOR_CALLING':
            $(".kandyVideo").show();

            break;
        case 'BEING_CALLED':
            break;
        case 'CALLING':
            break;
        case 'ON_CALL':

            break;
    }
}

