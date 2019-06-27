const mongoose = require('mongoose');

const leaveSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    empid: String,
    startdate: String,
    enddate: String,
    days: String,
    resumptionDate: String
});

module.exports = mongoose.model('Leave', leaveSchema);