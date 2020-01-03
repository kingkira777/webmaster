const express = require('express');
const router = express.Router();
const master = require('../../modules/master');
const con = require('../../modules/connection');


var assessment_list = [];

// ===========FUNCTIONS THAT EXECUTE EVERY REQUEST=========================//

//GET ASSESSMENT LIST
function get_assessment_list(req,res,next){
    var s = "SELECT * FROM nursing_assessment WHERE client_no = ?";
    var sval = [req.session.clientno];
    con.query(s,sval,(err,rs)=>{
        assessment_list = rs;
    });
    console.log(assessment_list); 
    next();
}


// ================================GET REQUEST======================================//

//Nursing Assessment List
router.get('/(:patientno)',[get_assessment_list],function(req,res,next){
    if(!req.session.clientno){
        res.redirect('/');
        res.end();
    }else{
        master.patient_profile_info(req.params.patientno, req.session.clientno).then((x)=>{
            console.log(assessment_list);
            res.render('fusion-system/nursing-assessment/nursing-assessment-list',{ 
                title : 'Nursing Assessment List',
                email : req.session.email,
                isPatient : true,
                patientinfo : x,
                assessmentList : assessment_list
            });
            res.end();
        });
    }
});


//Add New Assessment
router.get('/(:patientno)/add-update-nursingassessment?',function(req,res,next){
    if(!req.session.clientno){
        res.redirect('/');
        res.end();
    }else{
        master.patient_profile_info(req.params.patientno, req.session.clientno).then((x)=>{
            res.render('fusion-system/nursing-assessment/add-update-nursing-assessment',{
                title : 'Add Update Nursing Assessment',
                email : req.session.email,
                isPatient: true, 
                patientinfo : x,
                assessmentno : (req.query.assessmentno)? req.query.assessmentno : master.randomValuesHex(8) 
            });
            res.end();
        });
    }
});





















//===============================POST REQUEST===============================//



router.post('/(:patientno)/save-update-nursing-assessment?',function(req,res,next){



    if(!req.session.clientno){
        res.redirect('/');
        res.end();
    }

    // Foriegn Key DUDE!
    var clientno = req.session.clientno;
    var patientno = req.params.patientno;
    var assessmentno = req.query.assessmentno;
    formData = JSON.stringify(req.body);


    check_nursing_assessments(assessmentno).then((x)=>{
        if(x){
            // UPDATE            
            var  u = `UPDATE nursing_assessment SET n_entered = ?, n_staff = ?, n_discipline = ?,
            n_typeof = ?, n_vtype = ?, n_specify = ?, n_reasonforassessment = ?, n_visitdate = ?,
            n_timein = ?, n_timeout = ?, n_duration = ?, n_formdata = ?, n_user = ? 
            WHERE client_no = ? AND patient_no = ? AND n_no = ?`;
            var uval = [req.body.enteredby, 
                req.body.staff, req.body.discipline, req.body.type, 
                req.body.visit, req.body.specify, req.body.reasonforas, 
                req.body.visitdate, req.body.timein, req.body.timeout, 
                req.body.duration, formData, "",clientno, patientno, assessmentno]
            
            con.query(u,uval,(err,rs)=>{
                if(err) throw err;
                res.send('Updated');
                res.end();
            });

        }else{
            //SAVE
            
            var s = `INSERT INTO nursing_assessment(client_no, patient_no, n_no, n_entered,
                n_staff, n_discipline, n_typeof,  n_vtype, n_specify, n_reasonforassessment, 
                n_visitdate, n_timein, n_timeout, n_duration, n_formdata, n_user)
                VALUES ?`;
            var sval = [
                [clientno, patientno, assessmentno, req.body.enteredby, 
                req.body.staff, req.body.discipline, req.body.type, 
                req.body.visit, req.body.specify, req.body.reasonforas, 
                req.body.visitdate, req.body.timein, req.body.timeout, 
                req.body.duration, formData, ""]
            ];

            con.query(s,[sval],(err,rs)=>{
                if(err) throw err;
                res.send('Saved');
                res.end();
            });

        }
    });


});









//Check Assessment if Exist
function check_nursing_assessments(_no){
    var c = `SELECT * FROM nursing_assessment WHERE n_no = ?`;
    var cval = [_no];
    return new Promise((resolve) => {
        con.query(c,cval,function(err,rs){
            if(err) throw err;
            var x = (rs.length > 0)? true : false;
            resolve(x);
        });
    });
}







module.exports = router;