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
 *   Kandy call object parameter.
 * @param {bool} isAnonymous
 *   Is call by anonymous user.
 */
window.callIncomingCallback = function (call, isAnonymous) {
  'use strict';
  // Do something here.
};

/**
 * You are on call.
 *
 * @param {object} call
 *   Kandy call object parameter
 */
window.onCallCallback = function (call) {
  'use strict';
  // Do something here.
};

/**
 * Some one answer your call.
 *
 * @param {object} call
 *   Kandy call object parameter.
 * @param {bool} isAnonymous
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
 *   State of UI.
 */
window.answerVideoCallCallback = function (stage) {
  'use strict';
  // Do something here.
};

/**
 * Callback when click AnswerVideo Button.
 *
 * @param {string} stage
 *   State of UI.
 */
window.answerVoiceCallCallback = function (stage) {
  'use strict';
  // Do something here.
};

/**
 * Callback when click Call Button.
 *
 * @param {string} stage
 *   State of UI.
 */
window.makeCallCallback = function (stage) {
  'use strict';
  // Do something here.
};

/**
 * Callback when click End call Button.
 *
 * @param {string} stage
 *   State of UI.
 */
window.endCallCallback = function (stage) {
  'use strict';
  // Do something here.
};
