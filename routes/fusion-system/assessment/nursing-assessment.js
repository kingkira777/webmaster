const express = require('express');
const router = express.Router();
const master = require('../../modules/master');
const con = require('../../modules/connection');




// ================================GET REQUEST======================================//

//Nursing Assessment List
router.get('/(:patientno)',function(req,res,next){
    if(!req.session.clientno){
        res.redirect('/');
        res.end();
    }else{
        master.patient_profile_info(req.params.patientno, req.session.clientno).then((x)=>{
            res.render('fusion-system/nursing-assessment/nursing-assessment-list',{ 
                title : 'Nursing Assessment List',
                email : req.session.email,
                isPatient : true,
                patientinfo : x
            });
            res.end();
        });
    }
});


//Add New Assessment
router.get('/(:patientno)/add-update-nursingassessment/',function(req,res,next){
    if(!req.session.clientno){
        res.redirect('/');
        res.end();
    }else{
        master.patient_profile_info(req.params.patientno, req.session.clientno).then((x)=>{
            res.render('fusion-system/nursing-assessment/add-update-nursing-assessment',{
                title : 'Add Update Nursing Assessment',
                email : req.session.email,
                isPatient: true, 
                patientinfo : x
            });
            res.end();
        });
    }
});


















module.exports = router;