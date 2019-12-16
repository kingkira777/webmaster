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

            res.locals.patientinfo = x;

            res.render('fusion-system/nursing-assessment/nursing-assessment-list',{ 
                title : 'Patient Demographic',
                isPatient : true,
                patientinfo : x
            });
            res.end();
        });
    }
});


//Add New Assessment
router.get('/add-update-nursingassessment/(:patientno)',function(req,res,next){
    if(!req.session.clientno){
        res.redirect('/');
        res.end();
    }else{
        
    }
});


















module.exports = router;