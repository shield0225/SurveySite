// Author: Aileen Salcedo ->
// Student ID: 301308843 ->
// COMP229 - Web Application Development ->
// First Release - Survey Site ->

let express = require("express");
let router = express.Router();

let passport = require("passport");
let jwt = require('jsonwebtoken');
let surveyController = require('../controllers/survey');

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
router.get("/", surveyController.displayActiveSurveysPage);

module.exports = router;