const express = require('express');
const router = express.Router();
const master = require('../../modules/master');
const con = require('../../modules/connection');
const fs = require('fs');
const xpath = require('path');


// ===================================GET REQUEST =================================//
router.get('/(:patientno)', function (req, res, next) {
    if(!req.session.clientno){
        res.redirect('/');
        res.end();
    }else{

        master.patient_profile_info(req.params.patientno, req.session.clientno).then((x)=>{
            
            res.render('fusion-system/patient/patient-demographic',{ 
                title : 'Patient Demographic',
                isPatient : true,
                patientinfo : x
            });
            res.end();
        });
    }
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


//Upload Patient Image
router.post('/upoad-patient-image/(:patientno)',function(req,res,next){
    if(!req.session.clientno){
        res.redirect('/');
        res.end();
    } 

    if(!req.files || Object.keys(req.files).length === 0){
        res.status(400).send('No Image File Were Uploaded');
    }

    var path = "files/"+req.session.clientno;
    if(!fs.existsSync(path)){
        fs.mkdirSync(path);
    }
    var path1 = "files/"+req.session.clientno+"/patient-images"
    if(!fs.existsSync(path1)){
        fs.mkdirSync(path1);
    }

    var file = req.files.file;

    var filename = req.files.file.name;

    var targetFile = path1+"/"+filename;
    var savePath = req.session.clientno+"/patient-images/"+filename;

    file.mv(targetFile,function(er){
        if(er) throw er;

        var c = `SELECT * FROM images WHERE img_no = ?`;
        var cVal = [req.params.patientno];
        con.query(c,cVal,function(x,xrs){
            if(x) throw x;
            if(xrs.length != 0){
                var u = `UPDATE images SET img_path = ? WHERE img_no = ?`;
                var uVal = [savePath, req.params.patientno];
                con.query(u,uVal,function(x1, xrs1){
                    if(x1) throw x1;
                    res.redirect('/patient/'+req.params.patientno);
                    res.end();
                });
            }
            if(xrs.length == 0){
                var s = `INSERT INTO images(img_no, img_path) VALUES ?`;
                var rs = [[req.params.patientno, savePath]];
                con.query(s,[rs],function(err,rs){
                    if(err) throw err;
                    res.redirect('/patient/'+req.params.patientno);
                    res.end();
                });
            }
        });
        
    });

});


//Update Patient Info
router.post('/update-patient-info/(:patientno)',function(req,res,next){
    if(!req.session.clientno){
        res.redirect('/');
        res.end();
    }else{

        var clientno = req.session.clientno;
        var patientno = req.params.patientno;
        var mrno = req.body.mrno;
        var ssn = req.body.ssn;
        var dob = req.body.dob;

        var lastname = req.body.lastname;
        var firstname = req.body.firstname;
        var middlename = req.body.middlename;

        var address = req.body.address;
        var city = req.body.city;
        var state = req.body.state;
        var zipcode = req.body.zipcode;

        var phone = req.body.phone;
        var cellno = req.body.cellno;
        var plang = req.body.plang;
        var race = req.body.race;
        var ethnicity = req.body.ethnicity;
        var maritalstatus = req.body.maritalstatus;
        var gender = req.body.gender;
        var religion = req.body.religion;
        var denomination = req.body.denomination;
        var specialins = req.body.specialins;

        var pupdate = `UPDATE patients SET patient_mrno = ?, patient_firstname=?, patient_lastname=?,
        patient_middlename= ?, patient_dob= ?, patient_ssn= ?,patient_phone= ?, patient_cellno= ?,
        patient_primlang= ?, patient_race= ?, patient_ethnicity= ?, patient_maritalstatus= ?,
        patient_gender = ?, patient_religion=?, patient_denomination= ?, patient_address= ?,
        patient_city= ?, patient_state= ?, patient_zipcode = ?, patient_instructions = ?
        WHERE client_no= ? AND patient_no = ?`;
        var updateVal = [mrno, firstname, lastname, middlename, dob, ssn, phone,
        cellno, plang, race, ethnicity, maritalstatus, gender, religion, 
        denomination, address, city, state, zipcode, specialins, clientno, patientno];

        con.query(pupdate,updateVal,function(err,rs){
            if(err){
                res.json({
                    message :err
                });
                res.end();
            }
            res.json({
                message: 'updated'
            });
            res.end();
        });

    }
});




//Save New Patient
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
            res.json({
                message : 'exist'
            });
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
                res.json({
                    message : 'saved' 
                });
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