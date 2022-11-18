const express = require("express");

const router = express.Router();

const apiController = require("../controllers/apiController");

router.get("/testApi", apiController.useGoogleApi);

module.exports = router;
