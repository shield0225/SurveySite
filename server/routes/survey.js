// Author: Aileen Salcedo ->
// Student ID: 301308843 ->
// COMP229 - Web Application Development ->
// First Release - Survey Site ->

let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

let passport = require('passport');
//let jwt = require('jsonwebtoken');

// connect to Contacts Model
let Survey = require('../models/survey');

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
router.get("/active_surveys", surveyController.displayActiveSurveysPage);

module.exports = router;