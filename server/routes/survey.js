// Author: Aileen Salcedo ->
// Student ID: 301308843 ->
// COMP229 - Web Application Development ->
// First Release - Survey Site ->

let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

let passport = require('passport');
//let jwt = require('jsonwebtoken');

// connect to Survey Model
let Survey = require('../models/survey');
let SurveyResponses = require('../models/survey_responses');

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

let surveyController = require('../controllers/survey');

// GET Route for the Survey List page - READ OPERATION
router.get('/active_surveys', requireAuth, surveyController.displayActiveSurveysPage);

/* GET Route for displaying the Register page */
router.get('/create', requireAuth, surveyController.displayCreateSurveyPage);

/* Post Route for Create survey page. */
router.post('/create', requireAuth, surveyController.processCreateSurveyPage);

// GET Route for Update survey page - UPDATE Operation */
router.get('/update/:id', requireAuth, surveyController.displayEditSurveyPage);

// Post Route for Update survey page - UPDATE Operation */
router.post('/update/:id', requireAuth, surveyController.processEditSurveyPage);

// GET Route to perform Deletion - DELETE Operation */ 
router.get('/delete/:id', requireAuth, surveyController.deleteSurveyPage);

// Get Route for answer survey page - PREVIEW Operation */
router.get('/view_survey/:id', requireAuth, surveyController.displayAnswerSurveyPage);

// Post Route for read survey page - ANSWER Operation */
router.post('/view_survey/:id', requireAuth, surveyController.processAnswerSurveyPage);

// Get Route for answer survey page - PREVIEW Operation */
router.get('/answered_surveys', requireAuth, surveyController.listParticipantSurveys);

// GET Route to perform Deletion of Answered Survey - DELETE Operation */
router.get('/delete_answered/:id', requireAuth, surveyController.deleteAnsweredSurvey);




module.exports = router;