const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Leave = require('../models/leave'); //import leave model
const Employee = require('../models/employee') //import employee model

router.post('/', (req, res) => {
    //console.log(req.body);

    if (req.body.empid === undefined) return res.status(200).json({
        message: 'Employee ID is required'
    });
    if (req.body.startdate === undefined) return res.status(200).json({
        message: 'Leave start date is required'
    });
    if (req.body.enddate === undefined) return res.status(200).json({
        message: 'Leave end date is required'
    });
    if (req.body.resumptionDate === undefined) return res.status(200).json({
        message: 'Resumption date is required'
    });

    var empid = req.body.empid;
    var startdate = req.body.startdate;
    var enddate = req.body.enddate;
    var resumptionDate = req.body.resumptionDate;
    var dayinbtw;

    //Leave.find({empid: })
    var sdate = Date.parse(new Date(Date.parse(startdate) + 86400000));
    var edate = Date.parse(new Date(Date.parse(enddate) + 86400000));
    var days = Math.ceil((edate - sdate) / 86400000);
    // Subtract two weekend days for every week in between
    var weeks = Math.floor(days / 7);
    var days = days - (weeks * 2);
    // Handle special cases
    var startDay = new Date(startdate).getDay();
    var endDay = new Date(enddate).getDay();
    // Remove weekend not previously removed.   
    if (startDay - endDay > 1) {days = days - 2;}
    // Remove start day if span starts on Sunday but ends before Saturday
    if (startDay == 0 && endDay != 6){days = days - 1;}
    // Remove end day if span ends on Saturday but starts after Sunday
    if (endDay == 6 && startDay != 0){days = days - 1;}
    dayinbtw = parseInt(days) + 1;

    Employee.find({empid: empid}).exec()
    .then((data) => {
        if(data[0] == undefined){
            return res.status(200).json({
                message: 'Not Eligible',
                reason: 'Employee does not exist'
            });
        }else{
            Leave.find({empid: empid}).exec()
            .then((data) => {
                let odays = 0;
                if(data[0] !== undefined){
                    data.forEach(function (item) {
                        odays = parseInt(odays) + item.days;
                    });
                    if(odays >= 20){
                        return res.status(200).json({
                            message: 'Not Eligible',
                            reason: 'You have exceeded your total number of leave days within a year'
                        });
                    }
                    if((parseInt(dayinbtw) + parseInt(odays)) >= 20){
                        return res.status(200).json({
                            message: 'Not Eligible',
                            reason: 'You will be exceeding your total number of leave days with the end date provided. Please try and choose a closer end date'
                        });
                    }

                    const leave = new Leave({
                        _id: new mongoose.Types.ObjectId(),
                        empid: empid,
                        startdate: startdate,
                        enddate: enddate,
                        days: dayinbtw,
                        resumptionDate: resumptionDate
                    });
                    leave.save().then((result) => {
                        console.log(result);
                        res.status(201).json({
                            message: 'Eligible',
                            reason: 'You are eligible to take a leave'
                        });
                    }).catch((err) => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
                }else{
                    const leave = new Leave({
                        _id: new mongoose.Types.ObjectId(),
                        empid: empid,
                        startdate: startdate,
                        enddate: enddate,
                        days: dayinbtw,
                        resumptionDate: resumptionDate
                    });
                    leave.save().then((result) => {
                        console.log(result);
                        res.status(201).json({
                            message: 'Eligible',
                            reason: 'You are eligible to take a leave'
                        });
                    }).catch((err) => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
                }
                //res.status(200).json(data);
            }).catch((err) => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
        }
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;