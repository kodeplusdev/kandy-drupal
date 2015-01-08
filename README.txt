Kandy Module is a full-service cloud platform that enables real-time communications for business applications.
Home page: http://www.kandy.io/
================================================================================
HOW TO INSTALL :

    + Install and active shortcode module https://www.drupal.org/project/shortcode
    + Enable shortcode filter at Configuration > Content Authoring > Text Formats
    + Uncheck auto "Convert line breaks into HTML"(should add new text format)
    + Configure kandy options at Configuration > Content Authoring > kandy

================================================================================
HOW TO USE :

    - Create new content(basic page, article, or a    new content types) with kandy shortcode syntax:

    + Kandy Video Call Button
        [kandyVideoButton
            class = "myButtonStype"
            id = "my-video-button"
            incomingLabel = 'Incoming Call...'
            incomingButtonText = 'Answer'
            callOutLabel = 'User to call'
            callOutButtonText = 'Call'
            callingLabel = 'Calling...'
            callingButtonText = 'End Call'
            onCallLabel = 'You are connected!'
            onCallButtonText = 'End Call']
        [/kandyVideoButton]

    + Kandy Voice Call Button
        [kandyVoiceButton
            class = "myButtonStype"
            id = "my-voice-button"
            incomingLabel = 'Incoming Call...'
            incomingButtonText = 'Answer'
            callOutLabel = 'User to call'
            callOutButtonText = 'Call'
            callingLabel = 'Calling...'
            callingButtonText = 'End Call'
            onCallLabel = 'You are connected!'
            onCallButtonText = 'End Call'
        ]
        [/kandyVoiceButton]

    + Kandy Video
        [kandyVideo
            title = "Me"
            id = "myVideo"
            style = "width: 300px; height: 225px;background-color: darkslategray;"]
        [/kandyVideo]

    + Kandy Status
        [kandyStatus
            class = "myStatusStyle"
            id = "myStatus"
            title = "My Status"
            style = "..."]
        [/kandyStatus]

    + Kandy Address Book
        [kandyAddressBook
            class = "myAddressBookStyle"
            id = "myContact"
            title = "My Contact"
            userLabel = "User"
            searchLabel = "Search"
            searchResultLabel = "Directory Search Results"
            style = "..."
            ]
        [/kandyAddressBook]

    + Kandy Chat
        [kandyChat
            class = "myChatStyle"
            id = "my-chat"
            contactLabel = "Contacts"]
        [/kandyChat]



    - Example:

    + Kandy Voice Call
        [kandyVoiceButton class= "myButtonStyle" id ="my-voice-button"][/kandyVoiceButton]

    + Kandy Video Call
        [kandyVideoButton class="myButtonStype"][/kandyVideoButton]
        [kandyVideo
            title="Me"
            id="myVideo"
            style = "width: 300px; height: 225px;background-color: darkslategray;"]
        [/kandyVideo]
        [kandyVideo
            title="Their"
            id="theirVideo"
            style = "width: 300px; height: 225px;background-color: darkslategray;"]
        [/kandyVideo]

    + Kandy Presence
        [kandyStatus class="myStatusStype" id="myStatus"][/kandyStatus]
        [kandyAddressBook class="myAddressBookStyle" id="myContact"][/kandyAddressBook]

    + Kandy Chat
        [kandyChat class="myChatStyle" id ="my-chat"][/kandyChat]

    Note:

        * Select proper text format which enable shortcode filter to show all shortcodes correctly.
        * Check provide menu link to make your content as a menu.
        * Uncheck promoted to front end
        * Uncheck Display author and date information.
        * Close comment settings
        * Shortcode only work with inline format

        ==========================================================================================

        KANDY ADMINISTRATION

        + User assignment:

        Click KANDY USER ASSIGNMENT to sync kandy user for your application
        Select user and click edit button to assign kandy user

        + Style customization

        * Click KANDY STYLE CUSTOMIZATION to edit kandy shortcode(video, voice, chat...) style
        * Select appropriate file then click edit

        + Script customization

        * Click KANDY SCRIPT CUSTOMIZATION to edit kandy shortcode(video, voice, chat...) script
        * Select appropriate file then click edit
        * All support callback:

            window.loginsuccess_callback = function () {
               //do something when you login successfully
            }
            window.loginfailed_callback = function () {
                //do something when you login fail
            }
            window.callincoming_callback = function (call, isAnonymous) {
                //do something when your are calling
            }
            window.oncall_callback = function (call) {
                //do something when you are oncall
            }
            window.callanswered_callback = function (call, isAnonymous) {
                //do something when someone answer your call
            }

            window.callended_callback = function () {
               //do something when someone end  your call
            }

            window.answerVideoCall_callback = function (stage) {
                //do something when you answer video call
            }
            window.answerVoiceCall_callback = function (stage) {
                //do something when you answer voice call
            }

            window.makeCall_callback = function (stage) {
               //do something when you make call
            }

            window.endCall_callback = function (stage) {
               //do something when you click end call button
            }

            window.remotevideoinitialized_callack(videoTag){
               //do something with your remote video
            }

            window.localvideoinitialized_callback = function(videoTag){
                //do some thing with your local video
            }

            window.presencenotification_callack = function() {
                //do something with status notification
            }