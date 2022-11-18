const { google } = require("googleapis");
const { people } = require("googleapis/build/src/apis/people");
const oauth2 = require("../modules/oAuth2Client");

exports.useGoogleApi = async (req, res, next) => {
  const code = req.query.code;
  const contacts = req.body.contacts;
  const oauth2Client = oauth2.getInstance();
  // Exchanging the "code" for a access/refresh token
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  const service = google.people({
    version: "v1",
    auth: oauth2Client,
  });
  const contactsList = await service.people.connections.list({
    resourceName: "people/me",
    personFields: "names,emailAddresses",
  });
  // Creating multiple contacts

  for (const contact in contacts) {
    const searchIfExist = service.people.searchContacts({
      query: contact.firstName,
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
    await service.people.updateContact({
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
      etag: contact.etag,
    });
  }
  const batchOfContacts = await service.people.batchCreateContacts({
    requestBody: {
      contacts: [
        {
          contactPerson: {
            names: [
              {
                givenName: "Hema",
                displayName: "Boy",
                familyName: "Hello",
              },
            ],
            phoneNumbers: [
              {
                value: "0543178632",
              },
            ],
            memberships: [
              {
                contactGroupMembership: {
                  contactGroupResourceName: process.env.GROUPNAME,
                },
              },
            ],
          },
        },
        {
          contactPerson: {
            names: [
              {
                givenName: "Roie",
                displayName: "Roie",
                familyName: "yechi",
              },
            ],
            phoneNumbers: [
              {
                value: "0543178634",
              },
            ],
            memberships: [
              {
                contactGroupMembership: {
                  contactGroupResourceName: process.env.GROUPNAME,
                },
              },
            ],
          },
        },
      ],
    },
  });
  res.redirect("/");
};
