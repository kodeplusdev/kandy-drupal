/**
 * @file
 * You login successfully.
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
 * Status Notification Callback.
 *
 * @param {string} userId
 *   Kandy user id.
 * @param {string} state
 *   Presence state.
 * @param {string} description
 *   Presence description.
 */
window.presence_notification_callback = function (userId, state, description) {
  'use strict';
  // Do something here.
};
