// External module dependencies
var express = require('express');

// Modules instances
var router = express.Router();

router.get('/', function(req, res, next) {
    return res.render('pages/index');
});

// Export Module
module.exports = router;