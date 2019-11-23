var express = require('express');
var router = express.Router();
var master = require('../modules/master');


router.get('/',function(req,res,next){
    res.render('front-web/index',{title: 'Hospice Fusion'});
    res.end();
});


router.get('/login',function(req,res,next){
    res.render('front-web/login',{ title : 'Login' });
    res.end();    
});






module.exports = router;
