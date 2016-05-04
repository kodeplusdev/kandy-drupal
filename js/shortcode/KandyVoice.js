/**
 * @file
 * You login success.
 */

window.login_success_callback = function () {
  'use strict';
  // Do something here.
};

/**
 * You login fail.
 */
window.login_failed_callback = function () {
  'use strict';
  // Do something here.
};

/**
 * Someone are calling you.
 *
 * @param {object} call
 *   Kandy call object.
 * @param {bool} isAnonymous
 *   Is caller anonymous.
 */
window.call_incoming_callback = function (call, isAnonymous) {
  'use strict';
  // Do something here.
};

/**
 * You are on call.
 *
 * @param {object} call
 *   Kandy call object.
 */
window.on_call_callback = function (call) {
  'use strict';
  // Do something here.
};

/**
 * Some one answer your call.
 *
 * @param {object} call
 *   Kandy call object.
 * @param {boolean} isAnonymous
 *   Is call by anonymous user.
 */
window.call_answered_callback = function (call, isAnonymous) {
  'use strict';
  // Do something here.
};

/**
 * End call callback.
 */
window.call_ended_callback = function () {
  'use strict';
  // Do something here.
};

/**
 * Callback when click AnswerVideo Button.
 *
 * @param {string} stage
 *   UI status.
 */
window.answer_video_call_callback = function (stage) {
  'use strict';
  // Do something here.
};

/**
 * Callback when click AnswerVideo Button.
 *
 * @param {string} stage
 *   UI status.
 */
window.answer_voice_call_callback = function (stage) {
  'use strict';
  // Do something here.
};

/**
 * Callback when click Call Button.
 *
 * @param {string} stage
 *   UI status
 */
window.make_call_callback = function (stage) {
  'use strict';
  // Do something here.
};

/**
 * Callback when click End call Button.
 *
 * @param {string} stage
 *   UI status
 */
window.end_all_callback = function (stage) {
  'use strict';
  // Do something here.
};
