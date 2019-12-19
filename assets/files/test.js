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
      video: "https://pixie.jubi.ai/videoConversation/static/videos/intro.mp4",
      // video: "https://pixie.jubi.ai/videoParramato/static/ui/start.mp4",
      stage: "hello",
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
      video: "https://pixie.jubi.ai/videoConversation/static/videos/name.mp4",
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
      video: "https://pixie.jubi.ai/videoConversation/static/videos/gender.mp4",
      type: "button",
      stage: "what can you do",
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
      video: "https://pixie.jubi.ai/videoConversation/static/videos/age.mp4",
      type: "text",
      stage: "age",
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
      video: "https://pixie.jubi.ai/videoConversation/static/videos/city.mp4",
      type: "button",
      stage: "city",
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
      video: "https://pixie.jubi.ai/videoConversation/static/videos/mobile.mp4",
      type: "text",
      stage: "mobile",
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
      video: "https://pixie.jubi.ai/videoConversation/static/videos/end.mp4",
      type: "button",
      stage: "end",
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

function getStagebyStagename(stagename) {}
