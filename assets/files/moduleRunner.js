var bm25 = require("../../node_modules/wink-bm25-text-search");
// Create search engine's instance
var engine = bm25();
// Load NLP utilities
var nlp = require("wink-nlp-utils");

var pipe = [
  nlp.string.lowerCase,
  nlp.string.tokenize0,
  nlp.tokens.removeWords,
  nlp.tokens.stem,
  nlp.tokens.propagateNegations
];
var query = "";
var docsMain = {
  intentDocs: [
    {
      title: "name",
      body: [
        "what is your name",
        "tell me your name",
        "may i have your name",
        "How may I address you",
        "How is one to call you",
        "Could I ask your name",
        "What name shall I say",
        "hi your name please",
        "i forgot to ask your name",
        "who are you",
        "what should i call you",
        "what do i call you",
        "name"
      ]
    },
    {
      title: "made",
      body: [
        "who made you",
        "who created you",
        "who is your creator",
        "by whom have you been created",
        "by whom were you created",
        "who built you",
        "who invented you",
        "who formed you",
        "who manufactured you",
        "who is your inventor"
      ]
    },
    {
      title: "interest",
      body: [
        "simple interest",
        "what is simple interest",
        "can you tell me about simple interest",
        "give me a idea about simple interest",
        "say something about simple interest",
        "can you help me to understand simple interest",
        "what is interest",
        "tell me about interest",
        "what are interests",
        "what is interest"
      ]
    },
    {
      title: "mutual_fund",
      body: [
        "what is mutual fund",
        "tell me about mutual fund",
        "can you tell me about mutual fund",
        "say something about mutual fund",
        "help me understand mutual fund",
        "mutual fund"
      ]
    },
    {
      title: "help",
      body: [
        "what can you do",
        "What are you capable of",
        "how can you help me",
        "Could you help me out",
        "Could you give me a hand",
        "help me"
      ]
    },
    {
      title: "credit_score",
      body: [
        "What is a cibil Score",
        "can you tell me about cibil score",
        "give me a idea about cibil score",
        "say something about cibil score",
        "can you help me to understand cibil score",
        "what is credit score",
        "tell me about credit score",
        "help me with credit score",
        "credit score",
        "cibil score"
      ]
    },
    {
      title: "contact",
      body: [
        "for more queries whom should i contact",
        "for more question whom should i contact",
        "for more concern whom should i contact",
        "for more doubt whom should i contact",
        "for any problem whom should i contact",
        "for any uncertainty whom should i contact"
      ]
    },
    {
      title: "emi",
      body: [
        "what is emi",
        "can you help me to understand emi",
        "please explain emi",
        "say something about emi",
        "give me a idea about emi",
        "can you tell me about emi",
        "tell me about emi",
        "emi"
      ]
    },
    {
      title: "how_are_you",
      body: [
        "how are you",
        "are you doing well",
        "how are things",
        "are you well",
        "you all right",
        "how are you feeling",
        "how do you do",
        "how was your day"
      ]
    },
    {
      title: "what_are_you_doing",
      body: [
        "WHAT ARE YOU DOING",
        "ARE YOU DOING ANYTHING",
        "WHAT ARE YOU DOING",
        "WHAT IS GOING ON IN HERE",
        "WHAT ARE YOU UP TO",
        "What do you do"
      ]
    }
  ]
};
var docs = restructuredDocs(docsMain);

function restructuredDocs(docsMain) {
  data = [];
  for (d of docsMain["intentDocs"]) {
    console.log(d);
    for (b of d.body) {
      dx = {};
      dx["title"] = d.title;
      dx["body"] = b;
      data.push(dx);
    }
  }
  console.log(data);
  return data;
}
//==========================================================================================================================
engine.defineConfig({ fldWeights: { title: 1, body: 2 } });
// Step II: Define PrepTasks pipe.
// Set up 'default' preparatory tasks i.e. for everything else
engine.definePrepTasks(pipe);

// Step III: Add Docs
// Add documents now...
temp = 0;
console.log(docs);
for (doc of docs) {
  engine.addDoc(doc, temp);
  temp++;
}
// docs.forEach(function(doc, i) {
//   // Note, 'i' becomes the unique id for 'doc'
//   engine.addDoc(doc, i);
// });

// Step IV: Consolidate
// Consolidate before searching
engine.consolidate();
//====================================================================================================
function NLP(query) {
  //check direct match
  myBoolean = true;
  for (doc of docs) {
    if (doc["body"].toLowerCase() == query.toLowerCase()) {
      console.log("getNextStageData : ", doc["title"]);
      getNextStageData(doc["title"]);
      myBoolean = false;
      break;
    }
  }
  // skyfall
  if (myBoolean) {
    NLPbm25(query);
  }
}
function NLPbm25(query) {
  console.log("query NLP ->", query);
  var result = engine.search(query);
  console.log("result -> ", result);
  console.log("result length -> ", result.length);

  if (result.length > 0) {
    console.log("result title -> ", docs[result[0][0]].title);
    console.log("result body -> ", docs[result[0][0]].body);
    sum = 0;
    result_length = result.length >= 4 ? 4 : result.length;
    for (score of result.slice(0, result_length)) {
      sum = sum + score[1];
    }
    for (let i = 0; i < result_length; i++) {
      result[i][1] = result[i][1] / sum;
    }
    if (
      result[0][1] > (1.0 / result_length) * 1.02 > 1
        ? 1
        : (0.9 / result_length) * 1.02
    ) {
      console.log("getNextStageData : ", docs[result[0][0]].title);
      getNextStageData(docs[result[0][0]].title);
    } else {
      console.log("confidence fallback");
      getNextStageData("fallback");
    }
  } else {
    console.log("result > 0 : fallback");
    getNextStageData("fallback");
  }
}

var flow = {
  _id: {
    $oid: "5db16a857a18e0fd769d0c06"
  },
  flowId: "getstarted",
  projectId: "VideoPOC_191901911101",
  id: "VideoPOC_191901911101-getstarted",
  stages: [
    {
      text: ["intro"],
      video:
        "https://pixie.jubi.ai/videoConversationTrue/static/videos/intro.mp4",
      // video: "https://pixie.jubi.ai/videoParramato/static/ui/start.mp4",
      stage: "intro",
      type: "button",
      next: {
        data: [
          {
            data: "Count me in!",
            text: "Count me in!"
          }
        ],
        expectation: {
          invalidMessage: "",
          validMessage: "",
          val: {
            countmein: ""
          },
          type: "wordList"
        }
      }
    },
    {
      text: ["name"],
      video:
        "https://pixie.jubi.ai/videoConversationTrue/static/videos/name.mp4",
      type: "text",
      stage: "name",
      next: {
        expectation: {
          invalidMessage: "",
          validMessage: "",
          val: "[a-zA-Z\\s]+",
          type: "regex"
        }
      }
    },
    {
      text: ["gender"],
      video:
        "https://pixie.jubi.ai/videoConversationTrue/static/videos/made.mp4",
      type: "button",
      stage: "made",
      next: {
        expectation: {
          invalidMessage: "",
          validMessage: "",
          val: {
            mr: "",
            mrs: ""
          },
          type: "wordList"
        },
        data: [
          {
            data: "Mr",
            text: "Mr"
          },
          {
            data: "Miss/Mrs",
            text: "Miss/Mrs"
          }
        ]
      }
    },
    {
      text: ["age"],
      video:
        "https://pixie.jubi.ai/videoConversationTrue/static/videos/interest.mp4",
      type: "text",
      stage: "interest",
      next: {
        expectation: {
          invalidMessage: "",
          validMessage: "",
          val: "\\d+",
          type: "regex"
        }
      }
    },
    {
      text: ["city"],
      video:
        "https://pixie.jubi.ai/videoConversationTrue/static/videos/help.mp4",
      type: "button",
      stage: "help",
      next: {
        data: [
          {
            data: "Mumbai",
            text: "Mumbai"
          },
          {
            data: "Kolkata",
            text: "Kolkata"
          },
          {
            data: "Delhi",
            text: "Delhi"
          },
          {
            data: "Chennai",
            text: "Chennai"
          }
        ],
        expectation: {
          invalidMessage: "",
          validMessage: "",
          val: {
            mumbai: "",
            kolkata: "",
            chennai: "",
            delhi: ""
          },
          type: "wordList"
        }
      }
    },
    {
      text: ["mobile"],
      video:
        "https://pixie.jubi.ai/videoConversationTrue/static/videos/emi.mp4",
      type: "text",
      stage: "emi",
      next: {
        expectation: {
          invalidMessage: "",
          validMessage: "",
          val: "\\d{10}",
          type: "regex"
        }
      }
    },
    {
      text: ["end"],
      video:
        "https://pixie.jubi.ai/videoConversationTrue/static/videos/doing.mp4",
      type: "button",
      stage: "doing",
      next: {
        data: [
          {
            type: "url",
            data: "https://www.policybazaar.com/",
            text: "Compare now!"
          }
        ]
      }
    },
    {
      text: ["end"],
      video:
        "https://pixie.jubi.ai/videoConversationTrue/static/videos/carousel.mp4",
      type: "button",
      stage: "carousel",
      next: {
        data: [
          {
            type: "url",
            data: "https://www.policybazaar.com/",
            text: "Compare now!"
          }
        ]
      }
    },
    {
      text: ["end"],
      video:
        "https://pixie.jubi.ai/videoConversationTrue/static/videos/credit_score.mp4",
      type: "button",
      stage: "credit_score",
      next: {
        data: [
          {
            type: "url",
            data: "https://www.policybazaar.com/",
            text: "Compare now!"
          }
        ]
      }
    },
    {
      text: ["end"],
      video:
        "https://pixie.jubi.ai/videoConversationTrue/static/videos/how_are_you.mp4",
      type: "button",
      stage: "how_are_you",
      next: {
        data: [
          {
            type: "url",
            data: "https://www.policybazaar.com/",
            text: "Compare now!"
          }
        ]
      }
    },
    {
      text: ["end"],
      video:
        "https://pixie.jubi.ai/videoConversationTrue/static/videos/mutual_fund.mp4",
      type: "button",
      stage: "mutual_fund",
      next: {
        data: [
          {
            type: "url",
            data: "https://www.policybazaar.com/",
            text: "Compare now!"
          }
        ]
      }
    },
    {
      text: ["end"],
      video:
        "https://pixie.jubi.ai/videoConversationTrue/static/videos/what_are_you_doing.mp4",
      type: "button",
      stage: "what_are_you_doing",
      next: {
        data: [
          {
            type: "url",
            data: "https://www.policybazaar.com/",
            text: "Compare now!"
          }
        ]
      }
    },
    {
      text: ["end"],
      video:
        "https://pixie.jubi.ai/videoConversationTrue/static/videos/fallback.mp4",
      type: "button",
      stage: "fallback",
      next: {
        data: [
          {
            type: "url",
            data: "https://www.policybazaar.com/",
            text: "Compare now!"
          }
        ]
      }
    }
  ]
};

var theme = {
  default: ""
  // dark: "https://pixie.jubi.ai/videoConversation/static/css/styledark.css",
  // light: "https://pixie.jubi.ai/videoConversation/static/css/stylexls.css"
};

var currentStageNum = -1; // Stores current stage number
var flowJSON = {}; // Stores flow key(stage name) - value(stage data) pair
var currentData = {}; // Stores current stage data
var display = ""; // HTML DOM elements to be displayed
var status = 0; // Tracks if button is displayed or not
var fullscreen = 0; // Tracks if the view is fullscreen or not
var firstClick = 0; // First video click of the user

//======================================================================================
restructureData();

$(document).ready(() => {
  let testExp = new RegExp("Android|" + "BlackBerry|" + "IEMobile|Mobile", "i");
  if (testExp.test(navigator.userAgent)) {
    documentReady();
    getNextStageData();
    setInterval(() => {
      // console.log("setInterval...");
      var videoDuration = document
        .getElementById("myVideo")
        .duration.toFixed(2);
      var videoTime = document.getElementById("myVideo").currentTime.toFixed(2);
      // console.log(videoTime);
      if (status == 0)
        if (videoTime >= videoDuration * 0.15) {
          status = 1;
          // console.log("1secs left...");
          createUI(currentData);
        }
      if (videoTime == videoDuration) blurBackground();
    }, 100);
  } else {
    console.log("Desktop user");
    document.getElementsByClassName(
      "display"
    )[0].innerHTML = `<h3>This page only works for <b>Android</b> mobile users</h3>`;
    document.getElementsByClassName("display")[0].style.color = "white";
  }

  $("#overlay").on("click", event => {
    $("#overlay").hide();
    if (firstClick == 0) {
      FS();
      myVideo.play();
      // myVideo.muted = false;
      firstClick = 1;
    }
  });
  $("#myVideo").on("click", event => {
    FS();
    playPause();
  });

  // console.log("ready");
  let classes = document.getElementsByClassName("button");
  for (let element of classes) {
    // console.log(element);
    element.style.width = buttonData.length * 12 + "px";
  }

  $("body").on("click", ".button", event => {
    let button = event.currentTarget;
    // console.log(event);
    let type = button.firstElementChild.getAttribute("type");
    if (type != "url") {
      // console.log("data ==> ", data);
      // console.log(event);
      button.classList.toggle("active");
      button.addEventListener("animationend", event => {
        if (event.animationName == "Button") {
          // console.log(event);
          button.classList.remove("active");
          button.classList.add("remove");
          getNextStageData();
          // console.log("nextStageCalled.....");
        }
      });
      getSiblings(button).forEach(el => {
        el.style.opacity = "0.2";
        el.classList.toggle("inactive");
        el.addEventListener("animationend", () => {
          el.classList.remove("inactive");
          el.classList.add("remove");
        });
      });
    } else {
      window.open(button.firstElementChild.getAttribute("value"));
    }
  });
  //===================================================

  $("#mic-icon").click(function(event) {
    event.preventDefault();
    // console.log("started");
    myVideo.pause();
    blurBackground();
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
  //===================================================
});

//===================================================

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
      NLP(transcript);
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

//===================================================
var getSiblings = function(elem) {
  // Setup siblings array and get the first sibling
  var siblings = [];
  var sibling = elem.parentNode.firstChild;

  // Loop through each sibling and push to the array
  while (sibling) {
    if (sibling.nodeType === 1 && sibling !== elem) {
      siblings.push(sibling);
    }
    sibling = sibling.nextSibling;
  }

  return siblings;
};

function exitHandler(document) {
  if (
    !document.fullscreenElement &&
    !document.webkitIsFullScreen &&
    !document.mozFullScreen &&
    !document.msFullscreenElement
  ) {
    fullscreen = 0;
    // document.getElementById("fs").innerHTML = "FULLSCREEN";
    // $(".display")
    //   .width(640)
    //   .height(360);
  }
}

function documentReady() {
  $(".display").append(`
      <div class="mic-div" id="mic-icon">
        <img class="mic-icon" src="https://pixie.jubi.ai/videoConversationTrue/static/icons/mic-icon.png" alt="mic-icon" />
      </div>
      <div class="anim-div" id="mic-listening">
        <img class="mic-anim" src="https://pixie.jubi.ai/videoConversationTrue/static/icons/mic-icon.png" alt="mic-icon" />
      </div>
      <div class="overlay" id="overlay">
        <img src="https://pixie.jubi.ai/videoConversationTrue/static/icons/thumbnail.jpg" alt="">
      </div>
      <video id="myVideo"  playsinline>
      </video>
      <div class="box">
      </div>
      <div class="logo">
      <span>Powered by </span>
      <a href="https://www.jubi.ai" target="_blank">jubi.ai</a></div>
    `);
}

function restructureData() {
  for (i = 0; i < flow.stages.length; i++) {
    //   var key = flow.stages[i].stage;
    //   var value = flow.stages[i];
    //   data[key] = value;
    flowJSON[flow.stages[i].stage] = flow.stages[i];
  }
}

function removeBlurBackground() {
  document.getElementById("myVideo").style.filter = "blur(0px)";
}

function blurBackground() {
  document.getElementById("myVideo").style.filter = "blur(1px)";
}

function playPause() {
  // FS();
  // console.log("play called fullscreen...");
  if (myVideo.paused) {
    removeBlurBackground();
    myVideo.play();
    // document.getElementById("playpause").innerHTML = "PAUSE";
  } else {
    myVideo.pause();
    blurBackground();
    // document.getElementById("playpause").innerHTML = "PLAY";
  }
}

function FS() {
  // console.log("fullscreen called...FS");
  if (fullscreen == 0) {
    if (document.body.requestFullscreen) document.body.requestFullscreen();
    else if (document.body.mozRequestFullScreen)
      document.body.mozrequestFullscreen();
    else if (document.body.webkitRequestFullscreen)
      document.body.webkitRequestFullscreen();
    else if (document.body.msRequestFullscreen)
      document.body.msRequestFullscreen();

    // console.log("fullscreen = ", fullscreen);
    // document.getElementById("fs").innerHTML = "EXIT FULLSCREEN";
    $(".display")
      .width("100%")
      .height("100%");
  }
}

function getNextStageData(nextStage) {
  console.log("Next Stage ... ", nextStage);
  clearChat();
  removeBlurBackground();
  // $("#playImg").hide();
  status = 0;
  currentData = {}; // Stores current stage data
  display = ""; // HTML DOM elements to be displayed
  if (nextStage == undefined) {
    currentStageNum += 1;
    // console.log("currentStageNum : ", currentStageNum);
    currentData = flow.stages[currentStageNum];
    // console.log(JSON.stringify(currentData, 0, 3));
    // if (base64loaded == "not yet") {
    // console.log("Video Data from URL...");
    videoDisplay(currentData.video);
    // } else {
    //   console.log("Video Data from base64...");
    //   videoDisplay("data:video/mp4;base64," + videoData[currentData.stage]);
    // }
    // createUI(currentData);
  } else {
    currentStageNum = Object.keys(flowJSON).indexOf(nextStage);
    // console.log("currentStageNum : ", currentStageNum);
    currentData = flowJSON[nextStage];
    // console.log(JSON.stringify(currentData, 0, 3));
    // if (base64loaded == "not yet") {
    // console.log("Video Data from URL...");
    videoDisplay(currentData.video);
    // } else {
    //   console.log("Video Data from base64...");
    //   videoDisplay("data:video/mp4;base64," + videoData[currentData.stage]);
    // }
    // createUI(currentData);
  }
}

function videoDisplay(videoData) {
  // console.log("videoDisplay...");
  // console.log(videoData);
  $("#myVideo").empty();
  $("#myVideo").append(
    "<source id='start' type='video/mp4' src='" + videoData + "' />"
  );
  // console.log("<source id='start' type='video/mp4' src='" + videoData + "' />");
  // $("#myVideo").attr("poster", "");
  var video = document.getElementById("myVideo");
  // console.log(video);
  video.load();
  if (currentStageNum != 0) {
    video.play();
  }
}

function createUI(currentData) {
  // console.log("createUI...");
  // console.log(currentData);
  switch (currentData.type) {
    case "text":
      // console.log("text");
      if (
        currentData.next &&
        currentData.next.expectation &&
        currentData.next.expectation.type == "regex"
      ) {
        display = display + createText(currentData.next.expectation.val);
      } else {
        display = display + createText();
      }
      // validateButton();
      break;
    case "button":
    case "quickReply":
      // console.log("button / QuickReply");
      display = `
<div class="button-list">`;
      for (i in currentData.next.data) {
        if (!currentData.next.data[i].type) {
          display =
            display +
            createButton(
              currentData.next.data[i].data,
              currentData.next.data[i].text
            );
        } else if (currentData.next.data[i].type === "url") {
          display =
            display +
            createButtonURL(
              currentData.next.data[i].data,
              currentData.next.data[i].text
            );
        } else if (currentData.next.data[i].type === "webView") {
          display =
            display +
            createButtonWebView(
              currentData.next.data[i].data,
              currentData.next.data[i].text
            );
        }
      }
      display = display + `</div>`;
      // console.log(display);
      break;
    case "generic":
      // console.log("generic");
      display = `<div class="carousel-wrap">
      <div class="owl-carousel">`;
      display = display + createGeneric(currentData.next.data);
      display = display + `</div></div>`;
      // console.log("display......==>");
      // console.log(display);
      break;
    default:
      // console.log("Not a type");
      break;
  }

  // if (currentStageNum == flow.stages.length - 1) replayFlow();
  displayChat(display);
}

function displayChat(view) {
  // console.log("displayChat...");
  $(".box").append(view);
  setTimeout(() => {
    let classes = document.getElementsByClassName("button");
    for (let element of classes) {
      // console.log(element.firstElementChild.innerHTML.length * 18);
      element.style.width =
        element.firstElementChild.innerHTML.length * 18 + "px";
    }

    // $("body").on("click", ".text-send", event => {
    $(".text-send").click(event => {
      // console.log(event);
      let btn = event.currentTarget;
      btn.style.display = "none";
      btn.parentElement.classList.toggle("active");
      btn.parentElement.style.padding = "0px";
      btn.parentElement.addEventListener("animationend", () => {
        btn.parentElement.classList.remove("active");
        btn.parentElement.classList.add("remove");
        getNextStageData();
      });
    });
    // $(".text-send-idle").click(event => {
    //   let el = event.currentTarget;
    //   el.lastElementChild.style.display = "block";
    //   el.firstElementChild.style.display = "none";
    //   el.style.float = "right";
    //   el.style["margin-right"] = "1%";
    //   el.classList.add("text-send-transition");
    //   el.addEventListener("animationend", () => {
    //     el.classList.remove("text-send-transition");
    //     el.classList.remove("text-send-idle");
    //     el.classList.add("text-send");
    //     el.style.width = "34px";
    //   });
    // });
  });
}

function clearChat() {
  // console.log("clearChat...");
  $(".box").empty();
}

function createButton(data, text) {
  // console.log("Create Button");
  // console.log("data", data);
  // console.log("text", text);
  return (
    ` <div class="button" >
    <span class="button-text" value='` +
    data +
    `'>` +
    text +
    `</span>
    <svg
      class="button-complete"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
    >
      <path
        d="M34.912 50.75l10.89 10.125L67 36.75"
        fill="none"
        stroke="#333"
        stroke-width="6"
      />
    </svg>
  </div>`
  );
}

function createButtonURL(data, text) {
  // console.log("Create Button URL");
  // console.log("data", data);
  // console.log("text", text);
  return (
    ` <div class="button" >
  <span class="button-text" type='url' value='` +
    data +
    `'>` +
    text +
    `</span>
  <svg
    class="button-complete"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
  >
    <path
      d="M34.912 50.75l10.89 10.125L67 36.75"
      fill="none"
      stroke="#333"
      stroke-width="6"
    />
  </svg>
</div>`
  );
}

function createButtonWebView(data, text) {
  // console.log("Create Button Web View");
  // console.log("data", data);
  // console.log("text", text);
  return (
    `<button class='response-button' onclick='$("iframe").show();$(this).hide();'>WebView</button><iframe class='response-webview' src='` +
    data +
    `' onclick='getNextStageData();' style='display:none;'>` +
    text +
    `</iframe>`
  );
  // return (
  //   `<iframe class='video' src='` +
  //   data +
  //   `' onclick='getNextStageData();' >` +
  //   text +
  //   `</iframe><script>showSkip();</script>`
  // );
}

function createText(pattern) {
  // console.log("Create Text");
  // console.log(pattern);
  if (pattern == undefined) {
    pattern = /.+/;
  } else {
    pattern = `/` + pattern + `/`;
  }
  // return (
  //   `<input id='name' class='response-text' type='text' onkeyup='validate(` +
  //   pattern +
  //   `);' placeholder='enter here ...' /> <button class='send' disabled onclick='getNextStageData();'>Send</button>`
  // );
  return (
    `<div class="text-field">
  <input type="text" placeholder='Type here ...' class="text-input" onkeyup="validate(` +
    pattern +
    `)">
  <button disabled type="submit" class="text-send">
    <span class="confirm-button">Send</span>
    <div class="loader"></div>
  </button>

  <svg class="text-complete" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <path d="M34.912 50.75l10.89 10.125L67 36.75" fill="none" stroke="#333" stroke-width="6"></path>
  </svg>
</div>`
  );
}

function createGeneric(data) {
  // console.log("Create Carousel");
  // console.log("data", data);
  var carousel = "";
  for (i in data) {
    // console.log("Carousel -> Next -> Data[]", i);
    var value =
      `<div class="item">
      <h3>` +
      data[i].title +
      `</h3><img src='` +
      data[i].image +
      `' /><h5>` +
      data[i].text +
      `</h5>` +
      carouselButtons(data[i].buttons) +
      `</div>`;
    carousel = carousel + value;
  }
  // console.log("carousel........=> ", carousel);
  return carousel;
}

function carouselButtons(buttons) {
  // console.log("Carousel Buttons");
  var genericButtons = "";
  for (i in buttons) {
    // console.log("Carousel -> Next -> Data[] -> Buttons[]" + i);
    genericButtons =
      genericButtons + createButton(buttons[i].data, buttons[i].text);
  }
  return genericButtons;
}

// function replayFlow() {
//   // console.log("replayFlow()");
//   currentStageNum = -1;
//   var replay = "replay";
//   display = display + createButton(replay, replay);
//   // console.log("replayFlow()");
//   currentStageNum = -1;
//   var replay = "replay";
//   display = display + createButton(replay, replay);
// }

function validate(pattern) {
  //var pattern = /^[a-zA-Z]+$/;
  // console.log("validate...");
  // console.log(pattern);
  var input = $(".text-input").val();
  // console.log("response-text.val() = ", input);
  if (input == "" || !input) {
    $(".text-input").css("border-bottom", "2px solid #F90A0A");
    $(".text-send").attr("disabled", true);
    $(".text-send").css("background-color: #333333c9");
    // showLoader();
  } else if (pattern.test(input) && input != "") {
    // console.log("correct input...");
    $(".text-send").attr("disabled", false);
    // hideLoader();
    $(".text-input").css("border-bottom", "2px solid #34F458");
    $(".text-send").css("background-color: #333");
  } else {
    // console.log("reject input...");
    $(".text-send").attr("disabled", true);
    $(".text-input").css("border-bottom", "2px solid #F90A0A");
    $(".text-send").css("background-color: #333333c9");
    // showLoader();
  }
}

function hideLoader() {
  $(".loader").attr("style", "display:none");
  $(".loader").attr("width", "22%");
  $(".confirm-button").attr("style", "display :block");
}

function showLoader() {
  $(".loader").attr("style", "display:block");
  $(".loader").attr("width", "34");
  $(".confirm-button").attr("style", "display :none");
}
