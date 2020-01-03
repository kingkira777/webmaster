const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const uuidV4 = require('uuid/v4');
const con = require('./connection');


//GLOBAL FUNCTIONS===============
var master = {  


    //Patient =================================================

    patient_info : function(req,res,next){
        console.log("Clientno: "+ req.session.clientno+ " Patientno: "+ req.params.patientno);
        var patientinfo = [];
        var info = `SELECT * FROM patients a
            LEFT JOIN images b on a.patient_no = b.img_no
            WHERE a.patient_no = ? AND a.client_no = ?`;
        var infoVal = [req.params.patientno, req.session.clientno];
        con.query(info,infoVal,function(err,rs){
            if(err) throw err;
            patientinfo = rs 
        });
        next();
    },


    patient_profile_info : function(_patientno,_clientno){
        var info = `SELECT * FROM patients a
            LEFT JOIN images b on a.patient_no = b.img_no
            WHERE a.patient_no = ? AND a.client_no = ?`;
        var infoVal = [_patientno, _clientno];
        return new Promise((resolve)=>{
            con.query(info,infoVal,function(err,rs){
                if(err) throw err;
                resolve(rs);
            });
        });
    },
    //Patient =================================================





    //Send Email ==============================================
    send_email : function(){
        var transporter = nodemailer.createTransport({
            host : 'hospicefusion.com',
            secureConnection : true,
            port : '465',
            auth:{
                user: 'support@hospicefusion.com',
                pass: '*fusion777!'
            }
        });

        var mailOptions = {
            from : 'support@hospicefusion.com',
            to : 'hsouleater@gmail.com',
            subject: 'Sending Email using Node.js',
            text: 'That was easy!'
        }

        return new Promise((resolve,reject)=>{
            transporter.sendMail(mailOptions,function(err,info){
                if(err){
                    console.log(err);
                }
                resolve(info);
            });
        });
    },
    
    //Send Email ==============================================

    //Get the Current Date=====================================
    get_currentdate : function(){
        let ts = Date.now();
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();

        let xdate = year+ "-" +month+ "-"+date;
        return xdate;
    },

    // Return  value 'd5be8583137b'
    randomValuesHex : function(len){
        return crypto.randomBytes(Math.ceil(len)).toString('hex').slice(0,len);
    },

    //Unique Cliend ID
    generate_cliend_no : function(){
        return uuidV4();
    },

    //===============PASSWORD HASHING====================//
    hash_password : function(password){
        return new Promise((resolve)=>{
            bcrypt.genSalt(10,function(err,salt){
                bcrypt.hash(password,salt,function(err,hash){
                    resolve(hash);
                });
            });
        });
    },

    compare_password : function(password, hash){
        return new Promise((resolve)=>{
            bcrypt.compare(password,hash,function(err,res){
                resolve(res);
            });
        });
    }
    //===============PASSWORD HASHING====================//
    




};


module.exports =  master;