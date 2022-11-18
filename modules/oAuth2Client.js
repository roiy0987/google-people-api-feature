const { google } = require("googleapis");

class oAuth2Client {
  constructor() {
    if (this.instance == undefined) {
      this.instance = new google.auth.OAuth2(
        process.env.clientId,
        process.env.clientSecret,
        process.env.redirectUrl
      );
    }
  }
  getInstance() {
    return this.instance;
  }
}

module.exports = new oAuth2Client();
