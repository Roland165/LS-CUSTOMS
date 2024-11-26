// Populate object process.env from the .env file
require('dotenv').config();

// Create express.js web app
const express = require('express');
const app = express();
const path = require('path');

app.set("view engine", "ejs");
app.set("views", "views");

// *** MIDDLEWARES ***
// Process form input
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Allow server-side session storage
const session = require("express-session");
app.use(session({
    secret: "SecretRandomStringDskghadslkghdlkghdghaksdghdksh",
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day in msec
    resave: false
}));

// Enable CORS
const cors = require('cors');
app.use(cors());

// Serve static files
app.use("/static", express.static(__dirname + '/static'));
// Add this line to serve files from medias directory
app.use("/medias", express.static(path.join(__dirname, '..', 'medias')));

// *** ROUTES/CONTROLLERS ***
app.get('/', (request, response) => {
    let clientIp = request.ip;
    response.send(`Hello, dear ${clientIp}. I am a nodejs website...`);
    response.end();
});

app.use("/carsapi", require("./controllers/carsapi.route"));

app.listen(process.env.WEB_PORT, '0.0.0.0',
    function () { console.log("Listening on " + process.env.WEB_PORT); }
);