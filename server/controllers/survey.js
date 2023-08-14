// Author: Aileen Salcedo ->
// Student ID: 301308843 ->
// COMP229 - Web Application Development ->
// First Release - Survey Site ->

let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// create a reference to the model
let Survey = require('../models/survey');
let SurveyResponses = require('../models/survey_responses');

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
        req.flash('success', 'Survey created successfully');
        // Redirect to the surveys list or show a success message
        res.redirect('/survey/active_surveys');
      })
      .catch(error => {
        console.error(error);
        req.flash('error', 'Error adding new survey');
        next(error);
      });
};

module.exports.displayEditSurveyPage = (req, res, next) => {
  const successMessage = req.flash('success');
  const errorMessage = req.flash('error');

  // Retrieve the survey from the database based on the provided ID
    Survey.findById(req.params.id)
      .then(survey => {
      if (!survey) {
      // Handle the case where the survey is not found
      res.status(404).send('Survey not found');
      } else {
        // show the edit view
        res.render('survey/update', { title: 'Update Survey', survey, successMessage, errorMessage, 
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
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error updating survey');
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
      res.redirect(`/survey/active_surveys`);
    }
}  

module.exports.displayAnswerSurveyPage = (req, res, next) => {
  // Retrieve the survey from the database based on the provided ID
    Survey.findById(req.params.id)
      .then(survey => {
            res.render('survey/view_survey', 
              { title: 'Answer Survey', 
                survey, 
                successMessage: req.flash('successMessage'),
                errorMessage: req.flash('errorMessage'),
                firstName: req.user ? req.user.firstName : '',
                lastName: req.user ? req.user.lastName : ''
              });
    }
  )
  .catch(error => {
    console.error(error);
    next(error);
  });
}

module.exports.processAnswerSurveyPage = async (req, res, next) => {

  let { surveyName, surveyType, startDate, endDate, a1, a2, a3, a4, a5 } = req.body;
    author = req.user.firstName + ' ' + req.user.lastName;
    console.log(req.body);

  const answeredSurvey = SurveyResponses({
      participant: author,
      surveyName: req.body.surveyName,
      surveyType: req.body.surveyType,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      a1: req.body.a1,
      a2: req.body.a2,
      a3: req.body.a3,
      a4: req.body.a4,
      a5: req.body.a5,
      completionDate: new Date()
  });
  console.log(answeredSurvey);
  // Save the new survey to the database
   await SurveyResponses.create(answeredSurvey)
     .then(savedResponses => {
         req.flash('success', 'Responses saved successfully');
         // Redirect to the surveys list or show a success message
         res.redirect('/survey/active_surveys');
     })
     .catch(error => {
         console.error(error);
         req.flash('error', 'Error saving responses');
         next(error);
     });
}

module.exports.listParticipantSurveys = async (req, res, next) => {
  const successMessage = req.flash('success');
  const errorMessage = req.flash('error');
  try {
    const participant = req.user.firstName + ' ' + req.user.lastName; // Get the participant's name
    

    // Find all survey responses for the participant
    const participantSurveys = await SurveyResponses.find({ participant }).exec()
      
    res.render('survey/answered_surveys', {
      title: 'My Answered Surveys',
      participantSurveys,
      successMessage: req.flash('successMessage'),
      errorMessage: req.flash('errorMessage'),
      firstName: req.user.firstName,
      lastName: req.user.lastName
    });
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error fetching participant surveys');
    next(error);
  }
};

module.exports.deleteAnsweredSurvey = async (req, res, next) => {
  console.log(req.query)
  const message = req.query && req.query.message;
  const id = req.params.id;
  try {
    await SurveyResponses.deleteOne({_id: id});
    req.flash('success', 'Answered survey deleted successfully');
    // refresh the Contacts
      console.log(message);
    res.redirect('/survey/answered_surveys');
  } catch (error) {
    console.error(error); 
    req.flash('error', 'Error deleting survey');
    res.redirect(`/survey/answered_surveys`);
  }
}  