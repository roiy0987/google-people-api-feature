const express = require("express");
const app = express();
const cors = require("cors");
const homepageRoute = require("./routes/homepage");
const apiRoute = require("./routes/apipage");

require("dotenv").config();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(homepageRoute);
app.use(apiRoute);

app.listen(3000);
