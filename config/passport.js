const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

module.exports = function(passport){

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(async function(id, done){
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch(error) {
        done(error, null);
    }
});

passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: false
}, async function(email, password, done){
    try {
        // 1) Check if the email already exists
        var user = await User.findOne({ 'email': email });
        

        if (!user) {
            user = await User.findOne({'username': email})
            if(!user)
            {return done(null, false, { message: 'Unknown User' });}
        }

        // 2) Check if the password is correct
        const isValid =await User.comparePasswords(password, user.password);
        if (!isValid) {
            return done(null, false, { message: 'Unknown Password' });
        }

        // 3) Check if email has been verified
        if (!user.active) {
            return done(null, false, { message: 'Sorry, you must validate email first' });
        }
        if(user)
        return done(null, user, {message: 'Logged in Successfully'});
        
    } catch(error) {
        return done(error, false);
    }
}));
}

// module.exports=passport