const express = require('express');
const router = express.Router();
const con = require('../modules/connection');
const master = require('../modules/master');


//==================GET REQUEST=============================//

// Home Page
router.get('/',function(req,res,next){
    if(!req.session.clientno){
        res.redirect('/');
        res.end();
    }else{
        res.render('fusion-system/index',{
            title: 'Hospice Fusion', 
            isHome : 'active',
            email : req.session.email
        });
        res.end();
    }
});

//Patient Page
router.get('/patients',function(req,res,next){
    if(!req.session.clientno){
        res.redirect('/');
        res.end();
    }else{
        var gp = `SELECT * FROM patients 
            WHERE client_no = ? ORDER BY patient_id DESC`;
        var gpVal = [req.session.clientno];
        con.query(gp,gpVal,function(err,rs){
            if(err)
                res.json({
                    message : err,
                });
            res.render('fusion-system/patients',{ 
                title : 'Patients', 
                isPatients : 'active',
                email : req.session.email,
                patients : rs
            });
            res.end(); 
        });
    }
});


//Reports---------------------------------------
router.get('/reports',function(req,res,next){
    if(!req.session.clientno){
        res.redirect('/');
        res.end();
    }else{
        res.render('fusion-system/reports',{ 
            title: 'Reports', 
            isReports : 'active',
            email : req.session.email
        });
        res.end();
    }
}); 


//Human Resources
router.get('/human-resources',function(req,res,next){
    if(!req.session.clientno){
        res.redirect('/');
        res.end();
    }else{
        res.render('fusion-system/human-resources', { 
            title : 'Human Resources', 
            isHr : 'active',
            email : req.session.email
        });
        res.end();
    }
});

//Calendar
 router.get('/calendar',function(req,res,next){
    if(!req.session.clientno){
        res.redirect('/');
        res.end();
    }else{
        res.render('fusion-system/calendar',{ 
            title : 'Calendar', 
            isCalendar : 'active',
            email : req.session.email
        });
        res.end();
    }
 });




//=============================ADD PRIMARY REQUEST===================================//
router.get('/add-new-patient?',function(req,res,next){
    if(!req.session.clientno){
        res.redirect('/');
        res.end();
    }else{
        res.render('fusion-system/patient/add-new-patient',{
            title : 'Add New Patient', 
            isPatients : 'active',
            email : req.session.email,
            isPatient : false,
            isExist : (req.query.exist)? true : false
        });
        res.end();
    }
});




//Logou from Hospicefusion=======================
router.get('/logout',function(req,res,next){
    if(req.session.destroy()){
        res.redirect('/');
        res.end();
    }
});



module.exports = router;