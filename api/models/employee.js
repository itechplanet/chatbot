const mongoose = require('mongoose');

const employeeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    empid: String,
    firstname: String,
    lastname: String,
    gender: String,
    resumptionDate: String
});

module.exports = mongoose.model('Employee', employeeSchema);