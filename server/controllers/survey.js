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
  const successMessage = req.flash('success');
  const errorMessage = req.flash('error');
  Survey.find().sort({ surveyName: 1 }).exec()
      .then((surveyList) => {
        res.render('survey/active_surveys', { title: 'Active Surveys', surveyList, successMessage, errorMessage });
      })
      .catch((err) => {
        console.error(err);
        next(err);
      });
  }

module.exports.displayCreateSurveyPage = (req, res, next) => {
  const successMessage = req.flash('success');
  const errorMessage = req.flash('error');
  res.render('survey/create', {title: 'Create a New Survey', successMessage, errorMessage, firstName: req.user ? req.user.firstName : ''});
}

module.exports.processCreateSurveyPage = (req, res, next) => {
    const message = req.query?.message;
    
    let { author, surveyName, surveyType, startDate, endDate, questions } = req.body;
    author = req.user.firstName + ' ' + req.user.lastName;

    // Create a new contact object
    const newSurvey = new Survey({
      author,
      surveyName,
      surveyType,
      startDate,
      endDate,
      questions
    });

    // Save the new survey to the database
    newSurvey.save()
      .then(savedContact => {
        console.log(message)
        req.flash('success', 'Survey added successfully');
        // Redirect to the surveys list or show a success message
        res.redirect('/survey/active_surveys');
        message = 'Survey created successfully';
        
      })
      .catch(error => {
        console.error(error);
        req.flash('error', 'Error adding survey');
        next(error);
      });
};

module.exports.displayEditSurveyPage = (req, res, next) => {
  const message = req.query?.message;

  // Retrieve the survey from the database based on the provided ID
    Survey.findById(req.params.id)
      .then(survey => {
      if (!survey) {
      // Handle the case where the survey is not found
      res.status(404).send('Survey not found');
      } else {
        // show the edit view
        res.render('survey/update', { title: 'Update Survey', survey: survey, message, 
        firstName: req.user ? req.user.firstName : '' });
    }
  })
  .catch(error => {
    // Handle any errors that occurred during the database query
    console.error(error);
    next(error);
    //res.status(500).send('Internal Server Error');
  });
}

module.exports.processEditSurveyPage = async (req, res, next) => {
  console.log(req.params);
  const id = req.params.id;
  const updatedSurvey = Survey({
      _id: id,
      author: req.body.author,
      surveyName: req.body.surveyName,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      questions: req.body.questions,
      surveyType: req.body.surveyType,
  });
  try {
    await Survey.findByIdAndUpdate((req.params.id), updatedSurvey);
      req.flash('success', 'Survey updated successfully');
      res.redirect('/survey/active_surveys');
    //res.redirect('/survey/active_surveys?status=success&message=Survey updated successfully');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error updating survey');
    //res.redirect(`/survey/update/${id}?message=${error.message}`);
  }
}

 module.exports.deleteSurveyPage = async (req, res, next) => {
    console.log(req.query)
    const message = req.query && req.query.message;
    const id = req.params.id;
    try {
      await Survey.deleteOne({_id: id});
      req.flash('success', 'Survey deleted successfully');
      // refresh the Contacts
        console.log(message);
      res.redirect('/survey/active_surveys');
    } catch (error) {
      console.error(error); 
      req.flash('error', 'Error deleting survey');
      res.redirect(`/survey/active_surveys/?message=${error.message}`);
    }
}  