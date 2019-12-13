const express = require('express');
const router = express.Router();
const master = require('../../modules/master');
const con = require('../../modules/connection');


// ===================================GET REQUEST =================================//
router.get('/(:patientno)', function (req, res, next) {
    res.render('fusion-system/patient/patient-demographic',{ 
        title : 'Patient Demographic',
        isPatient : true
    });
    res.end();
});



//Edit Patient
router.get('/edit-patient', function (req, res, next) {
    var patientno = req.query.patientno;

    var e_q = `SELECT * FROM patients WHERE patient_no = ?`;
    var e_val = [patientno];
    con.query(e_q, e_val, function (err, rs) {
        if (err) {
            console.log(err);
        }
        var pdata = rs[0];

        //Send data to Template 

    });

});


//Delete Patient
router.get('/delete-patient?', function (req, res, next) {
    var patientno = req.query.patientno;

    var c_del = `DELETE FROM patients WHERE patient_no = ?`;
    var c_val = [patientno];

    con.query(c_del, c_val, function (err, rs) {
        if (err) {
            console.log(err);
        }
        //Patient Deleted, redirect to patient list


    });
});


// ===================================POST REQUEST =================================//


//Save new patient
router.post('/save-new-patient', function (req, res, next) {

    if(!req.session.clientno){
        res.redirect('/');
        res.end();
    }


    var clientno = req.session.clientno;
    var patientno = master.randomValuesHex(12);
    var mrno = req.body.mrno;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var middlename = req.body.middlename;
    var dob = req.body.dob;
    var phone = req.body.phone;
    var cellno = req.body.cellno;
    var gender = req.body.gender;
    var ethnicity = req.body.ethnicity;
    var denomination = req.body.denomination;
    var ssn = req.body.ssn;


    check_mrno_ifexsit(mrno).then((x) => {
        if (x) {
            res.redirect('/hfusion/add-new-patient?exist=true');
            res.end();
        } else {
            var s = `INSERT INTO patients(client_no, patient_no, patient_mrno, patient_firstname, 
                             patient_lastname, patient_middlename, patient_dob, patient_ssn, patient_phone, 
                             patient_cellno, patient_ethnicity, patient_gender, 
                            patient_denomination)
                             VALUES ?`;
            var sval = [
                [clientno, patientno, mrno, firstname, lastname, middlename, dob, ssn,
                    phone, cellno, ethnicity, gender, denomination]
            ];
            con.query(s, [sval], function (err, rs) {
                if (err) {
                    res.json({
                        message : err
                    });
                }
                res.redirect('/hfusion/patients');
                res.end();
            });
        }
    });

});





//FUNCTIONS=====================================++++++++++++++++++++++++++++++++++++++===================






// Check if patient mrno is Exist
function check_mrno_ifexsit(_mrno) {
    var c = `SELECT * FROM patients WHERE patient_mrno = ?`;
    var cval = [_mrno];
    return new Promise((resolve) => {
        con.query(c, cval, function (err, rs) {
            if (err)
                console.log(err);
            var exist = (rs.length != 0) ? true : false;
            resolve(exist);
        });
    });
};



module.exports = router;