var express = require('express');
var router = express.Router();
var master = require('../modules/master');


router.get('/',function(req,res,next){
    res.render('front-web/index',{title: 'Hospice Fusion'});
    res.end();
});






module.exports = router;
