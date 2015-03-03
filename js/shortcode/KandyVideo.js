/**
 * You login success.
 */
window.login_success_callback = function () {
  // Do something here.
};

/**
 * You login fail.
 */
window.login_failed_callback = function () {
  // Do something here.
};

/**
 * Someone are calling you.
 *
 * @param call
 * @param isAnonymous
 */
window.call_incoming_callback = function (call, isAnonymous) {
  // Do something here.
};

/**
 * You are on call.
 *
 * @param call
 */
window.on_call_callback = function (call) {
  // Do something here.
};
/**
 * Some one answer your call.
 *
 * @param call
 * @param isAnonymous
 */
window.call_answered_callback = function (call, isAnonymous) {
  // Do something here.
};

/**
 * End call callback.
 */
window.call_ended_callback = function () {
  // Do something here.
};

/**
 * Callback when click AnswerVideo Button.
 *
 * @param stage
 */
window.answer_video_call_callback = function (stage) {
  changeUIState(stage);
};

/**
 * Callback when click AnswerVideo Button.
 *
 * @param stage
 */
window.answer_voice_call_callback = function (stage) {
  changeUIState(stage);
};

/**
 * Callback when click Call Button.
 *
 * @param stage
 */
window.make_call_callback = function (stage) {
  changeUIState(stage);
};

/**
 * Callback when click End call Button.
 *
 * @param stage
 */
window.end_all_callback = function (stage) {
  // Do something here.
};

/**
 * Remote video callback.
 *
 * @param state
 */
window.remote_video_initialized_callack = function (videoTag) {
  // Do something here.
};

/**
 * Your local video callback.
 *
 * @param videoTag
 */
window.local_video_initialized_callback = function (videoTag) {
  // Do something here.
};
