// Author: Aileen Salcedo ->
// Student ID: 301308843 ->
// COMP229 - Web Application Development ->
// Express Authentication ->

let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

let passport = require('passport');

// connect to Contacts Model
let Contacts = require('../models/contacts');

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

let contactsController = require('../controllers/contacts');

/* GET Route for the Business Contacts Page - READ Operation */  
router.get('/list', requireAuth, contactsController.displayContactsListPage);

/* GET Route for the Update page - UPDATE Operation */  
router.get('/:id', requireAuth, contactsController.updateContactsPage);

// POST Route for the Update page - UPDATE Operation */ 
router.post('/:id', requireAuth, contactsController.processUpdateContactsPage);

// GET Route to perform Deletion - DELETE Operation */ 
router.get('/delete/:id', requireAuth, contactsController.deleteContactsPage);


module.exports = router;