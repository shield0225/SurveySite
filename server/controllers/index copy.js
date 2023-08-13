// Author: Aileen Salcedo ->
// Student ID: 301308843 ->
// COMP229 - Web Application Development ->
// First Release - Survey Site ->

let express = require('express');
let router = express.Router();
let mongoose =  require('mongoose');
let passport = require('passport');

// enable jwt
let jwt = require('jsonwebtoken');
let DB = require('../config/db');

// Create the User Model instance
let userModel = require('../models/user');
let User = userModel.User; // alias

module.exports.displayHomePage = (req, res, next) => {
    const successMessage = req.flash('success');
    const errorMessage = req.flash('error');
    res.render('index', {title: 'Home', firstName: req.user ? req.user.firstName : '', successMessage, errorMessage});
}

module.exports.displayLoginPage = (req, res, next) => {
    //check if the user is already logged in
    if(!req.user){
        res.render('auth/login', 
        {
            title: 'Login',
            successMessage: req.flash('successMessage'),
            errorMessage: req.flash('errorMessage'),
            firstName: req.user ? req.user.firstName : '',
            lastName: req.user ? req.user.lastName : ''
        })
    }
    else
    {
        return res.redirect('/');
    }   
}

// module.exports.processLoginPage = (req, res, next) => {
//         passport.authenticate("local", (err, user, info) => {
//           // Server Error
//           if (err) {
//             return next(err);
//           }
//           // Details error
//           if (!user) {
//             return res.status(404).json({
//               success: false,
//               message: "The username or password is incorrect!",
//             });
//           }
//           req.login(user, (err) => {
//             // Server Error
//             if (err) {
//               return next(err);
//             }
      
//             const payload = {
//               id: user._id,
//               firstName: user.firstName,
//               username: user.username,
//               email: user.email,
//             };
      
//             console.log(payload);
      
//             const authToken = jwt.sign(payload, DB.Secret, {
//               expiresIn: 604800, // 1 week
//             });
      
//             return res.json({
//               success: true,
//               message: "User Logged in Successfully!",
//               user: {
//                 id: user._id,
//                 displayName: user.displayName,
//                 username: user.username,
//                 email: user.email,
//               },
//               token: authToken,
//             });
//           });
//         })(req, res, next);
//       };

module.exports.displayRegisterPage = (req, res, next) => {
    const successMessage = req.flash('success');
    const errorMessage = req.flash('error');
    // check if the user is not already logged in
    if(!req.user)
    {
        res.render('auth/register',
        {
            title: 'Register',
            successMessage: req.flash('successMessage'),
            errorMessage: req.flash('errorMessage'),
            firstName: req.user ? req.user.firstName : '',
            lastName: req.user ? req.user.lastName : ''
        });
    }
    else
    {
        return res.redirect('/');
    }
}

module.exports.processRegisterPage = (req, res, next) => {
    const successMessage = req.flash('success');
    const errorMessage = req.flash('error');
    // Instantiate a user object with the form data
    const { username, password, email, firstName, lastName } = req.body;

    const newUser = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    });
    console.log(newUser);

    // Register the new user with User.register()
    User.register(newUser, password, function(err, user){
        const successMessage = req.flash('success');
        const errorMessage = req.flash('error');
        if(err){
            console.log(err);
            if(err.name =="UserExistsError")
            {
                req.flash( 'registerMessage', 'Registration Error: User Already Exists!');
                console.log('Error: User Already Exists!')
            } else {
            req.flash('error', 'Error occurred during registration');
            }
            return res.render("auth/register", 
            {
                title: 'Register', 
                successMessage, 
                errorMessage 
            });
        }
        // A new user was saved
        console.log(user + "2");
        passport.authenticate("local")(req, res, function(){
            req.flash('success', 'User Registered Successfully!');
            res.redirect("/login");
        });
    });
}

module.exports.performLogout = (req, res, next) => {
    const successMessage = req.flash('success');
    const errorMessage = req.flash('error');
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
}

module.exports.displayUsersPage = (req, res, next) => {
    const successMessage = req.flash('success');
    const errorMessage = req.flash('error');
    User.find().exec()
      .then((userList) => {
        res.render('users', { title: 'Users', userList, successMessage, errorMessage });
      })
      .catch((err) => {
        req.flash('error', 'Error loading users');
        console.error(err);
        next(err);
      });
}