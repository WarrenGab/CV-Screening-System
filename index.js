const express = require('express');
const cors = require('cors');
const methodOverride = require('method-override');

const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Setup the CORS
app.use(cors());
app.options("*", cors());
// const corsOptions = {
//     origin: '*',
//     credentials: true,
//     optionSuccessStatus: 200
// }

// app.use(cors(corsOptions));

// app.use(function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', "*");
//     res.header('Access-Control-Allow-Headers', true);
//     res.header('Access-Control-Allow-Credentials', true);
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     next();
// });

// Initialize Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride('_method'));
global.__basedir = __dirname;

// API Routes
app.use('/api/user', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/company', require('./routes/api/company'));
app.use('/api/department', require('./routes/api/department'));
app.use('/api/position', require('./routes/api/position'));
app.use('/api/candidate', require('./routes/api/candidate'));

// Start the Server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log("Server has started on PORT", String(PORT));
});