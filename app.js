var createError = require('http-errors');
var express = require('express');
var fileUpload = require('express-fileupload');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

//Include Router
var frontWebRouter = require('./routes/front-web/index');
var docusignRouter = require('./routes/docusign/docusign');
var fusionRouter = require('./routes/fusion-system/index');
var docusignV2Router = require('./routes/docusignV2/docusign');

//Patient
var patientRouter = require('./routes/fusion-system/patient/patient');

//Assessment 
var nursingRouter = require('./routes/fusion-system/assessment/nursing-assessment');
var psychosocialRouter = require('./routes/fusion-system/assessment/psychosocial-assessment');
var spiritualRouter = require('./routes/fusion-system/assessment/spiritual-assessment');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'templates')));
app.use(express.static(path.join(__dirname, 'files')));
app.use(express.static(path.join(__dirname, 'modules')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(fileUpload());

app.use(session({
    secret: 'king',
    resave : true,
    saveUninitialized: true,
    cookie: {}
}));


//Re- Routing
app.use('/', frontWebRouter);
app.use('/docusign',  docusignRouter);
app.use('/docusignV2', docusignV2Router);
app.use('/hfusion',fusionRouter);

//Patient
app.use('/patient', patientRouter);

//Assessment
app.use('/patient/nursing-assessment',nursingRouter);
app.use('/patient/psychosocial-assessment',psychosocialRouter);
app.use('/spiritual-assessment',spiritualRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
