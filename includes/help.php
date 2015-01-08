<p>
    Kandy Module is...
</p>

<p>
    ================================================================================<br/>
    HOW TO INSTALL :
</p>

<p>
    &nbsp; &nbsp; + Install and active shortcode module https://www.drupal.org/project/shortcode<br/>
    &nbsp; &nbsp; + Enable shortcode filter at Configuration &gt; Content Authoring &gt; Text Formats<br/>
    &nbsp; &nbsp; + Uncheck auto &quot;Convert line breaks into HTML&quot;(should add new text format)<br/>
    &nbsp; &nbsp; + Configure kandy options at Configuration &gt; Content Authoring &gt; kandy
</p>

<p>
    ================================================================================<br/>
    HOW TO USE :
</p>

<p>
    &nbsp; &nbsp; - Create new content(basic page, article, or a &nbsp; &nbsp;new content types) with kandy shortcode syntax:
</p>

<p>
    &nbsp; &nbsp; + Kandy Video Call Button<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; [kandyVideoButton<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; class = &quot;myButtonStype&quot;<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; id = &quot;my-video-button&quot;<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; incomingLabel = &#39;Incoming Call...&#39;<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; incomingButtonText = &#39;Answer&#39;<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; callOutLabel = &#39;User to call&#39;<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; callOutButtonText = &#39;Call&#39;<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; callingLabel = &#39;Calling...&#39;<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; callingButtonText = &#39;End Call&#39;<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; onCallLabel = &#39;You are connected!&#39;<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; onCallButtonText = &#39;End Call&#39;]<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; [/kandyVideoButton]
</p>

<p>
    &nbsp; &nbsp; + Kandy Voice Call Button<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; [kandyVoiceButton<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; class = &quot;myButtonStype&quot;<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; id = &quot;my-voice-button&quot;<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; incomingLabel = &#39;Incoming Call...&#39;<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; incomingButtonText = &#39;Answer&#39;<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; callOutLabel = &#39;User to call&#39;<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; callOutButtonText = &#39;Call&#39;<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; callingLabel = &#39;Calling...&#39;<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; callingButtonText = &#39;End Call&#39;<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; onCallLabel = &#39;You are connected!&#39;<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; onCallButtonText = &#39;End Call&#39;<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; ]<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; [/kandyVoiceButton]
</p>

<p>
    &nbsp; &nbsp; + Kandy Video<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; [kandyVideo<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; title = &quot;Me&quot;<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; id = &quot;myVideo&quot;<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; style = &quot;width: 300px; height: 225px;background-color: darkslategray;&quot;]<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; [/kandyVideo]
</p>

<p>
    &nbsp; &nbsp; + Kandy Status<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; [kandyStatus<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; class = &quot;myStatusStyle&quot;<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; id = &quot;myStatus&quot;<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; title = &quot;My Status&quot;<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; style = &quot;...&quot;]<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; [/kandyStatus]
</p>

<p>
    &nbsp; &nbsp; + Kandy Address Book<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; [kandyAddressBook<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; class = &quot;myAddressBookStyle&quot;<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; id = &quot;myContact&quot;<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; title = &quot;My Contact&quot;<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; userLabel = &quot;User&quot;<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; searchLabel = &quot;Search&quot;<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; searchResultLabel = &quot;Directory Search Results&quot;<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; style = &quot;...&quot;<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ]<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; [/kandyAddressBook]
</p>

<p>
    &nbsp; &nbsp; + Kandy Chat<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; [kandyChat<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; class = &quot;myChatStyle&quot;<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; id = &quot;my-chat&quot;<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; contactLabel = &quot;Contacts&quot;]<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; [/kandyChat]
</p>

<p>
    &nbsp;
</p>

<p>
    &nbsp; &nbsp; - Example:
</p>

<p>
    &nbsp; &nbsp; + Kandy Voice Call<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; [kandyVoiceButton class= "myButtonStyle" id ="my-voice-button"][/kandyVoiceButton]
</p>

<p>
    &nbsp; &nbsp; + Kandy Video Call<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; [kandyVideoButton class="myButtonStype"][/kandyVideoButton]<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; [kandyVideo<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; title=&quot;Me&quot;<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; id=&quot;myVideo&quot;<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; style = &quot;width: 300px; height: 225px;background-color: darkslategray;&quot;]<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; [/kandyVideo]<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; [kandyVideo<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; title=&quot;Their&quot;<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; id=&quot;theirVideo&quot;<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; style = &quot;width: 300px; height: 225px;background-color: darkslategray;&quot;]<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; [/kandyVideo]
</p>

<p>
    &nbsp; &nbsp; + Kandy Presence<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; [kandyStatus class="myStatusStype" id="myStatus"][/kandyStatus]<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; [kandyAddressBook class="myAddressBookStyle" id="myContact"][/kandyAddressBook]
</p>

<p>
    &nbsp; &nbsp; + Kandy Chat<br/>
    &nbsp; &nbsp; &nbsp; &nbsp; [kandyChat class="myChatStyle" id ="my-chat"][/kandyChat]
</p>
