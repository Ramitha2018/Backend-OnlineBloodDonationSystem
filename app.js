var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyparser = require('body-parser');
var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
var cors = require('cors');
var pug = require('pug');
//var mongoose = require('mongoose');

var app = express();
var MongoClient = require('mongodb').MongoClient;

const mongoDatabase = 'OnlineBloodDonationSystem';
const url = "mongodb://localhost:27017/";// view engine setup

app.use(cors({origin: 'http://localhost:4200'}));

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

//console.log(url+mongoDatabase)
/**mongoose.connect(url+mongoDatabase,{
  useMongoClient: true
});
*/




MongoClient.connect(url, function(err,database){
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



app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use('/createUser', require('./routes/createUser.js'));
app.use('/auth', require('./utils/auth.js'));

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

app.listen(4200);
//module.exports = app;
