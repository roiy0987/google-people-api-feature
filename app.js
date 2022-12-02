const express = require("express");

require("dotenv").config();

const app = express();

app.set("view engine", "ejs");
const apiRoute = require("./routes/apipage");
const homepageRoute = require("./routes/homepage");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(homepageRoute);
app.use(apiRoute);

app.listen(process.env.PORT);
