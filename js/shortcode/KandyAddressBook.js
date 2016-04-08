/**
 * @file
 *
 * You login successfully.
 */

window.login_success_callback = function () {
  "use strict";
  // Do something here.
};

/**
 * You login fail.
 */
window.login_failed_callback = function () {
  "use strict";
  // Do something here.
};

/**
 * Status Notification Callback.
 *
 * @param {string} userId
 * @param {string} state
 * @param {string} description
 * @param {string }activity
 */
window.presence_notification_callback = function (userId, state, description, activity) {
  "use strict";
  // Do something here.
};
