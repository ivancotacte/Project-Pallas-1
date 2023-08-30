const path = require("path");
const fs = require("fs");
const axios = require("axios");
const https = require("https");

const config = require("../config");
const { banned } = config;

module.exports = ({ api, event }) => {
  try {
    if (event.logMessageType == "log:subscribe") {
      const addedParticipants = event.logMessageData.addedParticipants;
      addedParticipants.forEach(async (participant) => {
        const joinMemberID = participant.userFbId;
        const joinMemberInfo = await api.getUserInfo(joinMemberID);
        const joinMemberfullName = joinMemberInfo[joinMemberID].name;
        const welcome = [`Wassup,`, `Welcome,`, "Supp,", "Wazzup,"];
        const randomIndex = Math.floor(Math.random() * welcome.length);
        const welcomeMessage = welcome[randomIndex];
        var imageUrl = `https://api-test.tapikej101.repl.co/api/fbimage/${joinMemberID}`;
        var imagePath = path.join(__dirname, `/../cache/${joinMemberID}.jpg`);
        const imageStream = fs.createWriteStream(imagePath);
        https.get(imageUrl, (response) => {
          response.pipe(imageStream);
          imageStream.on("finish", () => {
            api.sendMessage(
              {
                body: `${welcomeMessage} @${joinMemberfullName}`,
                attachment: fs.createReadStream(imagePath),
              },
              event.threadID,
            );
          });
        });
      });
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
