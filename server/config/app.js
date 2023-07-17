// Author: Aileen Salcedo ->
// Student ID: 301308843 ->
// COMP229 - Web Application Development ->
// First Release - Survey Site ->

//installed 3rd party packages
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

//modules for authentication
let session = require('express-session');
let passport = require('passport');
// const passport = require('./passport.js');

const LocalStrategy = require('passport-local').Strategy;

let flash = require('connect-flash');

//database setup
let mongoose = require('mongoose');
let DB = require('./db');

    //point mongoose to the DB URI
    mongoose.connect(DB.URI, {useNewUrlParser: true, useUnifiedTopology: true});

    let mongoDB = mongoose.connection;
    mongoDB.on('error', console.error.bind(console, 'Connection Error:'));
    mongoDB.once('open', () => {
        console.log('MongoDB Connection OPEN ...');
    });

    mongoDB.on('connected', () => {
      console.log('MongoDB Connected ...');
    });

    mongoDB.on('disconnected', () => {
      console.log('MongoDB Disconnected ...');
    });

    mongoDB.on('reconnected', () => {
      console.log('MongoDB Reconnected ...');
    });

let surveyRouter = require('../routes/survey.js');
let indexRouter = require('../routes/index.js');
let usersRouter = require('../routes/index.js');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');  // express -e

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

  // setup express session
  app.use(session({
    secret: "SomeSecret",
    saveUninitialized: false,
    resave: false
  }))

  // initialize flash
  app.use(flash());

  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  // initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // create a User Model instance
  let userModel = require('../models/user');
  let User = userModel.User;

const authUser = (username, password, done) => {
  User.findOne({ username, password })
    .then(user => {
      return done(null, user);
    })
    .catch(err => {
      return(err, false);
    });
};
// Use local strategy
passport.use(new LocalStrategy(authUser));

app.use((req, res, next) => {
  if (req.session.passport) {
    res.locals.firstName = req.session.passport.user.firstName;
    res.locals.lastName = req.session.passport.user.lastName;
  }

  return next();
});

// routing
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/survey', surveyRouter);

app.post ("/login", passport.authenticate('local', {
  successRedirect: "/survey/active-surveys",
  failureRedirect: "/login",
}));

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
  res.render('error', {title: 'Error'});
});


module.exports = app;
