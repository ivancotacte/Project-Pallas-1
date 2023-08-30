const { Listen } = require("./login");
const fs = require("fs");


Listen(async (api, event) => {
  let userInfo = await api.getUserInfo(event.senderID);
  userInfo = userInfo[event.senderID];

  if (event.type == "message_reply" || event.type == "message") {
    require("./handlers/adminHandler")({ api, event });
    require("./handlers/commandHandler")({ api, event });
  } else if (event.type == "event") {
    require("./handlers/eventHandler")({ api, event });
  }
});
