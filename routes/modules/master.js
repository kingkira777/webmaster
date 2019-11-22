const crypto = require('crypto');
const nodemailer = require('nodemailer');


var master = {  

    //Send Email

    send_email : function(){

        var transporter = nodemailer.createTransport({
            host : 'hospicefusion.com',
            port : '465',
            secure: true,
            auth:{
                user : 'support@hospicefusion.com',
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

    //Get the Current Date
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
    }

};



module.exports =  master;