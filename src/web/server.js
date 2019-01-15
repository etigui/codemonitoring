// External module dependencies
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var compression = require('compression');
var expressSession = require('express-session');
var mysqlSessionStore = require('express-mysql-session')(expressSession);
var expressValidator = require('express-validator');
var debug = require('debug')('web:server');
var morgan = require('morgan');

// External security and auth module dependencies
var helmet = require('helmet');
var xssProtection = require('x-xss-protection');
var passport = require('passport');

// Install bcrypt win
// npm install -g node-gyp
// npm install --g --production windows-build-tools
// npm install bcrypt --save
var bcrypt = require('bcrypt');

// Internal module dependencies
var config = require('./configs/conf');
var webSocketServer = require('./socket');
var db = require('./db');

// Modules instances
var app = express();

// Middleware stack
app.use(expressValidator());
app.use(cookieParser());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));

// Helmet secure express apps by setting various HTTP headers
//app.use(helmet());

// X-XSS-Protection HTTP header is a basic protection against XSS
//app.use(xssProtection({ setOnOldIE: true }));

// Vars
var env = !isEmpty(config.env) ? config.env : null;
var port = !isEmpty(config.port) ? config.port : null;
var dbHost = !isEmpty(config.dbHost) ? config.dbHost : null;
var dbUsername = !isEmpty(config.dbUsername) ? config.dbUsername : null;
var dbPassword = !isEmpty(config.dbPassword) ? config.dbPassword : null;
var dbPort = !isEmpty(config.dbPort) ? config.dbPort : null;
var dbName = !isEmpty(config.dbName) ? config.dbName : null;
var sessionSecret = !isEmpty(config.sessionSecret) ? config.sessionSecret : null;

// Check if var empty
function isEmpty(value) {
    return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
}

// Check one of the var is null => quit
if([env, port, dbHost, dbUsername, dbPassword, dbPort, dbName, sessionSecret].includes(null)) {
    console.error('Server var null');         
    process.exit(0);
}

// App config
app.disable('x-powered-by');

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Create MySQL session store
var dbSessionStore = new mysqlSessionStore({
    host: dbHost,
    port: dbPort,
    user: dbUsername,
    password: dbPassword,
    database: dbName
});

// Create session
app.use(expressSession({
    key: 'socialify.sess',
    secret: sessionSecret,
    store: dbSessionStore,
    resave: false,
    saveUninitialized: false,
    //cookie: {path: '/', secure: false, httpOnly: true, expires: new Date(Date.now() + 86400000)}
}));

// Init and use session with passport
app.use(passport.initialize());
app.use(passport.session());

// Server listen
var server = app.listen(port, function () {
    console.log('node.js static server listening on port: ' + port + ", with websockets listener")
});

// Bind express to websocket server
webSocketServer.init(server);

// Define routes files
var indexRouter = require('./routes/index');
var registerRouter = require('./routes/home');
var homeRouter = require('./routes/home');

// Set route path (url) to route file
app.use('/', indexRouter);
app.use('/register', registerRouter);
app.use('/home', homeRouter);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Production and development error handler
// Set locals, only providing error in development
//ENOENT ECONNREFUSED
app.use(function(err, req, res, next) {


    res.locals.message = err.message;
    res.status(err.status || 500);
    if(env === 'dev'){
        res.locals.error = err;
        //res.render({message: err.message, error: err});
        res.render('pages/error');
    }else{
        res.locals.error = {};
        //res.render({message: err.message, error: {}});
        res.render('pages/error');
    }
});

// Export Module
module.exports = app;