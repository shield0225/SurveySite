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