const express = require('express');
const router = express.Router();


//==================GET REQUEST=============================//

// Home Page
router.get('/',function(req,res,next){
    res.render('fusion-system/index',{title: 'Hospice Fusion', isHome : 'active'});
    res.end();
});

//Patient Page
router.get('/patients',function(req,res,next){
    res.render('fusion-system/patients',{ title : 'Patients', isPatients : 'active' });
    res.end();
});


//Reports
router.get('/reports',function(req,res,next){
    res.render('fusion-system/reports',{ title: 'Reports', isReports : 'active' });
    res.end();
}); 


//Human Resources
router.get('/human-resources',function(req,res,next){
    res.render('fusion-system/human-resources', { title : 'Human Resources', isHr : 'active'});
    res.end();
});

//Calendar
 router.get('/calendar',function(req,res,next){
    res.render('fusion-system/calendar',{ title : 'Calendar', isCalendar : 'active'});
    res.end();
 });

















module.exports = router;