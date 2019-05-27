const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
//var bodyparser = require('body-parser');
const indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
const cors = require('cors');
const pug = require('pug');
const app = express();
const mongoClient = require('mongodb').MongoClient;
const cron = require('node-cron');
const reminder = require('./sceduled/userReminderHandler.js');
require('dotenv').config();

const mongoDatabase = process.env.DB_NAME; //'OnlineBloodDonationSystem';
const url = process.env.DB_LINK; //"mongodb://localhost:27017/";// view engine setup

app.use(cors({origin: process.env.LOCAL_HOST+':'+process.env.ORIGIN_PORT})); //'http://localhost:2401'




mongoClient.connect(url, function(err,database){
  if(err){
    return console.dir(err);
    }
      module.exports.db = database.db(mongoDatabase);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Routes
app.use('/', indexRouter);
app.use('/createUser', require('./routes/createUser.js'));
app.use('/auth', require('./utils/auth.js'));
app.use('/search', require('./search/searchhandler.js'));
app.use('/quiz', require('./routes/setquiz.js'));
app.use('/verify', require('./utils/verifyEmail.js'));
app.use('/deleteUser', require('./routes/deleteUser.js'));
app.use('/getUser', require('./routes/getProfile.js'));
app.use('/setUser', require('./routes/setProfile.js'));
app.use('/adminSearch', require('./search/adminsearch.js'));
app.use('/deleteReq', require('./search/removeSearchReq.js'));


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

cron.schedule("10 * * * * *", function() {                               // the scheduled task to send reminders to users who have not logged in for a while
  console.log("running a task every day at midnight");
  reminder();
});

// Server listening
app.listen(process.env.PORT);

