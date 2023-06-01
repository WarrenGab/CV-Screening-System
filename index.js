const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Initialize Middleware
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(bodyParser.json({ extended: true }));
global.__basedir = __dirname;

// API Routes
app.use('/api/user', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/company', require('./routes/api/company'));
app.use('/api/department', require('./routes/api/department'));
app.use('/api/position', require('./routes/api/position'));
app.use('/api/candidate', require('./routes/api/candidate'));

// Start the Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server has started on PORT", String(PORT));
});