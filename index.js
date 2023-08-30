const { Listen } = require("./login");
const config = require("./config");
const fs = require("fs");

Listen(async (api, event) => {
  let userInfo = await api.getUserInfo(event.senderID);
  userInfo = userInfo[event.senderID];

  if (event.type == "message_reply" || event.type == "message") {
  } else if (event.type == "event") {
    require("./handlers/eventHandler")({ api, event, config, userInfo });
  }
});
