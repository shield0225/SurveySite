// Author: Aileen Salcedo ->
// Student ID: 301308843 ->
// COMP229 - Web Application Development ->
// First Release - Survey Site ->

let mongoose = require('mongoose');

let surveyResponsesModel = mongoose.Schema({
    participant: String,
    surveyName: String,
    startDate: String,
    endDate: String,
    surveyType: String,
    a1: String,
    a2: String,
    a3: String,
    a4: String,
    a5: String    
},
    {
    collection: "survey_responses"

});

module.exports = mongoose.model('SurveyResponses', surveyResponsesModel);