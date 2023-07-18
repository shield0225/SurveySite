// Author: Aileen Salcedo ->
// Student ID: 301308843 ->
// COMP229 - Web Application Development ->
// First Release - Survey Site ->

let mongoose = require("mongoose");


let surveyResponsesModel = mongoose.Schema({
    surveyID: String,
    a1: String,
    a2: String,
    a3: String,
    participant: String,
},
    {
    collection: "survey_responses"

});

module.exports = mongoose.model('Responses', surveyResponsesModel);