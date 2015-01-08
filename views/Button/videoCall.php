<div class="kandyButton">
    <div class="kandyVideoButton kandyVideoButtonSomeonesCalling" id="incomingCall">
        <label>Incoming Call...</label>
        <input class="btmAnswerVideoCall" type="button" value="Answer" onclick="kandy_answerVideoCall(this)"/>
    </div><!--end someonesCalling -->

    <div class="kandyVideoButton kandyVideoButtonCallOut" id="callOut">
        <label>User to call</label>
        <input id="callOutUserId" type="text" value=""/>
        <input class="btnCall" id="callBtn" type="button" value="Call" onclick="kandy_makeVideoCall(this)"/>
    </div>
    <!--end callOut -->

    <div class="kandyVideoButton kandyVideoButtonCalling" id="calling">
        <label>Calling...</label>
        <input type="button" class="btnEndCall" value="End Call" onclick="kandy_endCall(this)"/>
    </div>
    <!--end calling -->

    <div class="kandyVideoButton kandyVideoButtonOnCall" id="onCall">
        <label>You're connected!</label>
        <input class="btnEndCall" type="button" value="End Call" onclick="kandy_endCall(this)"/>
    </div>
<!-- end oncall -->
</div>