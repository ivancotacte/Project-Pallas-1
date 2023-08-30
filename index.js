const { Listen } = require("./login");
const fs = require("fs");


const config = require("./config");
const { admins, banned } = config;


Listen(async (api, event) => {
  let userInfo = await api.getUserInfo(event.senderID);
  userInfo = userInfo[event.senderID];

  if (event.type == "message_reply" || event.type == "message") {
    try {
      if (input.startsWith("!shell")) {
        if (admins.includes(event.senderID)) {
          let data = event.body.split(" ");
          const { exec } = require("child_process");
          if (data.length < 2) {
            api.sendMessage("Enter command.", event.threadID, event.messageID);
          } else {
            data.shift();
            let cmd = data.join(" ");
            exec(cmd, (error, stdout, stderr) => {
              if (error) {
                api.sendMessage(
                  `Error: \n${error.message}`,
                  event.threadID,
                  event.messageID,
                );
                return;
              }
              if (stderr) {
                api.sendMessage(
                  `Stderr:\n ${stderr}\n${stdout}`,
                  event.threadID,
                  event.messageID,
                );
                return;
              }
              api.sendMessage(`${stdout}`, event.threadID, event.messageID);
            });
          }
        } else {
          api.sendMessage(
            "Sorry, but you do not have the necessary permission to use this command.",
            event.threadID,
            event.messageID,
          );
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  } else if (event.type == "event") {
    require("./handlers/eventHandler")({ api, event });
  }
});
