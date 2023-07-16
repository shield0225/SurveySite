// Author: Aileen Salcedo ->
// Student ID: 301308843 ->
// COMP229 - Web Application Development ->
// Express Authentication ->

let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// create a reference to the model
let Contact = require('../models/contacts');

module.exports.displayContactsListPage = (req, res, next) => {
    Contact.find().sort({ contactName: 1 }).exec()
      .then((contactsList) => {
        res.render('contacts/list', { title: 'Business Contacts', contactsList });
      })
      .catch((err) => {
        console.error(err);
        next(err);
      });
  }

  module.exports.updateContactsPage = (req, res, next) => {
    const message = req.query?.message;
  
    // Retrieve the contact from the database based on the provided ID
      Contact.findById(req.params.id)
        .then(contact => {
        if (!contact) {
        // Handle the case where the contact is not found
        res.status(404).send('Contact not found');
        } else {
          // show the edit view
          res.render('contacts/update', { title: 'Update Contact', contact: contact, message, 
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

  module.exports.processUpdateContactsPage = async (req, res, next) => {
    console.log(req.params);
    const id = req.params.id;
    const updatedContacts = Contact({
        _id: id,
        contactName: req.body.contactName,
        contactNumber: +req.body.contactNumber,
        email: req.body.email
    });
    try {
      await Contact.findByIdAndUpdate((req.params.id), updatedContacts);
        res.redirect('/contacts/list');
      //res.redirect('/contacts/list?status=success&message=Contact updated successfully');
    } catch (error) {
      console.error(error);
      //res.redirect(`/contacts/update/${id}?message=${error.message}`);
    }
  }

  module.exports.deleteContactsPage = async (req, res, next) => {
    const id = req.params.id;
    try {
      await Contact.deleteOne({_id: id});
      // refresh the Contacts
      res.redirect('/contacts/list');
    } catch (error) {
      console.error(error); 
      res.redirect(`/contacts/list/?message=${error.message}`);
    }
  }