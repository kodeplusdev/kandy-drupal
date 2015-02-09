/**
 * You login success
 */
window.loginsuccess_callback = function () {
    //do something here
}

/**
 * you login fail
 */
window.loginfailed_callback = function () {
    //do something here
}

/**
 * Someone are calling you
 * @param call
 * @param isAnonymous
 */
window.callincoming_callback = function (call, isAnonymous) {
    //do something here
}

/**
 * You are on call
 * @param call
 */
window.oncall_callback = function (call) {
    //do something here
}
/**
 * Some one answer your call
 * @param call
 * @param isAnonymous
 */
window.callanswered_callback = function (call, isAnonymous) {
    //do something here
}

/**
 * end call callback
 */
window.callended_callback = function () {
    //do something here
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
    //do something here
}

/**
 * remote video callback
 * @param state
 */
window.remotevideoinitialized_callack = function(videoTag){
    //do something here
}
/**
 * Your local video callback
 * @param videoTag
 */
window.localvideoinitialized_callback = function(videoTag){
    //do something here
}

