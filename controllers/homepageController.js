const { google } = require("googleapis");
const request = require("request");
require("dotenv").config({ path: __dirname + "./.env" });

const getOAuthClient = () => {
  return new google.auth.OAuth2(
    process.env.clientId,
    process.env.clientSecret,
    process.env.redirectUrl
  );
};

exports.getHomepage = async (req, res, next) => {
  const oauth2Client = await getOAuthClient();
  const scopes = [
    "https://www.googleapis.com/auth/contacts",
    "https://www.googleapis.com/auth/userinfo.profile",
  ];
  const url = await oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    state: JSON.stringify({
      callbackUrl: req.body.callbackUrl,
      userID: req.body.userid,
    }),
  });

  request(url, (err, response, body) => {
    console.log("error :", err);
    console.log("statusCode: ", response && response.statusCode);
    res.send(`<h1>Hello</h1><a href="${url}">Click me</a>`);
  });
};
