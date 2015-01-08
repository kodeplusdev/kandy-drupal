window.loginsuccess_callback = function () {
    changeUIState("LOGGED_IN");
}
window.loginfailed_callback = function () {
    alert("Login failed");
    changeUIState("LOGGED_OUT");
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

