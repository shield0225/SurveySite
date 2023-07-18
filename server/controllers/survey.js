// Author: Aileen Salcedo ->
// Student ID: 301308843 ->
// COMP229 - Web Application Development ->
// First Release - Survey Site ->

let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// create a reference to the model
let Survey = require('../models/survey');

module.exports.displayActiveSurveysPage = (req, res, next) => {
  Survey.find().sort({ surveyName: 1 }).exec()
      .then((surveyList) => {
        res.render('survey/active_surveys', { title: 'Active Surveys', surveyList });
      })
      .catch((err) => {
        console.error(err);
        next(err);
      });
  }