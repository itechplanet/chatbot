const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const employeeRoutes = require('./api/routes/employee');
const leaveRoutes = require('./api/routes/leave');

//Body parsing for reading post values
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//
mongoose.connect('mongodb://localhost:27017/csbot',{
    useNewUrlParser: true
});

//Handles CORS errors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'POST, GET');
        return res.status(200).json({});
    }
    next();
});

//Handle Routes
app.use('/employee', employeeRoutes);
app.use('/leave', leaveRoutes);

//-- Handle Errors start here
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});
//-- Handle Errors ends here

module.exports = app;