/**
 * @file
 * You login success.
 */

window.loginSuccessCallback = function () {
  'use strict';
  // Do something here.
};

/**
 * You login fail.
 */
window.loginFailedCallback = function () {
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
window.callIncomingCallback = function (call, isAnonymous) {
  'use strict';
  // Do something here.
};

/**
 * You are on call.
 *
 * @param {object} call
 *   Kandy call object.
 */
window.onCallCallback = function (call) {
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
window.callAnsweredCallback = function (call, isAnonymous) {
  'use strict';
  // Do something here.
};

/**
 * End call callback.
 */
window.callEndedCallback = function () {
  'use strict';
  // Do something here.
};

/**
 * Callback when click AnswerVideo Button.
 *
 * @param {string} stage
 *   UI status.
 */
window.answerVideoCallCallback = function (stage) {
  'use strict';
  // Do something here.
};

/**
 * Callback when click AnswerVideo Button.
 *
 * @param {string} stage
 *   UI status.
 */
window.answerVoiceCallCallback = function (stage) {
  'use strict';
  // Do something here.
};

/**
 * Callback when click Call Button.
 *
 * @param {string} stage
 *   UI status
 */
window.makeCallCallback = function (stage) {
  'use strict';
  // Do something here.
};

/**
 * Callback when click End call Button.
 *
 * @param {string} stage
 *   UI status
 */
window.endCallCallback = function (stage) {
  'use strict';
  // Do something here.
};
