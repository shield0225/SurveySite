// Author: Aileen Salcedo ->
// Student ID: 301308843 ->
// COMP229 - Web Application Development ->
// First Release - Survey Site ->

let express = require('express');
let router = express.Router();
let mongoose =  require('mongoose');
let passport = require('passport');

// enable jwt
//let jwt = require('jsonwebtoken');
let DB = require('../config/db');

// Create the User Model instance
let userModel = require('../models/user');
let User = userModel.User; // alias

module.exports.displayHomePage = (req, res, next) => {
    res.render('index', {title: 'Home', firstName: req.user ? req.user.firstName : ''});
}

module.exports.displayAboutPage = (req, res, next) => {
    res.render('about', {title: 'About', firstName: req.user ? req.user.firstName : ''});
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
        return res.redirect('/active-surveys');
    }   
}

// module.exports.processLoginPage = (req, res, next) => {
//     passport.authenticate('local',
//     (err, user, info) => {
//         //server error?
//         if(err)
//         {
//             return next(err);
//         }
//         // is there a user login error?;
//         console.log(user);
//         if(!user)
//         {
//             req.flash('loginMessage', 'Authentication Error');
//             return res.redirect('/login');
//         }
//         req.login(user, (err) => {
//             // server error?
//             if(err)
//             {
//                 return next(err);
//             }

//             const payload = 
//             {
//                 id: user._id,
//                 firstName: user.firstName,
//                 lastName: user.lastName,
//                 username: user.username,
//                 email: user.email
//             }

//             const authToken = jwt.sign(payload, DB.Secret, {
//                 expiresIn: 604800 // 1 week
//             });

//             /* TODO - Getting Ready to convert to API
//             res.json({success: true, msg: 'User Logged in Successfully!', user: {
//                 id: user._id,
//                 firstName: user.firstName,
//                 lastName: user.lastName,
//                 username: user.username,
//                 email: user.email
//             }, token: authToken});
//             */
//             return res.redirect('/contacts/list');
//         });
//     })(req, res, next);
// }

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
                messages: req.flash('registerMessage'),
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
                res.redirect('/survey/active-surveys')
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