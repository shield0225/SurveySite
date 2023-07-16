// Author: Aileen Salcedo ->
// Student ID: 301308843 ->
// COMP229 - Web Application Development ->
// Express Authentication ->

let mongoose = require('mongoose');

//create model class
let contactsModel = mongoose.Schema({
    contactName: String,
    contactNumber: String,
    email: String
},
{
    collection: "contacts"
});

module.exports = mongoose.model('Contacts', contactsModel);