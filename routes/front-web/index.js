var express = require('express');
var router = express.Router();
var master = require('../modules/master');


//=================================CLIENT SIDE================================//

//Home Page 
router.get('/',function(req,res,next){
    res.render('front-web/index',{title: 'Hospice Fusion'});
    res.end();
});


//Contact Page
router.get('/contact', function(req,res,next){
    res.render('front-web/contact',{ title : 'Contact'});
    res.end();
});

//About Page
router.get('/about',function(req,res,next){
    res.render('front-web/about', { tilte : 'About' })
});

//Login & Regiser Page
router.get('/login',function(req,res,next){
    res.render('front-web/login',{ title : 'Login' });
    res.end();    
});






module.exports = router;
