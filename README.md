# Kandy Drupal Module
This Drupal module encapsulates Kandy’s JS SDK and Restful APIs.
Kandy is a product by GENBAND (www.genband.com)
that utilizes WebRTC to enable peer to peer audio and video calls and chat.
SMS and PSTN calling support will be added to this module in the near future.

With this module, you can enable video and audio calling
between two users that are logged into your Drupal application.

Think of pages where you anticipate users collaborating with each other,
possibly to discuss content on those pages.
Your users could start a video call with other online users and
 enhance the collaboration experience.
Home page: http://www.kandy.io/
## User guide
**Installation**
+ Install **shortcode** module https://www.drupal.org/project/shortcode
+ Install **Kandy** module https://github.com/kandy-io/kandy-drupal
+ At **Configuration > Content Authoring > Text Formats**, 
select one of them or add new text format then enable **shortcode filter**
+ Uncheck auto **Convert line breaks into HTML**
+ Configure all required options at **Configuration > Content Authoring >kandy**
+ Synchronize and assign kandy user at 
**Configuration > Content Authoring > kandy > Kandy User Assignment**
+ Create new content(basic page, article, or a new content types) 
with kandy shortcode syntax.

**Settings:**

Login to https://www.kandy.io, select one project and get the following
information:
- **API Key:** Kandy API key of the selected project.
- **Domain Secret Key:** Domain Kandy API key of the selected project.
- **Domain Name:** Domain name of the selected project.

Below are default configuration:
- **Javascript Library Url**:
  https://kandy-portal.s3.amazonaws.com/public/javascript/kandy/1.1.4/kandy.js
- **FCS Library Url**:
  https://kandy-portal.s3.amazonaws.com/public/javascript/fcs/3.0.0/fcs.js
- **Jquery Reload**: If you need to use kandy jquery library, set it to yes.

**User assignment:**  help you synchronize kandy users
from kandy server to your users system. 
Select your user and click edit button to assign(unassign) kandy user.

**Style customization**: help you edit 
kandy shortcode(video, voice, chat...) style. 
Select appropriate file(.css) then click edit them.

**Script customization** 
help you edit kandy shortcode(video, voice, chat...) script(add more behaviour).
Select appropriate file(.js) then click edit them.

***All support script callback:***
```sh
window.login_success_callback = function () {
   //do something when you login successfully
}

window.login_failed_callback = function () {
    //do something when you login fail
}

window.call_incoming_callback = function (call, isAnonymous) {
    //do something when your are calling
}

window.on_call_callback = function (call) {
    //do something when you are on call
}

window.call_answered_callback = function (call, isAnonymous) {
    //do something when someone answer your call
}

window.call_ended_callback = function () {
   //do something when someone end  your call
}

window.answer_voice_call_callback = function (stage) {
    //do something when you answer voice call
}

window.answer_video_call_callback = function (stage) {
    //do something when you answer video call
}

window.make_call_callback = function (stage) {
   //do something when you make call
}

window.end_all_callback = function (stage) {
   //do something when you click end call button
}

window.remote_video_initialized_callback(videoTag) {
   //do something with your remote video
}

window.local_video_initialized_callback = function(videoTag) {
    //do some thing with your local video
}

window.presence_notification_callback =
function(userId, state, description, activity) {
    //do something with status notification
}
```

####Kandy components and shortcode syntax:

**Kandy Video Button**: make a video call button component(video call)
```sh
[kandyVideoButton
        class = "myButtonStyle"
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
        class = "myButtonStyle"
        id = "my-video-button"
        incomingLabel = "Incoming Call..."
        incomingButtonText = "Answer"
        callOutLabel = "User to call"
        callOutButtonText = "Call"
        callingLabel = "Calling..."
        callingButtonText = "End Call"
        onCallLabel = "You are connected!"
        onCallButtonText = "End Call"
        type = "PSTN"
        callTo ="01234xxxxx"]
[/kandyVoiceButton]
```

**Kandy Status**: make a kandy user status component 
(available, unavailable, awway, busy....). 
Kandy Status usually use with kandy address book component.
```sh
[kandyStatus
        class = "myStatusStyle"
        id = "myStatus"
        title = "My Status"]
[/kandyStatus]
  ```
**Kandy Address Book**: make an address book component 
which list all friend in your contact.
```sh
[kandyAddressBook
        class = "myAddressBookStyle"
        id = "myContact"
        title = "My Contact"
        userLabel = "User"
        addContactLabel = "Add Contact"]
[/kandyAddressBook]
  ```

**Kandy Chat**: make a kandy chat component 
which help you send instant message to your friend in contact.
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

**Kandy Voice Call PSTN**
```sh
[kandyVoiceButton type= "PSTN" class= "myButtonStyle" id="my-button"]
[/kandyVoiceButton]
```

**Kandy Voice Call PSTN with number**
```sh
[kandyVoiceButton type= "PSTN" callTo = "01234xxxx"
class= "myButtonStyle" id="my-button"][/kandyVoiceButton]
```

**Kandy Video Call**: use a video call button and two video
(**myVideo** and **theirVideo** id is required).
   ```sh
[kandyVideoButton class="myButtonStyle"][/kandyVideoButton]
[kandyVideo title="Me" id="myVideo"][/kandyVideo]
[kandyVideo title="Their" id="theirVideo"][/kandyVideo]
```
**Kandy Presence**: use a kandystatus and kandy addressbook compobent
```sh
[kandyStatus class="myStatusStyle" id="myStatus"][/kandyStatus]
[kandyAddressBook class="myAddressBookStyle" id="myContact"][/kandyAddressBook]
```

**Kandy Chat**:
```sh
[kandyChat class="myChatStyle" id="my-chat"][/kandyChat]
```

### Kandy API
You can use kandy module anywhere in your code by following code:

**Load Kandy Module**
```sh
module_load_include('php', 'kandy', 'kandy_api');
```
After load kandy module succucessfully you can use all support api:

**1. Get kandy user data for assignment table**
```sh
kandy_get_user_data();
```
Return:  kandy user object **array**

**2. Get kandy domain access token**
```sh
kandy_get_domain_access_token();
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
kandy_get_domain();
```
Get kandy domain from kandy settings or remote server

Return: **array**

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
kandy_list_users($type = KANDY_USER_ALL, $remote = false)
```
Parameters:
```sh
$type(int) :
    KANDY_USER_ALL: all kandy users from database/remote
    KANDY_USER_ASSIGNED: all assigned kandy users from database/remote
    KANDY_USER_UNASSIGNED: all unassigned kandy users from database/remote
$remote(boolean) :
    If $remote = true, get kandy users from remote server(kandy server) 
instead of from database(local). Default is false.
```
Return: Kandy user object **array**

**5. Get assigned kandy user by current user id(main_user_id)**
```sh
kandy_get_assign_user($mainUserId)
```
Parameters:
```sh
$mainUserId(int): normal user id(1, 2, 3....)
```
Return kandy user object or null

**6 Get kandy user by kandy user id(kandyUserId)**
```sh
kandy_get_user_by_user_id($kandyUserId)
```
Parameters:
```sh
$kandyUserId(int): kandy user id without domain(user1, user2....)
```
Return kandy user object or null

**7. Assign a normal user to kandy user**
```sh
kandy_assign_user($kandyUserId, $mainUserId)
```
Parameters:
```sh
$kandyUserId(string) : kandy user id without domain(user1, user2....)
$mainuserId(int): normal user id(1, 2, 3....)
```
Return: true/false

**8. Unassign a kandy user**
```sh
kandy_unassign_user($mainUserId)
```
Parameters:
```sh
$mainuserId(int): normal user id(1, 2, 3....)
```
Return: true/false

**9. Kandy User synchronization**

Synchronize kandy user from remote server to local
```sh
kandy_sync_users()
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
- **Supported browser**: Chrome
- **Kandy Shortcode not working:** 
check your kandy api key, domain secret key for your application 
at **admin > config > content > kandy**
- **Jquery conflict**: Set Jquery reload to true 
at **admin > config > content > kandy**
- **Note:**
    * When you uninstall kandy module, make sure to delete the public folder:
    **sites/default/files/kandy**
    * Select proper text format which enable shortcode filter.
    * Check provide menu link to make your content as a menu.
    * Uncheck promoted to front end
    * Uncheck Display author and date information.
    * Close comment settings
    * Shortcode only work with inline format
