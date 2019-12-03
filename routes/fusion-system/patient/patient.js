const express = require('express');
const router = express.Router();
const master = require('../../modules/master');
const con = require('../../modules/connection');


// ===================================GET REQUEST =================================//
router.get('/',function(req,res,next){
    res.send("Patient sample");
    res.end();   
});



//Edit Patient
router.get('/edit-patient',function(req,res,next){
    var patientno = req.query.patientno;
    
    var e_q = `SELECT * FROM patients WHERE patient_no = ?`;
    var e_val = [patientno];
    con.query(e_q,e_val,function(err,rs){
        if(err){
            console.log(err);
        }
        var pdata = rs[0];
        
        //Send data to Template 

    });

});


//Delete Patient
router.get('/delete-patient?',function(req,res,next){
    var patientno = req.query.patientno;

    var c_del = `DELETE FROM patients WHERE patient_no = ?`;
    var c_val = [patientno];

    con.query(c_del,c_val,function(err,rs){
        if(err){
            console.log(err);
        }
        //Patient Deleted, redirect to patient list


    });
});


// ===================================POST REQUEST =================================//


//Save new patient
router.post('/save-new-patient',function(req,res,next){

    res.send(req.body.firstname+" - "+req.body.lastname+" - "+req.body.middlename);
    res.end();

    // var patientno = master.randomValuesHex(12);
    // var mrno = req.body.mrno;
    // var firstname = req.body.firstname;
    // var lastname = req.body.lastname;
    // var middlename = req.body.middlename;
    // var dob = req.body.dob;
    // var phone = req.body.phone;
    // var cellno = req.body.cellno;
    // var gender = req.body.gender;
    // var ethnicity = req.body.ethnicity;
    // var denomination = req.body.denomination;
    // var ssn = req.body.ssn;


    
    

    // var c_mrno = `SELECT * FROM patients WHERE patient_mrno = ?`;
    // var c_val = [mrno];

    // con.query(c_mrno,c_val,function(err,rs){
    //     if(err){
    //         console.log(err);
    //     }
    //     //MRNO Exist
    //     if(rs.lenght != 0){

    //     }

    //     //Save new patient
    //     if(rs.lenght == 0){

    //     }
    // });

    

});










module.exports = router;