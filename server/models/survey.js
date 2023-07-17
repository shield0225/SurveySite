// Author: Aileen Salcedo ->
// Student ID: 301308843 ->
// COMP229 - Web Application Development ->
// Express Authentication ->

let mongoose = require('mongoose');

//create model class
let surveyModel = mongoose.Schema({
    author: String,
    surveyName: String,
    startDate: String,
    closeDate: String,
    surveyType: String,
    questions: Array,
},
{
    collection: "survey"
});

module.exports = mongoose.model('Survey', surveyModel);