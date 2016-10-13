/**
 * @file
 * You login successfully.
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
 * Status Notification Callback.
 *
 * @param {string} userId
 *   Kandy user .
 * @param {string} state
 *   Presence state.
 * @param {string} description
 *   Presence description.
 */
window.presenceNotificationCallback = function (userId, state, description) {
  'use strict';
  // Do something here.
};
