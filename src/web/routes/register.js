// External module dependencies
var express = require('express');
var expressValidator = require('express-validator');

// Modules instances
var router = express.Router();

// GET /register
router.get('/', function(req, res, next) {
    return res.render('pages/index');
});

// POST /register
router.post('/', function(req, res, next) {

    req.checkBody('username', 'Username connot be empty').notEmpty();
    const errors = req.validationErrors();
    if(errors){
        console.log(error);
        res.render('Registration error');
    }

    return res.render('pages/index');
});

// Export Module
module.exports = router;