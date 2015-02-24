/**
 * You login success.
 *
 */
window.loginsuccess_callback = function () {
    // Do something here.
}

/**
 * You login fail.
 */
window.loginfailed_callback = function () {
    // Do something here.
}

/**
 * Someone are calling you.
 *
 * @param call
 * @param isAnonymous
 */
window.callincoming_callback = function (call, isAnonymous) {
    // Do something here.
}

/**
 * You are on call.
 *
 * @param call
 */
window.oncall_callback = function (call) {
    // Do something here.
}
/**
 * Some one answer your call.
 *
 * @param call
 * @param isAnonymous
 */
window.callanswered_callback = function (call, isAnonymous) {
    // Do something here.
}

/**
 * end call callback.
 *
 */
window.callended_callback = function () {
    // Do something here.
}

/**
 * Callback when click AnswerVideo Button.
 *
 * @param stage
 */
window.answerVideoCall_callback = function (stage) {
    changeUIState(stage);
}

/**
 * Callback when click AnswerVideo Button.
 *
 * @param stage
 */
window.answerVoiceCall_callback = function (stage) {
    changeUIState(stage);
}

/**
 * Callback when click Call Button.
 *
 * @param stage
 */
window.makeCall_callback = function (stage) {
    changeUIState(stage);
}

/**
 * Callback when click End call Button.
 *
 * @param stage
 */
window.endCall_callback = function (stage) {
    // Do something here.
}

/**
 * Remote video callback.
 *
 * @param state
 */
window.remotevideoinitialized_callack = function(videoTag){
    // Do something here.
}
/**
 * Your local video callback.
 *
 * @param videoTag
 */
window.localvideoinitialized_callback = function(videoTag){
    // Do something here.
}

