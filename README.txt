Kandy Module is...

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