const oauth2Client = require("../modules/oAuth2Client");

const scopes = [
  "https://www.googleapis.com/auth/contacts",
  "https://www.googleapis.com/auth/userinfo.profile",
];

exports.getHomepage = async (req, res, next) => {
  // Creating a consent page
  const authorizationUrl = await oauth2Client.getInstance().generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    state: JSON.stringify({
      callbackUrl: req.body.callbackUrl,
      userID: req.body.userid,
    }),
  });
  res.send(`<h1>Hello</h1><a href="${authorizationUrl}">Click me</a>`);
};
