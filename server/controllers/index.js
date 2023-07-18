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
    res.render('index', {title: 'Home', firstName: req.user ? req.user.firstName : ''});
}

module.exports.displayAboutPage = (req, res, next) => {
    res.render('aboutme', {title: 'About', firstName: req.user ? req.user.firstName : ''});
}

module.exports.displayLoginPage = (req, res, next) => {
    //check if the user is already logged in
    if(!req.user){
        res.render('auth/login', 
        {
            title: 'Login',
            message: req.flash('loginMessage'),
            firstName: req.user ? req.user.firstName : '',
            lastName: req.user ? req.user.lastName : ''
        })
    }
    else
    {
        return res.redirect('survey/active_surveys');
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
    // check if the user is not already logged in
    if(!req.user)
    {
        res.render('auth/register',
        {
            title: 'Register',
            message: req.flash('registerMessage'),
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
    // instantiate a user object
    let newUser = new User({
        username: req.body.username,
        //password: req.body.password
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    });

    User.register(newUser, req.body.password,(err) => {
        if(err)
        {
            console.log("Error: Inserting New User");
            if(err.name =="UserExistsError")
            {
                req.flash(
                    'registerMessage',
                    'Registration Error: User Already Exists!'
                );
                console.log('Error: User Already Exists!')
            }
            return res.render('auth/register',
            {
                title: 'Register',
                message: req.flash('registerMessage'),
                firstName: req.user ? req.user.firstName : '',
                lastName: req.user ? req.user.lastName : '',
            });
        }
        else
        {
            // if no error exists, then registration is successful

            /* TODO - Getting Ready to convert to API
            // redirect the user and authenticate them
            res.json({success: true, msg: 'User Registered Successfully!'});
            */

            return passport.authenticate('local')(req, res, () => {
                res.redirect('/contacts/list')
            });
        }
    });
}

module.exports.performLogout = (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
};

module.exports.displayUsersPage = (req, res, next) => {
    User.find().exec()
      .then((userList) => {
        res.render('users', { title: 'Users', userList });
      })
      .catch((err) => {
        console.error(err);
        next(err);
      });
}