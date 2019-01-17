// External module dependencies
var  passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },function(req, email, password, done) {

    var db = require('../db');
    db.query('SELECT id, password FROM users WHERE email = ?', [email], function(err, results, fields){
        if(err){
            done(err);
        }

        // If user not found
        if(results.length === 0){
            done(null, false);
        }

        // Check hash password
        var hash = results[0].password.toString();
        bcrypt.compare(password, hash, function(err, res){
            if(res){
                return done(null, {user: results[0].id});
            }else{
                return done(null, false);
            }
        });
    });
}));

/*passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },function(req, email, password, done) {

}));*/


/*passport.use('local-signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },function(req, email, password, done) {

}));*/

module.exports = passport;