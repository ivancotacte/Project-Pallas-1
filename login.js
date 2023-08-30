const login = require("./fca-ivan");
const fs = require("fs");
const path = require("path");

const proxy = {
  protocol: "https",
  host: "103.69.108.78",
  port: 8191,
  type: "https",
  anonymityLevel: "elite",
  country: "PH",
  city: "Taguig",
  hostname: "103.69.108.78 (CITI Cableworld Inc.)",
};

const local = {
  timezone: "Asia/Manila",
  region: "ph",
  headers: {
    "X-Facebook-Locale": "en_US",
    "X-Facebook-Timezone": "Asia/Manila",
    "X-Fb-Connection-Quality": "EXCELLENT",
  },
};

async function Listen(cb) {
  try {
    const appStatePath = path.join(__dirname, "./appstate.json");
    const credentials = JSON.parse(fs.readFileSync(appStatePath, "utf8"));

    login(
      {
        appState: credentials,
        local: local,
        proxy: proxy,
      },
      async (err, api) => {
        if (err) {
          console.error("Login error for appstate:");
          return;
        }

        try {
          const cID = api.getCurrentUserID();
          const userInfo = (await api.getUserInfo(cID))[cID];
          console.log(`[ FCA-IVAN ] > Logged in as ${userInfo.name}`);

          api.setOptions({
            logLevel: "silent",
            forceLogin: true,
            listenEvents: true,
            autoMarkDelivery: false,
            selfListen: true,
            online: true, 
          });

          api.listenMqtt(async (err, event) => {
            if (err) {
              console.error(err);
              return;
            }
            cb(api, event);
          });
        } catch (err) {
          if (!!err.errorSummary) {
            console.log(err.errorSummary);
          } else {
            console.log(err);
          }
          console.log("Appstate Error >>>");
        }
      }
    );
  } catch (error) {
    console.error("Error processing appstate file:");
    console.error(error);
  }
}

module.exports = { Listen };
