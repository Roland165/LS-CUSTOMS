// Populate object process.env from the .env file
require('dotenv').config();
const path = require('path');

// Create express.js web app
const express = require('express');
const app = express();

// *** MIDDLEWARES ***
// Enable CORS first
const cors = require('cors');
//app.use(cors()); // changed to comment for PASSPORT
app.use(cors({ origin: "http://localhost:8081", credentials: true, methods: ['GET', 'POST'] })); // PASSPORT

// Process form input
const bodyParser = require("body-parser");
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Allow server-side session storage
const session = require("express-session");
app.use(session({
    secret: "SecretRandomStringDskghadslkghdlkghdghaksdghdksh",
    saveUninitialized: true,
    //cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day in msec // changed to comment for PASSPORT
    cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: false, secure: false }, // PASSPORT
    resave: false
}));

// configure passport
const auth = require("./utils/users.auth"); // PASSPORT
auth.initializeAuthentications(app); // PASSPORT
app.use("/auth", require("./controllers/auth.route")); // PASSPORT

// Logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Serve static files
app.use("/static", express.static(__dirname + '/static'));
app.use("/medias", express.static(path.join(__dirname, '..', 'medias')));


const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});
// View engine setup
app.set("view engine", "ejs");
app.set("views", "views");

// *** ROUTES/CONTROLLERS ***
// Import routes
const carsApiRoutes = require("./controllers/carsapi.route");
const brandsApiRoutes = require("./controllers/brandsapi.route");
const featuresApiRoutes = require("./controllers/featuresapi.route");
const storeApiRouter = require('./controllers/storeapi.route');

// Use routes
app.use("/carsapi", carsApiRoutes);
app.use("/brandsapi", brandsApiRoutes);
app.use("/featuresapi", featuresApiRoutes);
app.use('/storeapi', storeApiRouter);

// Basic root route
app.get('/', (request, response) => {
    let clientIp = request.ip;
    response.send(`Hello, dear ${clientIp}. I am a nodejs website...`);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something broke!'
    });
});


// 404 handler - must be last
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});


// Start server
const port = process.env.WEB_PORT || 9000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
});