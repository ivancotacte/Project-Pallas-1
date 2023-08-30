module.exports = ({ api, event }) => {
  let input = event.body.toLowerCase();
  let data = input.split(" ");
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
                event.messageID
              );
              return;
            }
            if (stderr) {
              api.sendMessage(
                `Stderr:\n ${stderr}\n${stdout}`,
                event.threadID,
                event.messageID
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
          event.messageID
        );
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
};