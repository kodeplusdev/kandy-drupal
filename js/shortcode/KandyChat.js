/**
 * You login successfully
 */
window.loginsuccess_callback = function () {
    //do something here
}

/**
 * You login fail
 */
window.loginfailed_callback = function () {
    //alert("Login failed");
}

/**
 * Status Notification Callback
 * @param userId
 * @param state
 * @param description
 * @param activity
 */
window.presencenotification_callack = function(userId, state, description, activity){
    //do something here
}
