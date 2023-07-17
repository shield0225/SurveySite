// Author: Aileen Salcedo ->
// Student ID: 301308843 ->
// COMP229 - Web Application Development ->
// First Release - Survey Site ->

let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");

// connect to our Survey Model
let Survey = require("../models/survey");
let passport = require("passport");
let jwt = require("jsonwebtoken");
let DB = require("../config/db");
let survey_responses = require("../models/survey_responses");

Date.prototype.toShortFormat = function () {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let day = this.getDate();

  let monthIndex = this.getMonth();
  let monthName = monthNames[monthIndex];

  let year = this.getFullYear();

  return `${day}-${monthName}-${year}`;
};

//add survey content
module.exports.displayActiveSurveysPage = (req, res, next) => {
  Survey.find((err, surveyList) => {
    if (err) {
      return console.error(err);
    } else {
      //see if current date is between start and end date
      let currentDate = new Date();
      let activeSurveys = [];
      for (let i = 0; i < surveyList.length; i++) {
        let startDate = new Date(surveyList[i].startDate);
        let endDate = new Date(surveyList[i].closeDate);

        //Checking if the date has a year, if not add the current year
        if (startDate.getFullYear() == 2001) {
          startDate.setFullYear(currentDate.getFullYear());
        }
        if (endDate.getFullYear() == 2001) {
          endDate.setFullYear(currentDate.getFullYear());
        }

        if (currentDate >= startDate && currentDate <= endDate) {
          surveyList[i].startDate = new Date(
            surveyList[i].startDate
          ).toShortFormat();
          surveyList[i].closeDate = new Date(
            surveyList[i].closeDate
          ).toShortFormat();

          activeSurveys.push(surveyList[i]);
        }
      }
      res.json(activeSurveys);
    }
  });
};

module.exports.processCreateSurveyPage = (req, res, next) => {
  let newSurvey = Survey({
    author: req.body.author,
    surveyName: req.body.surveyName,
    startDate: req.body.startDate,
    closeDate: req.body.closingDate,
    questions: req.body.questions,
    surveyType: req.body.surveyType,
  });
  console.log(newSurvey);
  Survey.create(newSurvey, (err, Survey) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      res.json(Survey);
    }
  });
};

// read survey by id
module.exports.displayEditSurveyPage = (req, res, next) => {
  let id = req.params.id;

  Survey.findById(id, (err, surveyToEdit) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      console.log(surveyToEdit);
      res.json({ data: surveyToEdit });
    }
  });
};

module.exports.displayMySurveyPage = (req, res, next) => {
  let author = req.params.author;
  console.log(author);
  Survey.find({ author: author }, (err, mySurveyList) => {
    if (err) {
      console.log(err);
      res
        .end(err)
        .json({ message: "An error occured while trying to get the surveys." });
    } else {
      console.log(mySurveyList);
      if (mySurveyList.length == 0) {
        res.status(404).json({ message: "No surveys found." });
      } else {
        for (let i = 0; i < mySurveyList.length; i++) {
          mySurveyList[i].startDate = new Date(
            mySurveyList[i].startDate
          ).toShortFormat();
          mySurveyList[i].closeDate = new Date(
            mySurveyList[i].closeDate
          ).toShortFormat();
        }
        res.status(200).json({ data: mySurveyList });
      }
    }
  });
};

//update survey content
module.exports.processEditSurveyPage = (req, res, next) => {
  let id = req.params.id;
  let data = req.body.data;

  let updatedSurvey = Survey({
    _id: id,
    author: data.author,
    surveyName: data.surveyName,
    startDate: data.startDate,
    closeDate: data.closeDate,
    questions: data.questions,
    surveyType: data.surveyType,
  });

  // Update the Survey By ID
  Survey.updateOne({ _id: id }, updatedSurvey, (err) => {
    if (err) {
      console.log(err);
      res.status(404).json({
        message: "An error occured while trying to update the survey.",
      });
    } else {
      console.log("Survey Updated Successfully!");
      res.json({
        success: true,
        message: "The survey was updated successfully!",
      });
    }
  });
};

//delete survey content
module.exports.performDeleteSurvey = (req, res, next) => {
  let id = req.params.id;

  Survey.deleteOne({ _id: id }, (err, data) => {
    if (err) {
      return console.error(err);
    } else {
      res.status(200).json({
        msg: data,
      });
    }
  });
};

module.exports.processCreateResponses = (req, res, next) => {
  let newResponses = survey_responses({
    surveyID: req.body.surveyID,
    ans1: req.body.answer1,
    ans2: req.body.answer2,
    ans3: req.body.answer3,
    ans4: req.body.answer4,
    ans5: req.body.answer5,
    participant: req.body.participant,
  });

  console.log(newResponses);

  survey_responses.create(newResponses, (err, survey_responses) => {
    if (err) {
      console.log(err);
      res.end(err);
    } else {
      res
        .status(200)
        .json({ success: true, message: "Survey responses inserted." });
    }
  });
};

module.exports.displayMyStatPage = (req, res, next) => {
  let id = req.params.id;

  console.log(id + "Hello");
  survey_responses.find({ surveyID: id }, (err, myResponseList) => {
    if (err) {
      console.log(err);
      res.status(404).json({ message: err });
    } else {
      // Check if result is empty
      if (myResponseList.length == 0) {
        res.status(404).json({ message: "No stats found." });
      } else {
        console.log(myResponseList);
        res.status(200).json({ data: myResponseList });
      }
    }
  });
};

module.exports.displayMyResponsePage = (req, res, next) => {
  let id = req.params.id;

  console.log(id + "Hello");
  survey_responses.find({ surveyID: id }, (err, myResponseList) => {
    if (err) {
      console.log(err);
      res.status(404).json({ message: err });
    } else {
      // Check if result is empty
      if (myResponseList.length == 0) {
        res.status(404).json({ message: "No responses found." });
      } else {
        console.log(myResponseList);
        res.status(200).json({ data: myResponseList });
      }
    }
  });
};