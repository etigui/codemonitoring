// External module dependencies
var express = require('express');

// Internal module dependencies
var passport = require('../controllers/passport');

// Modules instances
var router = express.Router();

router.get('/', function(req, res, next) {
    return res.render('pages/index');
});

router.post('/', passport.authenticate('local',  {
    successRedirect: '/home',
    failureRedirect: '/',
    //failureFlash: 'Invalid username or password',
    //successFlash: 'Welcome'
}));

// Export Module
module.exports = router;