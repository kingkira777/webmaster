const express = require('express');
const router = express.Router();
const master = require('../../modules/master');
const con = require('../../modules/connection');



router.get('/(:patientno)',function(req,res,next){
    if(!req.session.clientno){
        res.redirect('/');
        res.end();
    }else{
        var pinfo = `SELECT * FROM  patients a
            LEFT JOIN images b on a.patient_no = b.img_no
            WHERE a.client_no = ? AND a.patient_no = ?`;
        var pinfoVal = [req.session.clientno, req.params.patientno];

        con.query(pinfo,pinfoVal,function(err,rs){
            res.render('fusion-system/nursing-assessment/nursing-assessment-list',{ 
                title : 'Patient Demographic',
                isPatient : true,
                patientinfo : rs
            });
            res.end();
        });
    }
});














module.exports = router;