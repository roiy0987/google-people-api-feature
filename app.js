const express = require("express");
require("dotenv").config();
const fs = require("fs");
const homepageRoute = require("./routes/homepage");
const apiRoute = require("./routes/apipage");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(homepageRoute);
app.use(apiRoute);

app.listen(process.env.PORT);
