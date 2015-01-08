/**
 * you login successfully
 */
window.loginsuccess_callback = function () {
    changeUIState("LOGGED_IN");
}

/**
 * You login fail
 */
window.loginfailed_callback = function () {
    alert("Login failed");
    changeUIState("LOGGED_OUT");
}
/**
 * Status Notification Callback
 * @param userId
 * @param state
 * @param description
 * @param activity
 */
window.presencenotification_callack = function(){
    //do something
}

window.changeUIState = function (state) {
    switch (state) {
        case 'LOGGED_OUT':
            $("#dirSearchResults div:not(:first)").remove();
            break;
        case 'LOGGED_IN':
            //do some thing
            break;
    }
}

