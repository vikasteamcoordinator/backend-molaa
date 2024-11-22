const express = require('express');
const cors = require('cors'); 
const app = express();
const bodyParser = require('body-parser');

// Load config from env file
require("dotenv").config();
const PORT = process.env.PORT || 4000;

// Enable CORS only for local frontend
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL (local URL)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // If you're using cookies with CORS
}));

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Import routes
const admin = require("./router/admin/admin.route.js");
const user = require("./router/web/user.route.js");

// Mount todo API routes with correct path
app.use("/api/admin", admin);
app.use("/api/user", user);

// DB connection
const dbconnect = require('./config/database.js');

// Start the server
app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`);
    dbconnect();
});

// Default route
app.get('/', (req, res) => {
    res.send("Default Route");
});
