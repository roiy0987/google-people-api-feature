const oAuth2ClientCreate = require("../modules/oAuth2Client");
const oAuth2ClientDelete = require("../modules/oAuth2DeleteClient");

const scopes = [
  "https://www.googleapis.com/auth/contacts",
  "https://www.googleapis.com/auth/userinfo.profile",
];

exports.getHomepage = async (req, res, next) => {
  // Creating a consent page
  const authorizationUrlForCreate = await oAuth2ClientCreate
    .getInstance()
    .generateAuthUrl({
      access_type: "online",
      scope: scopes,
    });
  const authorizationUrlForDelete = await oAuth2ClientDelete
    .getInstance()
    .generateAuthUrl({
      access_type: "online",
      scope: scopes,
    });

  res.render("homepage", {
    test: authorizationUrlForCreate,
    test2: authorizationUrlForDelete,
    path: "/",
  });
};
