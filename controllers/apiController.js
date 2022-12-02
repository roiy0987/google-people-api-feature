const { google } = require("googleapis");
const oAuth2ClientCreate = require("../modules/oAuth2Client");
const oAuth2ClientDelete = require("../modules/oAuth2DeleteClient");
const fs = require("fs");

async function getPeopleApi(code, oauth2Client) {
  const { tokens } = await oauth2Client.getToken(code);
  const refreshToken = fs.readFileSync("./tokens.json", (err) =>
    console.log(err)
  );
  const dataRefreshToken = JSON.parse(refreshToken);
  const allTokens = {
    refresh_token: dataRefreshToken.refresh_token,
    scope: tokens.scope,
    token_type: tokens.token_type,
    id_token: tokens.id_token,
    expiry_date: tokens.expiry_date,
  };
  oauth2Client.setCredentials(allTokens);
  return oauth2Client;
}

exports.deleteGoogleContacts = async (req, res, next) => {
  const code = req.query.code;
  const contacts = req.body.contacts;
  const oauth2Client = oAuth2ClientDelete.getInstance();
  const peopleOAuth = await getPeopleApi(code, oauth2Client);
  // Exchanging the "code" for a access/refresh token
  const service = google.people({
    version: "v1",
    auth: peopleOAuth,
  });
  for (const contact in contacts) {
    const searchIfExist = await service.people.searchContacts({
      query: contact.firstName,
      readMask: "names",
    });
    if (searchIfExist) {
      const resourceName = searchIfExist.data.results[0].person.resourceName;
      service.people.deleteContact({
        resourceName: resourceName,
      });
    }
  }
  res.redirect("/");
};

exports.useGoogleApi = async (req, res, next) => {
  const code = req.query.code;
  const contacts = req.body.contacts;
  const oauth2Client = oAuth2ClientCreate.getInstance();
  // Exchanging the "code" for a access/refresh token
  const peopleOAuth = await getPeopleApi(code, oauth2Client);
  const service = google.people({
    version: "v1",
    auth: peopleOAuth,
  });
  // Creating multiple contacts
  for (const contact in contacts) {
    const contactName = contact.givenName + contact.familyName;
    const searchIfExist = await service.people.searchContacts({
      query: contactName,
      readMask: "names",
    });
    if (!searchIfExist) {
      await service.people.createContact({
        names: [
          {
            givenName: contact.firstName,
            familyName: contact.familyName,
          },
        ],
        phoneNumbers: [
          {
            value: contact.value,
          },
        ],
        memberships: [
          {
            contactGroupMembership: {
              contactGroupResourceName: process.env.GROUPNAME,
            },
          },
        ],
      });
      continue;
    }
    const { resourceName, etag } = searchIfExist.data.results[0];
    await service.people.updateContact({
      resourceName: resourceName,
      names: [
        {
          givenName: contact.firstName,
          familyName: contact.familyName,
        },
      ],
      phoneNumbers: [
        {
          value: contact.value,
        },
      ],
      memberships: [
        {
          contactGroupMembership: {
            contactGroupResourceName: process.env.GROUPNAME,
          },
        },
      ],
      // etag is required for updating a contact?
      etag: etag,
    });
  }
  res.redirect("/");
};
