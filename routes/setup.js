var express = require('express');
var router = express.Router();
var setup = require('../controllers/setup');




/**
 * Routes for the setup 
 * controlled thorugh controllers/setup
 * Show the setup form and then post to the 
 * .env file
 */
router.get('/', setup.home);

router.post('/', setup.saveSetup);




module.exports = router;
