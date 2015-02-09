<p>
    <strong>Kandy Module</strong> is a full-service cloud platform that enables real-time communications for business applications.
</p>

<p>
    Home page: <a href="">http://www.kandy.io/</a>
</p>

<h4>
    ================================================================================
</h4>

<p style="box-sizing: border-box; padding-top: 0.66001rem; -webkit-font-feature-settings: 'kern' 1, 'onum' 1, 'liga' 1; margin-top: 0px; margin-bottom: 1.33999rem; color: rgb(55, 61, 73); font-family: Georgia, Cambria, serif; font-size: 14px; line-height: 28px;">
    <span style="box-sizing: border-box; font-weight: 700;">Kandy Drupal Module</span>&nbsp;help you use kandy in your website easily by following steps:
</p>

<ul style="box-sizing: border-box; margin-bottom: 0.83999rem; padding-top: 0.16001rem; color: rgb(55, 61, 73); font-family: Georgia, Cambria, serif; font-size: 14px; line-height: 28px;">
    <li style="box-sizing: border-box; -webkit-font-feature-settings: 'kern' 1, 'onum' 1, 'liga' 1; margin-left: 1rem;">
        Install and active&nbsp;<span style="box-sizing: border-box; font-weight: 700;">shortcode</span>&nbsp;module&nbsp;<a href="https://www.drupal.org/project/shortcode" style="box-sizing: border-box; cursor: pointer; color: rgb(160, 170, 191); background: 0px 0px;">https://www.drupal.org/project/shortcode</a>
    </li>
    <li style="box-sizing: border-box; -webkit-font-feature-settings: 'kern' 1, 'onum' 1, 'liga' 1; margin-left: 1rem;">
        Install and active&nbsp;<span style="box-sizing: border-box; font-weight: 700;">Kandy</span>&nbsp;module&nbsp;<a href="https://github.com/kodeplusdev/kandydrupal" style="box-sizing: border-box; cursor: pointer; color: rgb(160, 170, 191); background: 0px 0px;">https://github.com/kodeplusdev/kandydrupal</a>
    </li>
    <li style="box-sizing: border-box; -webkit-font-feature-settings: 'kern' 1, 'onum' 1, 'liga' 1; margin-left: 1rem;">
        At&nbsp;<span style="box-sizing: border-box; font-weight: 700;">Configuration &gt; Content Authoring &gt; Text Formats</span>, select one of them or add new text format then enable&nbsp;<em style="box-sizing: border-box;">shortcode filter</em>
    </li>
    <li style="box-sizing: border-box; -webkit-font-feature-settings: 'kern' 1, 'onum' 1, 'liga' 1; margin-left: 1rem;">
        Uncheck auto&nbsp;<span style="box-sizing: border-box; font-weight: 700;">Convert line breaks into HTML</span>
    </li>
    <li style="box-sizing: border-box; -webkit-font-feature-settings: 'kern' 1, 'onum' 1, 'liga' 1; margin-left: 1rem;">
        Configure all required options at&nbsp;<span style="box-sizing: border-box; font-weight: 700;">Configuration &gt; Content Authoring &gt; kandy</span>
    </li>
    <li style="box-sizing: border-box; -webkit-font-feature-settings: 'kern' 1, 'onum' 1, 'liga' 1; margin-left: 1rem;">
        Synchronize and assign kandy user at&nbsp;<span style="box-sizing: border-box; font-weight: 700;">Configuration &gt; Content Authoring &gt; kandy &gt; Kandy User Assignment</span>
    </li>
    <li style="box-sizing: border-box; -webkit-font-feature-settings: 'kern' 1, 'onum' 1, 'liga' 1; margin-left: 1rem;">
        Create new content(basic page, article, or a new content types) with kandy shortcode syntax.
    </li>
</ul>

<h4>
    ================================================================================
</h4>

<h4>
    <br />
    <strong>HOW TO USE :</strong>
</h4>

<p>
    &nbsp; &nbsp; - Create new content (basic page, article). A good point if you&nbsp;add a new content types <em><strong>Structure &gt; Content types &gt; add new content type </strong>(kandy)</em>&nbsp;with kandy shortcode syntax:
</p>

<p>
    &nbsp; &nbsp; <strong>+ Kandy Video Call Button</strong><br />
    &nbsp; &nbsp; &nbsp; &nbsp; <span style="color:#696969;">[kandyVideoButton<br />
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; class = &quot;myButtonStyle&quot;<br />
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; id = &quot;my-video-button&quot;<br />
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; incomingLabel = &#39;Incoming Call...&#39;<br />
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; incomingButtonText = &#39;Answer&#39;<br />
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; callOutLabel = &#39;User to call&#39;<br />
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; callOutButtonText = &#39;Call&#39;<br />
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; callingLabel = &#39;Calling...&#39;<br />
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; callingButtonText = &#39;End Call&#39;<br />
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; onCallLabel = &#39;You are connected!&#39;<br />
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; onCallButtonText = &#39;End Call&#39;]<br />
	&nbsp; &nbsp; &nbsp; &nbsp; [/kandyVideoButton]</span>
</p>

<p>
    &nbsp; &nbsp; <strong>+ Kandy Voice Call Button</strong><br />
    &nbsp; &nbsp; &nbsp; &nbsp; <span style="color:#696969;">[kandyVoiceButton<br />
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; class = &quot;myButtonStyle&quot;<br />
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; id = &quot;my-voice-button&quot;<br />
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; incomingLabel = &#39;Incoming Call...&#39;<br />
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; incomingButtonText = &#39;Answer&#39;<br />
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; callOutLabel = &#39;User to call&#39;<br />
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; callOutButtonText = &#39;Call&#39;<br />
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; callingLabel = &#39;Calling...&#39;<br />
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; callingButtonText = &#39;End Call&#39;<br />
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; onCallLabel = &#39;You are connected!&#39;<br />
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; onCallButtonText = &#39;End Call&#39;]<br />
	&nbsp; &nbsp; &nbsp; &nbsp; [/kandyVoiceButton]</span>
</p>

<p>
    &nbsp; &nbsp; + <strong>Kandy Video</strong><br />
    &nbsp; &nbsp; &nbsp; &nbsp;<span style="color:#696969;"> [kandyVideo<br />
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; title = &quot;Me&quot;<br />
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; id = &quot;myVideo&quot;<br />
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; style = &quot;width: 300px; height: 225px;background-color: darkslategray;&quot;]<br />
	&nbsp; &nbsp; &nbsp; &nbsp; [/kandyVideo]</span>
</p>

<p>
    &nbsp; &nbsp; + <strong>Kandy Status</strong><br />
    &nbsp; &nbsp; &nbsp; &nbsp; <span style="color:#696969;">[kandyStatus<br />
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; class = &quot;myStatusStyle&quot;<br />
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; id = &quot;myStatus&quot;<br />
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; title = &quot;My Status&quot;<br />
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; style = &quot;...&quot;]<br />
	&nbsp; &nbsp; &nbsp; &nbsp; [/kandyStatus]</span>
</p>

<p>
    &nbsp; &nbsp; + <strong>Kandy Address Book</strong><br />
    &nbsp; &nbsp; &nbsp; &nbsp; <span style="color:#696969;">[kandyAddressBook<br />
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; class = &quot;myAddressBookStyle&quot;<br />
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; id = &quot;myContact&quot;<br />
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; title = &quot;My Contact&quot;<br />
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; userLabel = &quot;User&quot;<br />
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; searchLabel = &quot;Search&quot;<br />
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; searchResultLabel = &quot;Directory Search Results&quot;<br />
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; style = &quot;...&quot;<br />
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ]<br />
	&nbsp; &nbsp; &nbsp; &nbsp; [/kandyAddressBook]</span>
</p>

<p>
    &nbsp; &nbsp; + <strong>Kandy Chat</strong><br />
    &nbsp; &nbsp; &nbsp; &nbsp;<span style="color:#696969;"> [kandyChat<br />
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; class = &quot;myChatStyle&quot;<br />
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; id = &quot;my-chat&quot;<br />
	&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; contactLabel = &quot;Contacts&quot;]<br />
	&nbsp; &nbsp; &nbsp; &nbsp; [/kandyChat]</span>
</p>

<p>
    &nbsp;
</p>

<h4>
    &nbsp; &nbsp; - <strong>Example</strong>:
</h4>

<p>
    <strong>&nbsp; &nbsp; + Kandy Voice Call</strong><br />
    &nbsp; &nbsp; &nbsp; &nbsp;<span style="color:#696969;"> [kandyVoiceButton class= "myButtonStyle" id ="my-voice-button"][/kandyVoiceButton]</span>
</p>

<p>
    &nbsp;
</p>

<p>
    <strong>&nbsp; &nbsp; + Kandy Video Call</strong><br />
    &nbsp; &nbsp; &nbsp; &nbsp;<span style="color:#696969;">[kandyVideoButton class="myButtonStyle"][/kandyVideoButton]<br />
	&nbsp; &nbsp; &nbsp; &nbsp;[kandyVideo title="Me" id="myVideo" style = "width: 300px; height: 225px;background-color: darkslategray;"] [/kandyVideo]<br />
	&nbsp; &nbsp; &nbsp; &nbsp;[kandyVideo title="Their" &nbsp;id="theirVideo" style = "width: 300px; height: 225px;background-color: darkslategray;"][/kandyVideo]</span>
</p>

<p>
    &nbsp;
</p>

<p>
    <strong>&nbsp; &nbsp; + Kandy Presence</strong><br />
    &nbsp; &nbsp; &nbsp; &nbsp; <span style="color:#696969;">[kandyStatus class="myStatusStyle" id="myStatus"][/kandyStatus]<br />
	&nbsp; &nbsp; &nbsp; &nbsp; [kandyAddressBook class="myAddressBookStyle" id="myContact"][/kandyAddressBook]</span>
</p>

<p>
    &nbsp;
</p>

<p>
    <strong>&nbsp; &nbsp; + Kandy Chat</strong><br />
    <span style="color:#808080;">&nbsp; &nbsp; &nbsp; &nbsp; </span><span style="color:#696969;">[kandyChat class="myChatStyle" id ="my-chat"][/kandyChat]</span>
</p>

<p>
    &nbsp;
</p>

<p>
    Note:
</p>

<ul>
    <li>
        Select proper text format which enable shortcode filter to show all shortcodes correctly.
    </li>
    <li>
        <font face="Lucida Grande, Lucida Sans Unicode, sans-serif"><span style="font-size: 12px; line-height: 20.0063037872314px;">Check provide menu link to make your content as a menu.</span></font>
    </li>
    <li>
        <font face="Lucida Grande, Lucida Sans Unicode, sans-serif"><span style="font-size: 12px; line-height: 20.0063037872314px;">Uncheck promoted to front end</span></font>
    </li>
    <li>
        <font face="Lucida Grande, Lucida Sans Unicode, sans-serif"><span style="font-size: 12px; line-height: 20.0063037872314px;">Uncheck&nbsp;</span></font><span style="font-family: 'Lucida Grande', 'Lucida Sans Unicode', sans-serif; font-size: 12px; line-height: 20.0063037872314px;">Display author and date information.</span>
    </li>
    <li>
        <span style="font-family: 'Lucida Grande', 'Lucida Sans Unicode', sans-serif; font-size: 12px; line-height: 20.0063037872314px;">Close comment settings</span>
    </li>
    <li>
        <span style="font-family: 'Lucida Grande', 'Lucida Sans Unicode', sans-serif; font-size: 12px; line-height: 20.0063037872314px;">Shortcode only work with inline format</span>
    </li>
</ul>

<p>
    ==========================================================================================
</p>

<h4>
    <strong>KANDY ADMINISTRATION</strong>
</h4>

<p>
    <strong>+ User assignment: &nbsp;</strong>
</p>

<ol style="margin-left: 40px;">
    <li>
        Click <em><strong>KANDY USER ASSIGNMENT&nbsp;</strong></em>to sync kandy user for your application
    </li>
    <li>
        Select user and click <em><strong>edit</strong></em> button to assign kandy user
    </li>
</ol>

<div>
    &nbsp;
</div>

<div>
    <strong>+ Style customization</strong>
</div>

<ol style="margin-left: 40px;">
    <li>
        Click <em><strong>KANDY STYLE CUSTOMIZATION</strong></em> to edit kandy shortcode(video, voice, chat...) style
    </li>
    <li>
        Select appropriate file then click edit
    </li>
</ol>

<div>
    &nbsp;
</div>

<p>
    <strong>+ Script customization</strong>
</p>

<ol style="line-height: 20.7999992370605px; margin-left: 40px;">
    <li>
        Click <em><strong>KANDY SCRIPT CUSTOMIZATION</strong></em> to edit kandy shortcode(video, voice, chat...) script
    </li>
    <li>
        Select&nbsp;appropriate file then click edit
    </li>
    <li>
        All support callback:&nbsp;
    </li>
</ol>

<div>
    <p style="margin-left: 80px;">
		<span style="color:#696969;">window.loginsuccess_callback = function () {<br />
		&nbsp; &nbsp;<span style="line-height: 20.7999992370605px;">//do something when you login successfully</span><br />
		}<br />
		window.loginfailed_callback = function () {<br />
		&nbsp; &nbsp; <span style="line-height: 20.7999992370605px;">//do something when you login fail</span><br />
		}<br />
		window.callincoming_callback = function (call, isAnonymous) {<br />
		&nbsp; &nbsp; <span style="line-height: 20.7999992370605px;">//do something when your are&nbsp;calling</span><br />
		}<br />
		window.oncall_callback = function (call) {<br />
		&nbsp; &nbsp; <span style="line-height: 20.7999992370605px;">//do something when you are oncall</span><br />
		}<br />
		window.callanswered_callback = function (call, isAnonymous) {<br />
		&nbsp; &nbsp; <span style="line-height: 20.7999992370605px;">//do something when someone&nbsp;answer your call</span><br />
		}</span>
    </p>

    <p style="margin-left: 80px;">
		<span style="color:#696969;">window.callended_callback = function () {<br />
		&nbsp; &nbsp;<span style="line-height: 20.7999992370605px;">//do something when someone&nbsp;end &nbsp;your call</span><br />
		}</span>
    </p>

    <p style="margin-left: 80px;">
		<span style="color:#696969;"><span style="line-height: 20.7999992370605px;">window.answerVoiceCall_callback = function (stage) {</span><br style="line-height: 20.7999992370605px;" />
		<br />
		<br />
		<span style="line-height: 20.7999992370605px;">&nbsp; &nbsp;&nbsp;</span><span style="line-height: 20.7999992370605px;">//do something when you answer voice call</span><br style="line-height: 20.7999992370605px;" />
		<br />
		<br />
		<span style="line-height: 20.7999992370605px;">}</span></span>
    </p>

    <p style="margin-left: 80px;">
		<span style="color:#696969;">window.answerVideoCall_callback = function (stage) {<br />
		&nbsp;&nbsp; &nbsp;//do something when you answer video call<br />
		}<br />
		window.makeCall_callback = function (stage) {<br />
		&nbsp; &nbsp;<span style="line-height: 20.7999992370605px;">//do something when you make call</span><br />
		}</span>
    </p>

    <p style="margin-left: 80px;">
        <br />
		<span style="color:#696969;">window.endCall_callback = function (stage) {<br />
		&nbsp; &nbsp;//do something when you click end call button<br />
		}</span>
    </p>

    <p style="margin-left: 80px;">
        <span style="color:#696969;">window.remotevideoinitialized_callack(videoTag){</span>
    </p>

    <p style="margin-left: 80px;">
        <span style="color:#696969;">&nbsp; &nbsp;//do something with your remote video</span>
    </p>

    <p style="margin-left: 80px;">
        <span style="color:#696969;">}</span>
    </p>

    <p style="margin-left: 80px;">
		<span style="color:#696969;">window.localvideoinitialized_callback = function(videoTag){<br />
		&nbsp; &nbsp; //do some thing with your local video<br />
		}</span>
    </p>

    <p style="margin-left: 80px;">
		<span style="color:#696969;">window.presencenotification_callack = function() {<br />
		&nbsp; &nbsp; //do something with status notification</span>
    </p>

    <p style="margin-left: 80px;">
        <span style="color:#696969;">}<em>&nbsp;</em></span>
    </p>

    <p style="margin-left: 80px;">
        &nbsp;
    </p>
</div>

<div>
<h4>
    &nbsp;
</h4>

<h3 id="kandy-api" style="box-sizing: border-box; font-family: 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-feature-settings: 'dlig' 1, 'liga' 1, 'lnum' 1, 'kern' 1; font-weight: 600; margin-top: 0px; line-height: 3rem; font-size: 1.64571rem; margin-bottom: 0.07599rem; padding-top: 0.92401rem; color: rgb(55, 61, 73);">
    Kandy API
</h3>

<p style="box-sizing: border-box; padding-top: 0.66001rem; -webkit-font-feature-settings: 'kern' 1, 'onum' 1, 'liga' 1; margin-top: 0px; margin-bottom: 1.33999rem; color: rgb(55, 61, 73); font-family: Georgia, Cambria, serif; font-size: 14px; line-height: 28px;">
    You can use kandy module anywhere in your code by following code:
</p>

<p style="box-sizing: border-box; padding-top: 0.66001rem; -webkit-font-feature-settings: 'kern' 1, 'onum' 1, 'liga' 1; margin-top: 0px; margin-bottom: 1.33999rem; color: rgb(55, 61, 73); font-family: Georgia, Cambria, serif; font-size: 14px; line-height: 28px;">
    <span style="box-sizing: border-box; font-weight: 700;">Load Kandy Module</span>
</p>

	<pre style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1.33999rem; word-break: break-all; border: 1px solid rgb(211, 218, 234); border-radius: 4px; overflow: auto; font-family: monospace, monospace; font-size: 14px; padding: 0.66001rem 9.5px 9.5px; line-height: 28px; background-image: linear-gradient(rgb(255, 255, 255) 0px, rgb(255, 255, 255) 0.75rem, rgb(245, 247, 250) 0.75rem, rgb(245, 247, 250) 2.75rem, rgb(255, 255, 255) 2.75rem, rgb(255, 255, 255) 4rem); background-attachment: initial; background-size: initial; background-origin: initial; background-clip: initial; background-position: initial; background-repeat: initial;">
<code class="lang-sh" style="box-sizing: border-box; color: inherit; border-radius: 0px; padding: 0px; font-size: inherit; font-family: monospace, monospace; background-color: transparent;"><span class="hljs-attribute" style="box-sizing: border-box; color: rgb(181, 137, 0);">module_load_include</span>(<span class="hljs-string" style="box-sizing: border-box; color: rgb(42, 161, 152);">&#39;php&#39;</span>, <span class="hljs-string" style="box-sizing: border-box; color: rgb(42, 161, 152);">&#39;kandy&#39;</span>, <span class="hljs-string" style="box-sizing: border-box; color: rgb(42, 161, 152);">&#39;kandy.api&#39;</span>);
</code></pre>

<p style="box-sizing: border-box; padding-top: 0.66001rem; -webkit-font-feature-settings: 'kern' 1, 'onum' 1, 'liga' 1; margin-top: 0px; margin-bottom: 1.33999rem; color: rgb(55, 61, 73); font-family: Georgia, Cambria, serif; font-size: 14px; line-height: 28px;">
    After load kandy module succucessfully you can use all support api:
</p>

<p style="box-sizing: border-box; padding-top: 0.66001rem; -webkit-font-feature-settings: 'kern' 1, 'onum' 1, 'liga' 1; margin-top: 0px; margin-bottom: 1.33999rem; color: rgb(55, 61, 73); font-family: Georgia, Cambria, serif; font-size: 14px; line-height: 28px;">
    <span style="box-sizing: border-box; font-weight: 700;">1. Get kandy user data for assignment table</span>
</p>

	<pre style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1.33999rem; word-break: break-all; border: 1px solid rgb(211, 218, 234); border-radius: 4px; overflow: auto; font-family: monospace, monospace; font-size: 14px; padding: 0.66001rem 9.5px 9.5px; line-height: 28px; background-image: linear-gradient(rgb(255, 255, 255) 0px, rgb(255, 255, 255) 0.75rem, rgb(245, 247, 250) 0.75rem, rgb(245, 247, 250) 2.75rem, rgb(255, 255, 255) 2.75rem, rgb(255, 255, 255) 4rem); background-attachment: initial; background-size: initial; background-origin: initial; background-clip: initial; background-position: initial; background-repeat: initial;">
<code class="lang-sh" style="box-sizing: border-box; color: inherit; border-radius: 0px; padding: 0px; font-size: inherit; font-family: monospace, monospace; background-color: transparent;"><span class="hljs-attribute" style="box-sizing: border-box; color: rgb(181, 137, 0);">Kandy_getUserData</span>();
</code></pre>

<p style="box-sizing: border-box; padding-top: 0.66001rem; -webkit-font-feature-settings: 'kern' 1, 'onum' 1, 'liga' 1; margin-top: 0px; margin-bottom: 1.33999rem; color: rgb(55, 61, 73); font-family: Georgia, Cambria, serif; font-size: 14px; line-height: 28px;">
    Return: kandy user object&nbsp;<span style="box-sizing: border-box; font-weight: 700;">array</span>
</p>

<p style="box-sizing: border-box; padding-top: 0.66001rem; -webkit-font-feature-settings: 'kern' 1, 'onum' 1, 'liga' 1; margin-top: 0px; margin-bottom: 1.33999rem; color: rgb(55, 61, 73); font-family: Georgia, Cambria, serif; font-size: 14px; line-height: 28px;">
    <span style="box-sizing: border-box; font-weight: 700;">2. Get kandy domain access token</span>
</p>

	<pre style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1.33999rem; word-break: break-all; border: 1px solid rgb(211, 218, 234); border-radius: 4px; overflow: auto; font-family: monospace, monospace; font-size: 14px; padding: 0.66001rem 9.5px 9.5px; line-height: 28px; background-image: linear-gradient(rgb(255, 255, 255) 0px, rgb(255, 255, 255) 0.75rem, rgb(245, 247, 250) 0.75rem, rgb(245, 247, 250) 2.75rem, rgb(255, 255, 255) 2.75rem, rgb(255, 255, 255) 4rem); background-attachment: initial; background-size: initial; background-origin: initial; background-clip: initial; background-position: initial; background-repeat: initial;">
<code class="lang-sh" style="box-sizing: border-box; color: inherit; border-radius: 0px; padding: 0px; font-size: inherit; font-family: monospace, monospace; background-color: transparent;"><span class="hljs-attribute" style="box-sizing: border-box; color: rgb(181, 137, 0);">Kandy_getDomainAccessToken</span>();
</code></pre>

<p style="box-sizing: border-box; padding-top: 0.66001rem; -webkit-font-feature-settings: 'kern' 1, 'onum' 1, 'liga' 1; margin-top: 0px; margin-bottom: 1.33999rem; color: rgb(55, 61, 73); font-family: Georgia, Cambria, serif; font-size: 14px; line-height: 28px;">
    Return:&nbsp;<span style="box-sizing: border-box; font-weight: 700;">array</span>
</p>

	<pre style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1.33999rem; word-break: break-all; border: 1px solid rgb(211, 218, 234); border-radius: 4px; overflow: auto; font-family: monospace, monospace; font-size: 14px; padding: 0.66001rem 9.5px 9.5px; line-height: 28px; background-image: linear-gradient(rgb(255, 255, 255) 0px, rgb(255, 255, 255) 0.75rem, rgb(245, 247, 250) 0.75rem, rgb(245, 247, 250) 2.75rem, rgb(255, 255, 255) 2.75rem, rgb(255, 255, 255) 4rem); background-attachment: initial; background-size: initial; background-origin: initial; background-clip: initial; background-position: initial; background-repeat: initial;">
<code class="lang-sh" style="box-sizing: border-box; color: inherit; border-radius: 0px; padding: 0px; font-size: inherit; font-family: monospace, monospace; background-color: transparent;">$<span class="hljs-literal" style="box-sizing: border-box;">result</span> = <span class="hljs-type" style="box-sizing: border-box; color: rgb(181, 137, 0);">array</span>(<span class="hljs-string" style="box-sizing: border-box; color: rgb(42, 161, 152);">&quot;success&quot;</span> =&gt; <span class="hljs-literal" style="box-sizing: border-box;">true</span>,
    <span class="hljs-string" style="box-sizing: border-box; color: rgb(42, 161, 152);">&quot;data&quot;</span> =&gt; <span class="hljs-string" style="box-sizing: border-box; color: rgb(42, 161, 152);">&quot;data&quot;</span>,
    <span class="hljs-string" style="box-sizing: border-box; color: rgb(42, 161, 152);">&quot;message&quot;</span> =&gt; &#39;&#39;)
    <span class="hljs-type" style="box-sizing: border-box; color: rgb(181, 137, 0);">OR</span>
    $<span class="hljs-literal" style="box-sizing: border-box;">result</span> = <span class="hljs-type" style="box-sizing: border-box; color: rgb(181, 137, 0);">array</span>(<span class="hljs-string" style="box-sizing: border-box; color: rgb(42, 161, 152);">&quot;success&quot;</span> =&gt; <span class="hljs-literal" style="box-sizing: border-box;">false</span>,
    <span class="hljs-string" style="box-sizing: border-box; color: rgb(42, 161, 152);">&quot;data&quot;</span> =&gt; <span class="hljs-string" style="box-sizing: border-box; color: rgb(42, 161, 152);">&quot;data&quot;</span>,
    <span class="hljs-string" style="box-sizing: border-box; color: rgb(42, 161, 152);">&quot;message&quot;</span> =&gt; <span class="hljs-string" style="box-sizing: border-box; color: rgb(42, 161, 152);">&quot;message&quot;</span>)
</code></pre>

<p style="box-sizing: border-box; padding-top: 0.66001rem; -webkit-font-feature-settings: 'kern' 1, 'onum' 1, 'liga' 1; margin-top: 0px; margin-bottom: 1.33999rem; color: rgb(55, 61, 73); font-family: Georgia, Cambria, serif; font-size: 14px; line-height: 28px;">
    <span style="box-sizing: border-box; font-weight: 700;">3. Get the kandy domain</span>
</p>

	<pre style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1.33999rem; word-break: break-all; border: 1px solid rgb(211, 218, 234); border-radius: 4px; overflow: auto; font-family: monospace, monospace; font-size: 14px; padding: 0.66001rem 9.5px 9.5px; line-height: 28px; background-image: linear-gradient(rgb(255, 255, 255) 0px, rgb(255, 255, 255) 0.75rem, rgb(245, 247, 250) 0.75rem, rgb(245, 247, 250) 2.75rem, rgb(255, 255, 255) 2.75rem, rgb(255, 255, 255) 4rem); background-attachment: initial; background-size: initial; background-origin: initial; background-clip: initial; background-position: initial; background-repeat: initial;">
<code class="lang-sh" style="box-sizing: border-box; color: inherit; border-radius: 0px; padding: 0px; font-size: inherit; font-family: monospace, monospace; background-color: transparent;"><span class="hljs-attribute" style="box-sizing: border-box; color: rgb(181, 137, 0);">Kandy_getDomain</span>();
</code></pre>

<p style="box-sizing: border-box; padding-top: 0.66001rem; -webkit-font-feature-settings: 'kern' 1, 'onum' 1, 'liga' 1; margin-top: 0px; margin-bottom: 1.33999rem; color: rgb(55, 61, 73); font-family: Georgia, Cambria, serif; font-size: 14px; line-height: 28px;">
    Get kandy domain from kandy settings or remote server
</p>

<p style="box-sizing: border-box; padding-top: 0.66001rem; -webkit-font-feature-settings: 'kern' 1, 'onum' 1, 'liga' 1; margin-top: 0px; margin-bottom: 1.33999rem; color: rgb(55, 61, 73); font-family: Georgia, Cambria, serif; font-size: 14px; line-height: 28px;">
    Return:&nbsp;<span style="box-sizing: border-box; font-weight: 700;">array</span>
</p>

	<pre style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1.33999rem; word-break: break-all; border: 1px solid rgb(211, 218, 234); border-radius: 4px; overflow: auto; font-family: monospace, monospace; font-size: 14px; padding: 0.66001rem 9.5px 9.5px; line-height: 28px; background-image: linear-gradient(rgb(255, 255, 255) 0px, rgb(255, 255, 255) 0.75rem, rgb(245, 247, 250) 0.75rem, rgb(245, 247, 250) 2.75rem, rgb(255, 255, 255) 2.75rem, rgb(255, 255, 255) 4rem); background-attachment: initial; background-size: initial; background-origin: initial; background-clip: initial; background-position: initial; background-repeat: initial;">
<code class="lang-sh" style="box-sizing: border-box; color: inherit; border-radius: 0px; padding: 0px; font-size: inherit; font-family: monospace, monospace; background-color: transparent;">$<span class="hljs-literal" style="box-sizing: border-box;">result</span> = <span class="hljs-type" style="box-sizing: border-box; color: rgb(181, 137, 0);">array</span>(<span class="hljs-string" style="box-sizing: border-box; color: rgb(42, 161, 152);">&quot;success&quot;</span> =&gt; <span class="hljs-literal" style="box-sizing: border-box;">true</span>,
    <span class="hljs-string" style="box-sizing: border-box; color: rgb(42, 161, 152);">&quot;data&quot;</span> =&gt; <span class="hljs-string" style="box-sizing: border-box; color: rgb(42, 161, 152);">&quot;data&quot;</span>,
    <span class="hljs-string" style="box-sizing: border-box; color: rgb(42, 161, 152);">&quot;message&quot;</span> =&gt; &#39;&#39;);
    <span class="hljs-type" style="box-sizing: border-box; color: rgb(181, 137, 0);">OR</span>
    $<span class="hljs-literal" style="box-sizing: border-box;">result</span> = <span class="hljs-type" style="box-sizing: border-box; color: rgb(181, 137, 0);">array</span>(<span class="hljs-string" style="box-sizing: border-box; color: rgb(42, 161, 152);">&quot;success&quot;</span> =&gt; <span class="hljs-literal" style="box-sizing: border-box;">false</span>,
    <span class="hljs-string" style="box-sizing: border-box; color: rgb(42, 161, 152);">&quot;data&quot;</span> =&gt; <span class="hljs-string" style="box-sizing: border-box; color: rgb(42, 161, 152);">&quot;data&quot;</span>,
    <span class="hljs-string" style="box-sizing: border-box; color: rgb(42, 161, 152);">&quot;message&quot;</span> =&gt; <span class="hljs-string" style="box-sizing: border-box; color: rgb(42, 161, 152);">&quot;message&quot;</span>);
</code></pre>

<p style="box-sizing: border-box; padding-top: 0.66001rem; -webkit-font-feature-settings: 'kern' 1, 'onum' 1, 'liga' 1; margin-top: 0px; margin-bottom: 1.33999rem; color: rgb(55, 61, 73); font-family: Georgia, Cambria, serif; font-size: 14px; line-height: 28px;">
    <span style="box-sizing: border-box; font-weight: 700;">4. List Kandy User from database/remote</span>
</p>

	<pre style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1.33999rem; word-break: break-all; border: 1px solid rgb(211, 218, 234); border-radius: 4px; overflow: auto; font-family: monospace, monospace; font-size: 14px; padding: 0.66001rem 9.5px 9.5px; line-height: 28px; background-image: linear-gradient(rgb(255, 255, 255) 0px, rgb(255, 255, 255) 0.75rem, rgb(245, 247, 250) 0.75rem, rgb(245, 247, 250) 2.75rem, rgb(255, 255, 255) 2.75rem, rgb(255, 255, 255) 4rem); background-attachment: initial; background-size: initial; background-origin: initial; background-clip: initial; background-position: initial; background-repeat: initial;">
<code class="lang-sh" style="box-sizing: border-box; color: inherit; border-radius: 0px; padding: 0px; font-size: inherit; font-family: monospace, monospace; background-color: transparent;"><span class="hljs-function" style="box-sizing: border-box;"><span class="hljs-title" style="box-sizing: border-box; color: rgb(38, 139, 210);">Kandy_listUsers</span><span class="hljs-params" style="box-sizing: border-box;">(<span class="hljs-variable" style="box-sizing: border-box; color: rgb(181, 137, 0);">$type</span> = KANDY_USER_ALL, <span class="hljs-variable" style="box-sizing: border-box; color: rgb(181, 137, 0);">$remote</span> = false)</span></span>
</code></pre>

<p style="box-sizing: border-box; padding-top: 0.66001rem; -webkit-font-feature-settings: 'kern' 1, 'onum' 1, 'liga' 1; margin-top: 0px; margin-bottom: 1.33999rem; color: rgb(55, 61, 73); font-family: Georgia, Cambria, serif; font-size: 14px; line-height: 28px;">
    Parameters:
</p>

	<pre style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1.33999rem; word-break: break-all; border: 1px solid rgb(211, 218, 234); border-radius: 4px; overflow: auto; font-family: monospace, monospace; font-size: 14px; padding: 0.66001rem 9.5px 9.5px; line-height: 28px; background-image: linear-gradient(rgb(255, 255, 255) 0px, rgb(255, 255, 255) 0.75rem, rgb(245, 247, 250) 0.75rem, rgb(245, 247, 250) 2.75rem, rgb(255, 255, 255) 2.75rem, rgb(255, 255, 255) 4rem); background-attachment: initial; background-size: initial; background-origin: initial; background-clip: initial; background-position: initial; background-repeat: initial;">
<code class="lang-sh" style="box-sizing: border-box; color: inherit; border-radius: 0px; padding: 0px; font-size: inherit; font-family: monospace, monospace; background-color: transparent;">$type(<span class="hljs-keyword" style="box-sizing: border-box; color: rgb(133, 153, 0);">int</span>) :
    KANDY_USER_ALL: all kandy users <span class="hljs-keyword" style="box-sizing: border-box; color: rgb(133, 153, 0);">from</span> database/remote
    KANDY_USER_ASSIGNED: all assigned kandy users <span class="hljs-keyword" style="box-sizing: border-box; color: rgb(133, 153, 0);">from</span> database/remote
    KANDY_USER_UNASSIGNED: all unassigned kandy users <span class="hljs-keyword" style="box-sizing: border-box; color: rgb(133, 153, 0);">from</span> database/remote
    $remote(boolean) :
    If $remote = <span class="hljs-keyword" style="box-sizing: border-box; color: rgb(133, 153, 0);">true</span>, <span class="hljs-function" style="box-sizing: border-box;"><span class="hljs-keyword" style="box-sizing: border-box; color: rgb(133, 153, 0);">get</span> kandy users <span class="hljs-keyword" style="box-sizing: border-box; color: rgb(133, 153, 0);">from</span> remote <span class="hljs-title" style="box-sizing: border-box; color: rgb(38, 139, 210);">server</span><span class="hljs-params" style="box-sizing: border-box;">(kandy server)</span> instead of <span class="hljs-keyword" style="box-sizing: border-box; color: rgb(133, 153, 0);">from</span> <span class="hljs-title" style="box-sizing: border-box; color: rgb(38, 139, 210);">database</span><span class="hljs-params" style="box-sizing: border-box;">(local)</span>. Default <span class="hljs-keyword" style="box-sizing: border-box; color: rgb(133, 153, 0);">is</span> <span class="hljs-keyword" style="box-sizing: border-box; color: rgb(133, 153, 0);">false</span>.</span>
</code></pre>

<p style="box-sizing: border-box; padding-top: 0.66001rem; -webkit-font-feature-settings: 'kern' 1, 'onum' 1, 'liga' 1; margin-top: 0px; margin-bottom: 1.33999rem; color: rgb(55, 61, 73); font-family: Georgia, Cambria, serif; font-size: 14px; line-height: 28px;">
    Return: Kandy user object&nbsp;<span style="box-sizing: border-box; font-weight: 700;">array</span>
</p>

<p style="box-sizing: border-box; padding-top: 0.66001rem; -webkit-font-feature-settings: 'kern' 1, 'onum' 1, 'liga' 1; margin-top: 0px; margin-bottom: 1.33999rem; color: rgb(55, 61, 73); font-family: Georgia, Cambria, serif; font-size: 14px; line-height: 28px;">
    <span style="box-sizing: border-box; font-weight: 700;">5. Get assigned kandy user by current user id(main_user_id)</span>
</p>

	<pre style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1.33999rem; word-break: break-all; border: 1px solid rgb(211, 218, 234); border-radius: 4px; overflow: auto; font-family: monospace, monospace; font-size: 14px; padding: 0.66001rem 9.5px 9.5px; line-height: 28px; background-image: linear-gradient(rgb(255, 255, 255) 0px, rgb(255, 255, 255) 0.75rem, rgb(245, 247, 250) 0.75rem, rgb(245, 247, 250) 2.75rem, rgb(255, 255, 255) 2.75rem, rgb(255, 255, 255) 4rem); background-attachment: initial; background-size: initial; background-origin: initial; background-clip: initial; background-position: initial; background-repeat: initial;">
<code class="lang-sh" style="box-sizing: border-box; color: inherit; border-radius: 0px; padding: 0px; font-size: inherit; font-family: monospace, monospace; background-color: transparent;"><span class="hljs-function" style="box-sizing: border-box;"><span class="hljs-title" style="box-sizing: border-box; color: rgb(38, 139, 210);">Kandy_getAssignUser</span><span class="hljs-params" style="box-sizing: border-box;">(<span class="hljs-variable" style="box-sizing: border-box; color: rgb(181, 137, 0);">$mainUserId</span>)</span></span>
</code></pre>

<p style="box-sizing: border-box; padding-top: 0.66001rem; -webkit-font-feature-settings: 'kern' 1, 'onum' 1, 'liga' 1; margin-top: 0px; margin-bottom: 1.33999rem; color: rgb(55, 61, 73); font-family: Georgia, Cambria, serif; font-size: 14px; line-height: 28px;">
    Parameters:
</p>

	<pre style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1.33999rem; word-break: break-all; border: 1px solid rgb(211, 218, 234); border-radius: 4px; overflow: auto; font-family: monospace, monospace; font-size: 14px; padding: 0.66001rem 9.5px 9.5px; line-height: 28px; background-image: linear-gradient(rgb(255, 255, 255) 0px, rgb(255, 255, 255) 0.75rem, rgb(245, 247, 250) 0.75rem, rgb(245, 247, 250) 2.75rem, rgb(255, 255, 255) 2.75rem, rgb(255, 255, 255) 4rem); background-attachment: initial; background-size: initial; background-origin: initial; background-clip: initial; background-position: initial; background-repeat: initial;">
<code class="lang-sh" style="box-sizing: border-box; color: inherit; border-radius: 0px; padding: 0px; font-size: inherit; font-family: monospace, monospace; background-color: transparent;">$mainUserId(int): normal user id(<span class="hljs-number" style="box-sizing: border-box; color: rgb(42, 161, 152);">1</span>, <span class="hljs-number" style="box-sizing: border-box; color: rgb(42, 161, 152);">2</span>, <span class="hljs-number" style="box-sizing: border-box; color: rgb(42, 161, 152);">3.</span><span class="hljs-keyword" style="box-sizing: border-box; color: rgb(133, 153, 0);">...</span>)
</code></pre>

<p style="box-sizing: border-box; padding-top: 0.66001rem; -webkit-font-feature-settings: 'kern' 1, 'onum' 1, 'liga' 1; margin-top: 0px; margin-bottom: 1.33999rem; color: rgb(55, 61, 73); font-family: Georgia, Cambria, serif; font-size: 14px; line-height: 28px;">
    Return kandy user object or null
</p>

<p style="box-sizing: border-box; padding-top: 0.66001rem; -webkit-font-feature-settings: 'kern' 1, 'onum' 1, 'liga' 1; margin-top: 0px; margin-bottom: 1.33999rem; color: rgb(55, 61, 73); font-family: Georgia, Cambria, serif; font-size: 14px; line-height: 28px;">
    <span style="box-sizing: border-box; font-weight: 700;">6 Get kandy user by kandy user id(kandyUserId)</span>
</p>

	<pre style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1.33999rem; word-break: break-all; border: 1px solid rgb(211, 218, 234); border-radius: 4px; overflow: auto; font-family: monospace, monospace; font-size: 14px; padding: 0.66001rem 9.5px 9.5px; line-height: 28px; background-image: linear-gradient(rgb(255, 255, 255) 0px, rgb(255, 255, 255) 0.75rem, rgb(245, 247, 250) 0.75rem, rgb(245, 247, 250) 2.75rem, rgb(255, 255, 255) 2.75rem, rgb(255, 255, 255) 4rem); background-attachment: initial; background-size: initial; background-origin: initial; background-clip: initial; background-position: initial; background-repeat: initial;">
<code class="lang-sh" style="box-sizing: border-box; color: inherit; border-radius: 0px; padding: 0px; font-size: inherit; font-family: monospace, monospace; background-color: transparent;"><span class="hljs-function" style="box-sizing: border-box;"><span class="hljs-title" style="box-sizing: border-box; color: rgb(38, 139, 210);">Kandy_getUserByUserId</span><span class="hljs-params" style="box-sizing: border-box;">(<span class="hljs-variable" style="box-sizing: border-box; color: rgb(181, 137, 0);">$kandyUserId</span>)</span></span>
</code></pre>

<p style="box-sizing: border-box; padding-top: 0.66001rem; -webkit-font-feature-settings: 'kern' 1, 'onum' 1, 'liga' 1; margin-top: 0px; margin-bottom: 1.33999rem; color: rgb(55, 61, 73); font-family: Georgia, Cambria, serif; font-size: 14px; line-height: 28px;">
    Parameters:
</p>

	<pre style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1.33999rem; word-break: break-all; border: 1px solid rgb(211, 218, 234); border-radius: 4px; overflow: auto; font-family: monospace, monospace; font-size: 14px; padding: 0.66001rem 9.5px 9.5px; line-height: 28px; background-image: linear-gradient(rgb(255, 255, 255) 0px, rgb(255, 255, 255) 0.75rem, rgb(245, 247, 250) 0.75rem, rgb(245, 247, 250) 2.75rem, rgb(255, 255, 255) 2.75rem, rgb(255, 255, 255) 4rem); background-attachment: initial; background-size: initial; background-origin: initial; background-clip: initial; background-position: initial; background-repeat: initial;">
<code class="lang-sh" style="box-sizing: border-box; color: inherit; border-radius: 0px; padding: 0px; font-size: inherit; font-family: monospace, monospace; background-color: transparent;"><span class="hljs-variable" style="box-sizing: border-box; color: rgb(181, 137, 0);">$kandyUserId</span>(int): kandy user id without <span class="hljs-function" style="box-sizing: border-box;"><span class="hljs-title" style="box-sizing: border-box; color: rgb(38, 139, 210);">domain</span><span class="hljs-params" style="box-sizing: border-box;">(user1, user2....)</span></span>
</code></pre>

<p style="box-sizing: border-box; padding-top: 0.66001rem; -webkit-font-feature-settings: 'kern' 1, 'onum' 1, 'liga' 1; margin-top: 0px; margin-bottom: 1.33999rem; color: rgb(55, 61, 73); font-family: Georgia, Cambria, serif; font-size: 14px; line-height: 28px;">
    Return kandy user object or null
</p>

<p style="box-sizing: border-box; padding-top: 0.66001rem; -webkit-font-feature-settings: 'kern' 1, 'onum' 1, 'liga' 1; margin-top: 0px; margin-bottom: 1.33999rem; color: rgb(55, 61, 73); font-family: Georgia, Cambria, serif; font-size: 14px; line-height: 28px;">
    <span style="box-sizing: border-box; font-weight: 700;">7. Assign a normal user to kandy user</span>
</p>

	<pre style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1.33999rem; word-break: break-all; border: 1px solid rgb(211, 218, 234); border-radius: 4px; overflow: auto; font-family: monospace, monospace; font-size: 14px; padding: 0.66001rem 9.5px 9.5px; line-height: 28px; background-image: linear-gradient(rgb(255, 255, 255) 0px, rgb(255, 255, 255) 0.75rem, rgb(245, 247, 250) 0.75rem, rgb(245, 247, 250) 2.75rem, rgb(255, 255, 255) 2.75rem, rgb(255, 255, 255) 4rem); background-attachment: initial; background-size: initial; background-origin: initial; background-clip: initial; background-position: initial; background-repeat: initial;">
<code class="lang-sh" style="box-sizing: border-box; color: inherit; border-radius: 0px; padding: 0px; font-size: inherit; font-family: monospace, monospace; background-color: transparent;"><span class="hljs-function" style="box-sizing: border-box;"><span class="hljs-title" style="box-sizing: border-box; color: rgb(38, 139, 210);">Kandy_assignUser</span><span class="hljs-params" style="box-sizing: border-box;">(<span class="hljs-variable" style="box-sizing: border-box; color: rgb(181, 137, 0);">$kandyUserId</span>, <span class="hljs-variable" style="box-sizing: border-box; color: rgb(181, 137, 0);">$mainUserId</span>)</span></span>
</code></pre>

<p style="box-sizing: border-box; padding-top: 0.66001rem; -webkit-font-feature-settings: 'kern' 1, 'onum' 1, 'liga' 1; margin-top: 0px; margin-bottom: 1.33999rem; color: rgb(55, 61, 73); font-family: Georgia, Cambria, serif; font-size: 14px; line-height: 28px;">
    Parameters:
</p>

	<pre style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1.33999rem; word-break: break-all; border: 1px solid rgb(211, 218, 234); border-radius: 4px; overflow: auto; font-family: monospace, monospace; font-size: 14px; padding: 0.66001rem 9.5px 9.5px; line-height: 28px; background-image: linear-gradient(rgb(255, 255, 255) 0px, rgb(255, 255, 255) 0.75rem, rgb(245, 247, 250) 0.75rem, rgb(245, 247, 250) 2.75rem, rgb(255, 255, 255) 2.75rem, rgb(255, 255, 255) 4rem); background-attachment: initial; background-size: initial; background-origin: initial; background-clip: initial; background-position: initial; background-repeat: initial;">
<code class="lang-sh" style="box-sizing: border-box; color: inherit; border-radius: 0px; padding: 0px; font-size: inherit; font-family: monospace, monospace; background-color: transparent;">$kandyUserId(string) : kandy user id without domain(user1, user2....)
    $mainuserId(int): normal user id(<span class="hljs-number" style="box-sizing: border-box; color: rgb(42, 161, 152);">1</span>, <span class="hljs-number" style="box-sizing: border-box; color: rgb(42, 161, 152);">2</span>, <span class="hljs-number" style="box-sizing: border-box; color: rgb(42, 161, 152);">3.</span><span class="hljs-keyword" style="box-sizing: border-box; color: rgb(133, 153, 0);">...</span>)
</code></pre>

<p style="box-sizing: border-box; padding-top: 0.66001rem; -webkit-font-feature-settings: 'kern' 1, 'onum' 1, 'liga' 1; margin-top: 0px; margin-bottom: 1.33999rem; color: rgb(55, 61, 73); font-family: Georgia, Cambria, serif; font-size: 14px; line-height: 28px;">
    Return: true/false
</p>

<p style="box-sizing: border-box; padding-top: 0.66001rem; -webkit-font-feature-settings: 'kern' 1, 'onum' 1, 'liga' 1; margin-top: 0px; margin-bottom: 1.33999rem; color: rgb(55, 61, 73); font-family: Georgia, Cambria, serif; font-size: 14px; line-height: 28px;">
    <span style="box-sizing: border-box; font-weight: 700;">8. Unassign a kandy user</span>
</p>

	<pre style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1.33999rem; word-break: break-all; border: 1px solid rgb(211, 218, 234); border-radius: 4px; overflow: auto; font-family: monospace, monospace; font-size: 14px; padding: 0.66001rem 9.5px 9.5px; line-height: 28px; background-image: linear-gradient(rgb(255, 255, 255) 0px, rgb(255, 255, 255) 0.75rem, rgb(245, 247, 250) 0.75rem, rgb(245, 247, 250) 2.75rem, rgb(255, 255, 255) 2.75rem, rgb(255, 255, 255) 4rem); background-attachment: initial; background-size: initial; background-origin: initial; background-clip: initial; background-position: initial; background-repeat: initial;">
<code class="lang-sh" style="box-sizing: border-box; color: inherit; border-radius: 0px; padding: 0px; font-size: inherit; font-family: monospace, monospace; background-color: transparent;"><span class="hljs-function" style="box-sizing: border-box;"><span class="hljs-title" style="box-sizing: border-box; color: rgb(38, 139, 210);">Kandy_unassignUser</span><span class="hljs-params" style="box-sizing: border-box;">(<span class="hljs-variable" style="box-sizing: border-box; color: rgb(181, 137, 0);">$mainUserId</span>)</span></span>
</code></pre>

<p style="box-sizing: border-box; padding-top: 0.66001rem; -webkit-font-feature-settings: 'kern' 1, 'onum' 1, 'liga' 1; margin-top: 0px; margin-bottom: 1.33999rem; color: rgb(55, 61, 73); font-family: Georgia, Cambria, serif; font-size: 14px; line-height: 28px;">
    Parameters:
</p>

	<pre style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1.33999rem; word-break: break-all; border: 1px solid rgb(211, 218, 234); border-radius: 4px; overflow: auto; font-family: monospace, monospace; font-size: 14px; padding: 0.66001rem 9.5px 9.5px; line-height: 28px; background-image: linear-gradient(rgb(255, 255, 255) 0px, rgb(255, 255, 255) 0.75rem, rgb(245, 247, 250) 0.75rem, rgb(245, 247, 250) 2.75rem, rgb(255, 255, 255) 2.75rem, rgb(255, 255, 255) 4rem); background-attachment: initial; background-size: initial; background-origin: initial; background-clip: initial; background-position: initial; background-repeat: initial;">
<code class="lang-sh" style="box-sizing: border-box; color: inherit; border-radius: 0px; padding: 0px; font-size: inherit; font-family: monospace, monospace; background-color: transparent;">$mainuserId(int): normal user id(<span class="hljs-number" style="box-sizing: border-box; color: rgb(42, 161, 152);">1</span>, <span class="hljs-number" style="box-sizing: border-box; color: rgb(42, 161, 152);">2</span>, <span class="hljs-number" style="box-sizing: border-box; color: rgb(42, 161, 152);">3.</span><span class="hljs-keyword" style="box-sizing: border-box; color: rgb(133, 153, 0);">...</span>)
</code></pre>

<p style="box-sizing: border-box; padding-top: 0.66001rem; -webkit-font-feature-settings: 'kern' 1, 'onum' 1, 'liga' 1; margin-top: 0px; margin-bottom: 1.33999rem; color: rgb(55, 61, 73); font-family: Georgia, Cambria, serif; font-size: 14px; line-height: 28px;">
    Return: true/false
</p>

<p style="box-sizing: border-box; padding-top: 0.66001rem; -webkit-font-feature-settings: 'kern' 1, 'onum' 1, 'liga' 1; margin-top: 0px; margin-bottom: 1.33999rem; color: rgb(55, 61, 73); font-family: Georgia, Cambria, serif; font-size: 14px; line-height: 28px;">
    <span style="box-sizing: border-box; font-weight: 700;">9. Kandy User synchronization</span>
</p>

<p style="box-sizing: border-box; padding-top: 0.66001rem; -webkit-font-feature-settings: 'kern' 1, 'onum' 1, 'liga' 1; margin-top: 0px; margin-bottom: 1.33999rem; color: rgb(55, 61, 73); font-family: Georgia, Cambria, serif; font-size: 14px; line-height: 28px;">
    Synchronize kandy user from remote server to local
</p>

	<pre style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1.33999rem; word-break: break-all; border: 1px solid rgb(211, 218, 234); border-radius: 4px; overflow: auto; font-family: monospace, monospace; font-size: 14px; padding: 0.66001rem 9.5px 9.5px; line-height: 28px; background-image: linear-gradient(rgb(255, 255, 255) 0px, rgb(255, 255, 255) 0.75rem, rgb(245, 247, 250) 0.75rem, rgb(245, 247, 250) 2.75rem, rgb(255, 255, 255) 2.75rem, rgb(255, 255, 255) 4rem); background-attachment: initial; background-size: initial; background-origin: initial; background-clip: initial; background-position: initial; background-repeat: initial;">
<code class="lang-sh" style="box-sizing: border-box; color: inherit; border-radius: 0px; padding: 0px; font-size: inherit; font-family: monospace, monospace; background-color: transparent;"><span class="hljs-function" style="box-sizing: border-box;"><span class="hljs-title" style="box-sizing: border-box; color: rgb(38, 139, 210);">Kandy_syncUsers</span><span class="hljs-params" style="box-sizing: border-box;">()</span></span>
</code></pre>

<p style="box-sizing: border-box; padding-top: 0.66001rem; -webkit-font-feature-settings: 'kern' 1, 'onum' 1, 'liga' 1; margin-top: 0px; margin-bottom: 1.33999rem; color: rgb(55, 61, 73); font-family: Georgia, Cambria, serif; font-size: 14px; line-height: 28px;">
    Return: array
</p>

	<pre style="box-sizing: border-box; margin-top: 0px; margin-bottom: 1.33999rem; word-break: break-all; border: 1px solid rgb(211, 218, 234); border-radius: 4px; overflow: auto; font-family: monospace, monospace; font-size: 14px; padding: 0.66001rem 9.5px 9.5px; line-height: 28px; background-image: linear-gradient(rgb(255, 255, 255) 0px, rgb(255, 255, 255) 0.75rem, rgb(245, 247, 250) 0.75rem, rgb(245, 247, 250) 2.75rem, rgb(255, 255, 255) 2.75rem, rgb(255, 255, 255) 4rem); background-attachment: initial; background-size: initial; background-origin: initial; background-clip: initial; background-position: initial; background-repeat: initial;">
<code class="lang-sh" style="box-sizing: border-box; color: inherit; border-radius: 0px; padding: 0px; font-size: inherit; font-family: monospace, monospace; background-color: transparent;">$<span class="hljs-literal" style="box-sizing: border-box;">result</span> = <span class="hljs-type" style="box-sizing: border-box; color: rgb(181, 137, 0);">array</span>(
    &#39;success&#39; =&gt; <span class="hljs-literal" style="box-sizing: border-box;">true</span>,
    &#39;message&#39; =&gt; <span class="hljs-string" style="box-sizing: border-box; color: rgb(42, 161, 152);">&quot;Sync successfully&quot;</span>
    );
    <span class="hljs-type" style="box-sizing: border-box; color: rgb(181, 137, 0);">OR</span>
    $<span class="hljs-literal" style="box-sizing: border-box;">result</span> = <span class="hljs-type" style="box-sizing: border-box; color: rgb(181, 137, 0);">array</span>(
    &#39;success&#39; =&gt; <span class="hljs-literal" style="box-sizing: border-box;">false</span>,
    &#39;message&#39; =&gt; <span class="hljs-string" style="box-sizing: border-box; color: rgb(42, 161, 152);">&quot;Error Data&quot;</span>
    );</code></pre>
</div>
