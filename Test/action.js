var videoData =
  "https://pixie.jubi.ai/videoConversationTrue/static/videos/interest.mp4";
vid1 = true;
$(document).ready(() => {
  var video2 = document.getElementById("vid2");
  var source = document.createElement("source");
  var video1 = document.getElementById("vid1");
  video1.play();
  source.setAttribute(
    "src",
    "https://pixie.jubi.ai/videoConversationTrue/static/videos/help.mp4"
  );

  $("#button").click(() => {
    if (vid1 == true) {
      vid1 = false;
      $("#vid2").empty();
      video2.appendChild(source);
      video2.load();
      $("#vid2").show();
      setTimeout(() => {
        video1.pause();
        $("#vid1").hide();
        $("#vid1").empty();
        video1.load();
      }, 1);

      video2.play();
    } else {
      source.setAttribute(
        "src",
        "https://pixie.jubi.ai/videoConversationTrue/static/videos/interest.mp4"
      );
      vid1 = true;
      $("#vid1").empty();
      video1.appendChild(source);
      video1.load();
      $("#vid1").show();
      setTimeout(() => {
        video2.pause();
        $("#vid2").hide();
        $("#vid2").empty();
        video2.load();
      }, 1);

      video1.play();
    }
    //   ============================================================

    // if (
    //   videoData ==
    //   "https://pixie.jubi.ai/videoConversationTrue/static/videos/interest.mp4"
    // ) {
    //   videoData =
    //     "https://pixie.jubi.ai/videoConversationTrue/static/videos/help.mp4";
    // } else {
    //   videoData =
    //     "https://pixie.jubi.ai/videoConversationTrue/static/videos/interest.mp4";
    // }
    // $("#myVideo").empty();
    // $("#myVideo").append(
    //   "<source id='start' type='video/mp4' src='" + videoData + "' />"
    // );
    // var video = document.getElementById("myVideo");
    // console.log(video);
    // video.load();
    // video.play();
  });
});
