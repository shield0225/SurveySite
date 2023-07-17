// Author: Aileen Salcedo ->
// Student ID: 301308843 ->
// COMP229 - Web Application Development ->
// First Release - Survey Site ->

let express = require("express");
let router = express.Router();

let passport = require("passport");
let jwt = require('jsonwebtoken');
let surveyController = require("../controllers/survey");

// helper function for guard purposes
function requireAuth(req, res, next)
{
  // check if the user is logged in
  if(!req.session.passport)
  {
    return res.redirect('/login');
  }
  return next();
}

// GET Route for the Survey List page - READ OPERATION
router.get("/active-surveys", surveyController.displayActiveSurveysPage);

/* Post create survey page. */
router.post("/create-survey", requireAuth, surveyController.processCreateSurveyPage);

// update survey
router.post("/update-survey/:id", authorized, surveyController.processEditSurveyPage);

// read survey by id
router.get("/read-survey/:id",  surveyController.displayEditSurveyPage);

// read survey by author
router.get("/read-my-surveys/:author", authorized, surveyController.displayMySurveyPage);

// Delete Survey
router.delete("/delete-survey/:id", authorized, surveyController.performDeleteSurvey);

// Read My Responses
router.get("/read-my-responses/:id", surveyController.displayMyResponsePage);

// Read My Stats
router.get("/read-my-stats/:id", surveyController.displayMyStatPage);

// Save Responses
router.post("/survey_responses", surveyController.processCreateResponses);

module.exports = router;