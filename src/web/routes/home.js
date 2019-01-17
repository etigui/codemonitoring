// External module dependencies
var express = require('express');

// Internal module dependencies
var checkAuth = require('../controllers/checkAuth');
var passport = require('../controllers/passport');

// Modules instances
var router = express.Router();

// Middleware stack
router.use(passport.session());

router.get('/', checkAuth, function(req, res, next) {
    return res.status(200).render('pages/home');
});

// Export Module
module.exports = router;