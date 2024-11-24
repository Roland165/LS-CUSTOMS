// Populate object process.env from the .env file
require('dotenv').config();

// Create express.js web app
const express = require('express');
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.listen(process.env.WEB_PORT, '0.0.0.0',
    function () { console.log("Listening on " + process.env.WEB_PORT); }
);

// *** MIDDLEWARES ***
// Process form input (create request.body from POST data or JSON in the HTTP request)
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

// Enable Cross-Origin Resource Sharing (needed for cross-origin API)
const cors = require('cors');
app.use(cors());

// *** ROUTES/CONTROLLERS ***

// Setup default route
app.get('/', (request, response) => {
    let clientIp = request.ip;
    response.send(`Hello, dear ${clientIp}. I am a nodejs website...`);
    response.end(); // optional
});

// Setup additional routes
app.use("/static", express.static(__dirname + '/static'));
app.use("/carsapi", require("./controllers/carsapi.route"));
// app.use("/auth", require("./controllers/auth.route"));