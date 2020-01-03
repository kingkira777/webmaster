const express = require('express');
const router = express.Router();
const master = require('../../modules/master');
const con = require('../../modules/connection');



router.get('/(:patientno)',[master.patient_info],function(req,res,next){
    res.send(patienfo);
    res.end();
});














module.exports = router;