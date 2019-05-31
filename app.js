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

const mongoDatabase = process.env.DB_NAME; //'LifeBreath';
const uri = process.env.DB_URI; //"mongodb+srv://life-breath_2019:<password>@lifebreath0-yekvt.mongodb.net/test";// view engine setup

// CORS error handling for web browsers
app.use(cors());

// MongoDB databse client to connect with the database
mongoClient.connect(uri, { useNewUrlParser: true }, function(err,database){
    if(err){
        return console.dir(err);
    }
    module.exports.db = database.db(mongoDatabase);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Set Static Folder
//app.use(express.static(path.join(__dirname, 'public')))

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
/**
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});
*/
// the scheduled task to send reminders to users who have not logged in for a while (3 months)
cron.schedule("* * 0 * * *", function() {
  console.log("running a task every day at midnight");
  reminder();
});

// Server listening
app.listen(process.env.PORT);

