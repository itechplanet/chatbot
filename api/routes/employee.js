const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Employee  = require('../models/employee'); //import employee model

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Please provide employee id'
    });
});

router.get('/:empId', (req, res, next) => {
    const empId = req.params.empId;
    Employee.find({empid: empId}).exec()
    .then((data) => {
        res.status(200).json(data);
    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', (req, res, next) => {
    //console.log(req.body);

    if (req.body.empid === undefined) return res.status(200).json({
        message: 'Employee ID is required'
    });
    if (req.body.firstname === undefined) return res.status(200).json({
        message: 'First name is required'
    });
    if (req.body.lastname === undefined) return res.status(200).json({
        message: 'Last name is required'
    });
    if (req.body.gender === undefined) return res.status(200).json({
        message: 'Gender is required'
    });
    if (req.body.resumptionDate === undefined) return res.status(200).json({
        message: 'Resumption date required'
    });

    const employee = new Employee({
        _id: new mongoose.Types.ObjectId(),
        empid: req.body.empid,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        gender: req.body.gender,
        resumptionDate: req.body.resumptionDate
    });

    employee.save().then((result) => {
        console.log(result);
        res.status(201).json({
            message: 'Employee added'
        });
    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;