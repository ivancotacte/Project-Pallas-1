module.exports = ({ api, event }) => {
      let input = event.body.toLowerCase();
  if (event.type == "message_reply" || event.type == "message") {
    if (input.startsWith("bard")) {
    require("../commands/bard")({ api, event });
    }
  }

};