var mysql = require('mysql');
var config = require('./configs/conf');


var dbHost = !isEmpty(config.dbHost) ? config.dbHost : null;
var dbPort = !isEmpty(config.dbPort) ? config.dbPort : null;
var dbUsername = !isEmpty(config.dbUsername) ? config.dbUsername : null;
var dbPassword = !isEmpty(config.dbPassword) ? config.dbPassword : null;
var dbName = !isEmpty(config.dbName) ? config.dbName : null;

// Check if var empty
function isEmpty(value) {
    return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
}

// Create MySQL connection
var dbConnection = mysql.createConnection({
    port: dbPort,
    host     : dbHost,
    user     : dbUsername,
    password : dbPassword,
    database: dbName
});

// Handling function connect
dbConnection.connect(function(err) {
    if (err) {
      console.error('Error connecting to DB: ' + err.stack);
      return;
    }
    console.log('Successfully connected to DB');
});

// Handling error function
dbConnection.on('error', function(err) {
    console.error('Error connecting to DB: ' + err.code);
});

// Close DB connection when colse app (ctrl+c)
process.on('SIGINT', function () {
    dbConnection.end();
    console.error('DB connection closed due to app termination');
    return process.exit(0);
});

module.exports = dbConnection;