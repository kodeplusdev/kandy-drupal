# Kandy drupal Plugin
**KANDY** is about making communications simple with the KANDY platform managing all the complexity and hard stuff, while you focus on the intent of your application. KANDY manages all the elements of your voice, video, presence and messaging requirements. Accessing the power of KANDY is simple using our provided developer tools.

Home page: http://www.kandy.io/
## User guide
**Kandy Drupal Plugin** help you use kandy in your website easily by following steps:
+ Install and active **shortcode** module https://www.drupal.org/project/shortcode
+ Install and active **Kandy** module https://github.com/kodeplusdev/kandydrupal
+ At **Configuration > Content Authoring > Text Formats**, select one of them or add new text format then enable *shortcode filter*
+ Uncheck auto **Convert line breaks into HTML**
+ Configure all required options at **Configuration > Content Authoring > kandy**
+ Create new content(basic page, article, or a new content types) with kandy shortcode syntax.

####Kandy components and shortcode syntax:

**Kandy Video Button**: make a video call button component(video call)
```sh
[kandyVideoButton
        class = "myButtonStype"
        id = "my-video-button"
        incomingLabel = "Incoming Call..."
        incomingButtonText = "Answer"
        callOutLabel = "User to call"
        callOutButtonText = "Call"
        callingLabel = "Calling..."
        callingButtonText = "End Call"
        onCallLabel = "You are connected!"
        onCallButtonText = "End Call"]
[/kandyVideoButton]
```
**Kandy Video**: make a video component (video call)
```sh
[kandyVideo 
    title = "Me" 
    id = "myVideo" 
    style = "width: 300px; height: 225px;background-color: darkslategray;"]
[/kandyVideo]
  ```
  
  **Kandy Voice Button**: make a voice call button component (voice call)
```sh
[kandyVoiceButton
        class = "myButtonStype"
        id = "my-video-button"
        incomingLabel = "Incoming Call..."
        incomingButtonText = "Answer"
        callOutLabel = "User to call"
        callOutButtonText = "Call"
        callingLabel = "Calling..."
        callingButtonText = "End Call"
        onCallLabel = "You are connected!"
        onCallButtonText = "End Call"]
[/kandyVoiceButton]
```
  
**Kandy Status**: make a kandy user status component (available, unavailable, awway, busy....). Kandy Status usually use with kandy address book component.
```sh
[kandyStatus
        class = "myStatusStyle"
        id = "myStatus"
        title = "My Status"]
[/kandyStatus]
  ```
**Kandy Adress Book**: make an address book component which list all friend in your contact.
```sh
[kandyAddressBook
        class = "myAddressBookStyle"
        id = "myContact"
        title = "My Contact"
        userLabel = "User"
        searchLabel = "Search"
        searchResultLabel = "Directory Search Results"]
[/kandyAddressBook]
  ```
  
**Kandy Chat**: make a kandy chat component which help you send instant message to your friend in contact.
```sh
[kandyChat
        class = "myChatStyle"
        id = "my-chat"
        contactLabel = "Contacts"]
[/kandyChat]
  ```
  
### Quick Examples: 
**Kandy Voice Call**
```sh
[kandyVoiceButton class= "myButtonStyle" id="my-button"][/kandyVoiceButton]
```
**Kandy Video Call**: use a video call button and two video(**myVideo** and **theirVideo** id is required).
   ```sh
[kandyVideoButton class="myButtonStype"][/kandyVideoButton]
[kandyVideo title="Me" id="myVideo"][/kandyVideo]
[kandyVideo title="Their"  id="theirVideo"][/kandyVideo]
```
**Kandy Presence**: use a kandystatus and kandy addressbook compobent
```sh
[kandyStatus class="myStatusStype" id="myStatus"][/kandyStatus]
[kandyAddressBook class="myAddressBookStyle" id="myContact"][/kandyAddressBook]
```

**Kandy Chat: **
```sh
[kandyChat class="myChatStyle" id ="my-chat"]
```

####Kandy Administration:
**Settings: ** 

- **API Key:** Kandy API key which found in your kandy account.
- **Domain Secret Key:** Domain Kandy API key which found in your kandy account.
- **Domain Name:** Domain name of you kandy account.
- **Javascript Library Url**: Link to kandy javascript library.
- **FCS Library Url**: Link to kandy FCS javascript library.
- **Jquery Reload**: If you need use kandy jquery library, set it yes.


**User assignment:**  help you synchronize kandy users from kandy server to your users system. Select your user and click edit button to assign(unassign) kandy user.

**Style customization**: help you edit kandy shortcode(video, voice, chat...) style. Select appropriate file(.css) then click edit them.

**Script customization** help you edit kandy shortcode(video, voice, chat...) script(add more behaviour). Select appropriate file(.js) then click edit them.

***All support script callback:***
```sh
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

window.answerVoiceCall_callback = function (stage) {
    //do something when you answer voice call
}

window.answerVideoCall_callback = function (stage) {
    //do something when you answer video call
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
```

### Kandy API
You can use kandy module anywhere in your code by following code:

**Load Kandy Module**
```sh
module_load_include('php', 'kandy', 'kandy.api');
```
After load kandy module succucessfully you can use all support api:

**1. Get kandy user data for assignment table**
```sh
Kandy_getUserData();
```
Return:  kandy user object **array**

**2. Get kandy domain access token**
```sh
Kandy_getDomainAccessToken();
```
Return: **array**

```sh
$result = array("success" => true,
                "data" => "data",
                "message" => '')
OR
$result = array("success" => false,
                "data" => "data",
                "message" => "message")
```

**3. Get the kandy domain**
```sh
Kandy_getDomain();
```
Get kandy domain from kandy settings or remote server

Return: **array **

```sh
$result = array("success" => true,
                "data" => "data",
                "message" => '');
OR
$result = array("success" => false,
                "data" => "data",
                "message" => "message");
```

**4. List Kandy User from database/remote**
```sh
Kandy_listUsers($type = KANDY_USER_ALL, $remote = false)
```
Parameters:
```sh
$type(int) :
    KANDY_USER_ALL: all kandy users from database/remote
    KANDY_USER_ASSIGNED: all assigned kandy users from database/remote
    KANDY_USER_UNASSIGNED: all unassigned kandy users from database/remote
$remote(boolean) :
    If $remote = true, get kandy users from remote server(kandy server) instead of from database(local). Default is false.
```
Return: Kandy user object **array**

**5. Get assigned kandy user by current user id(main_user_id)**
```sh
Kandy_getAssignUser($mainUserId)
```
Parameters:
```sh
$mainUserId(int): normal user id(1, 2, 3....)
```
Return kandy user object or null

**6 Get kandy user by kandy user id(kandyUserId)**
```sh
Kandy_getUserByUserId($kandyUserId)
```
Parameters:
```sh
$kandyUserId(int): kandy user id without domain(user1, user2....)
```
Return kandy user object or null

**7. Assign a normal user to kandy user**
```sh
Kandy_assignUser($kandyUserId, $mainUserId)
```
Parameters:
```sh
$kandyUserId(string) : kandy user id without domain(user1, user2....)
$mainuserId(int): normal user id(1, 2, 3....)
```
Return: true/false

**8. Unassign a kandy user**
```sh
Kandy_unassignUser($mainUserId)
```
Parameters:
```sh
$mainuserId(int): normal user id(1, 2, 3....)
```
Return: true/false

**9. Kandy User synchronization**

Synchronize kandy user from remote server to local
```sh
Kandy_syncUsers()
```

Return: array
```sh
$result = array(
                'success' => true,
                'message' => "Sync successfully"
            );
OR
$result = array(
                'success' => false,
                'message' => "Error Data"
            );

```

### Troubleshooting
- **Kandy Shortcode not working:** check your kandy api key, domain secret key for your application at **admin > config > content > kandy**
- **Jquery conflict**: Set Jquery reload to true at **admin > config > content > kandy**
- **Note:**
    * Select proper text format which enable shortcode filter to show all shortcodes correctly.
    * Check provide menu link to make your content as a menu.
    * Uncheck promoted to front end
    * Uncheck Display author and date information.
    * Close comment settings
    * Shortcode only work with inline format
