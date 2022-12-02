const { google } = require("googleapis");

class oAuth2ClientDelete {
  constructor() {
    if (this.instance == undefined) {
      this.instance = new google.auth.OAuth2(
        process.env.clientId,
        process.env.clientSecret,
        process.env.redirectUrlDeleteContact
      );
    }
  }
  getInstance() {
    return this.instance;
  }
}

module.exports = new oAuth2ClientDelete();
