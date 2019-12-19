$(document).ready(function() {
  $("#mic-icon").click(function(event) {
    event.preventDefault();
    // console.log("started");
    recognition.start();
    $("#mic-icon").hide();
    $("#mic-listening").show();
  });
  $("#mic-listening").click(function(event) {
    event.preventDefault();
    // console.log("stopped");
    recognition.stop();
    $("#mic-icon").show();
    $("#mic-listening").hide();
  });
});

window.SpeechRecognition =
  window.webkitSpeechRecognition || window.SpeechRecognition;
let recognition = new window.SpeechRecognition();
recognition.interimResults = true;
recognition.maxAlternatives = 3;
recognition.continuous = true;
recognition.onresult = event => {
  let interimTranscript = "";
  for (let i = event.resultIndex, len = event.results.length; i < len; i++) {
    let transcript = event.results[i][0].transcript;
    if (event.results[i].isFinal) {
      getNextStageData(transcript);
      console.log("speech -> ", transcript);
      recognition.stop();
      $("#mic-listening").hide();
      $("#mic-icon").show();
    } else {
      interimTranscript += transcript;
      // console.log("listening", interimTranscript);
    }
  }
};
