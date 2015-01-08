/**
 * You login successfully
 */
window.loginsuccess_callback = function () {
    changeUIState('LOGGED_IN');
}

/**
 * You login fail
 */
window.loginfailed_callback = function () {
    alert("Login failed");
}

window.changeUIState = function(state) {
    switch (state) {
        case 'LOGGED_OUT':
            $('.kandyChat .kandyMessages').empty();
            emptyContact();

            break;
        case 'LOGGED_IN':
            $("#loading").hide();
            $("#chat-wrapper").show();
            break;
    }
}

