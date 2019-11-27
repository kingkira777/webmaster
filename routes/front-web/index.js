var express = require('express');
var router = express.Router();
var master = require('../modules/master');
var con = require('../modules/connection');

//=================================CLIENT SIDE================================//

//Home Page 
router.get('/',function(req,res,next){
    res.render('front-web/index',{title: 'Hospice Fusion', isHome :true});
    res.end();
});


//Contact Page
router.get('/contact', function(req,res,next){
    res.render('front-web/contact',{ title : 'Contact', isContact :true});
    res.end();
});

//About Page
router.get('/about',function(req,res,next){
    res.render('front-web/about', { tilte : 'About', isAbout :true })
});


//Login & Regiser Page
router.get('/login?',function(req,res,next){
    var status = req.query.status;
    res.render('front-web/login',{ title : 'Login', status: status, isLogin :true });
    res.end();    
});



//========================CLIENT SIDE POST REQUEST================================//
//Login User
router.post('/login-user',function(req,res,next){
    var email = req.body.email;
    var password = req.body.password;
    
    var c_email = `SELECT * FROM clients WHERE client_email = ?`;
    var c_val = [email];

    con.query(c_email,c_val,function(err,rs){
        if(err){
            console.log(err);
        }
        if(rs.length != 0){
            var xpassword = rs[0].client_password;
            master.compare_password(password,xpassword).then((isLogin)=>{
                if(isLogin){
                    res.send('Login Successfuly');
                    res.end();
                }else{
                    res.redirect('/login?status=4');
                    res.end(); 
                }
            });
        }
        if(rs.length == 0){
            res.redirect('/login?status=4');
            res.end();
        }
    });

});


//Register User
router.post('/register-user',function(req,res,next){
    var cliend_no = master.generate_cliend_no();
    var email = req.body.email;
    var company = req.body.company;
    var password = req.body.password;
    var repassword = req.body.repassword;

    if(password != repassword){
        res.redirect('/login?status=1');
        res.end();
    }else{
        
        var c_email = `SELECT * FROM clients WHERE client_email = ?`;
        var c_emalVal = [email];
        con.query(c_email,c_emalVal,function(err,rs){
            if(err){
                console.log(err);
            }
            if(rs.length != 0){
                res.redirect('/login?status=3');
                res.end();
            }
            if(rs.length == 0){
                master.hash_password(password).then((encpassword)=>{
                    var sql = `INSERT INTO clients(client_no, client_email, client_company, client_password)
                    VALUES ?`;
                    var sql_val = [
                        [cliend_no, email, company, encpassword]
                    ];
        
                    con.query(sql,[sql_val],function(err1,rs){
                        if(err1){
                            res.redirect('/login?status=2');
                            res.end();
                        }
                        res.redirect('/login?status=0');
                        res.end();
                    });
                });
            }
        });
    }

}); 











module.exports = router;
