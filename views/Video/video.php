<?php
/**
 * Default Value
 */
$kandyVideoWrapper = variable_get('kandy_video_wrapper_class', KANDY_VIDEO_WRAPPER_CLASS_DEFAULT);
$myKandyVideoTitle = variable_get('my_kandy_video_title', KANDY_VIDEO_MY_TITLE_DEFAULT);
$theirKandyVideoTitle = variable_get('their_kandy_video_title', KANDY_VIDEO_THEIR_TITLE_DEFAULT);
return '<div id="videos" class="' . $kandyVideoWrapper . '">
    <div class="kandyVideo myKandyVideoTitle">
        <p class="title myVideoTitle">' . $myKandyVideoTitle . '</p>
        <span class="video myVideo" id="myVideo"></span>
    </div>

    <div class="kandyVideo theirKandyVideoTitle">
        <p class="title theirVideoTitle">' . $theirKandyVideoTitle . '</p>
        <span class="video theirVideo" id="theirVideo"></span>
    </div>
</div>';
?>
