var express = require('express');
var router = express.Router();
var master = require('./modules/master');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/send-email',function(req,res,next){
    master.send_email().then((rs)=>{
      res.send(rs);
      res.end();
    });
});

module.exports = router;
