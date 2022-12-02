const express = require("express");

const router = express.Router();

const apiController = require("../controllers/apiController");

router.get("/createContactApi", apiController.useGoogleApi);
router.get("/deleteContactApi", apiController.deleteGoogleContacts);

module.exports = router;
