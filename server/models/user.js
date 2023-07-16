// Author: Aileen Salcedo ->
// Student ID: 301308843 ->
// COMP229 - Web Application Development ->
// Express Authentication ->

// require modules for the User Model
let mongoose = require('mongoose');
let passportLocalMongoose = require('passport-local-mongoose');

//create model class
let Users = mongoose.Schema({
    firstName: {
        type: String,
        default: '',
        trim: true,
        required: 'First Name is required'
    },
    lastName: {
        type: String,
        default: '',
        trim: true,
        required: 'Last Name is required'
    },
    email: {
        type: String,
        default: '',
        trim: true,
        required: 'email address is required'
    },
    username: {
        type: String,
        default: '',
        trim: true,
        required: 'username is required'
    },
    password: {
        type: String,
        default: '',
        trim: true,
        required: 'password is required'
    },
    created: {
        type: Date,
        default: Date.now
    },
    update: {
        type: Date,
        default: Date.now
    }
},
{
    collection: "users"
});

// configure options for User Model
let options = ({missingPasswordError: 'Wrong / Missing Password'});

Users.plugin(passportLocalMongoose, options);

module.exports.User = mongoose.model('User', Users);