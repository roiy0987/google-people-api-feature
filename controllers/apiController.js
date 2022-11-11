const { google } = require("googleapis");
const { people } = require("googleapis/build/src/apis/people");
require("dotenv").config({ path: __dirname + "./.env" });

const getOAuthClient = () => {
  return new google.auth.OAuth2(
    process.env.clientId,
    process.env.clientSecret,
    process.env.redirectUrl
  );
};

exports.useGoogleApi = async (req, res, next) => {
  const code = req.query.code;
  const oauth2Client = await getOAuthClient();
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  const service = google.people({ version: "v1", auth: oauth2Client });
  // Creating multiple contacts
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
          },
        },
      ],
    },
  });
  const contactsList = await service.people.connections.list({
    resourceName: "people/me",
    personFields: "names,emailAddresses",
  });
  const names = contactsList.data.connections.map((person) => {
    return person.resourceName;
  });
  const addingContactsToGroup = await service.contactGroups.members.modify({
    resourceName: "contactGroups/797ededb0fa2424f",
    requestBody: {
      resourceNamesToAdd: names,
    },
  });
  res.redirect("/");
};
