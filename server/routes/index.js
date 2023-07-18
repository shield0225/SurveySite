// Author: Aileen Salcedo ->
// Student ID: 301308843 ->
// COMP229 - Web Application Development ->
// First Release - Survey Site ->

let express = require('express');
let router = express.Router();

let indexController = require('../controllers/index');

/* GET home page. */
router.get('/', indexController.displayHomePage);

/* GET home page. */
router.get('/home', indexController.displayHomePage);

/* GET About Me page. */
//router.get('/about', indexController.displayAboutPage);

/* GET Route for the User List page - READ Operation */
router.get('/users', indexController.displayUsersPage);

/* GET Route for displaying the Login page */
router.get('/login', indexController.displayLoginPage);

/* POST Route for processing the Login page */
//router.post('/login', indexController.processLoginPage);

/* GET Route for displaying the Register page */
router.get('/register', indexController.displayRegisterPage);

/* POST Route for processing the Register page */
router.post('/register', indexController.processRegisterPage);

/* GET Route to perform UserLogout */
router.get('/logout', indexController.performLogout);


module.exports = router;