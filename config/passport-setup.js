const passport = require('passport');
const GoogleTokenStrategy = require('passport-google-token').Strategy;
const keys = require('./keys');
const Student = require('../models/student.model');

passport.use(
  new GoogleTokenStrategy({
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret
  }, (acessToken, refreshToken, profile, done) => {
    console.log(profile);
    const email = profile.emails[0].value;
    console.log(email);
    // if(keys.coordinators.find(email)){
      
    // } else {
      console.log('find or create route');
      Student.findOrCreate({
        email,
        googleId: profile.id,
        name: profile.displayName
      }, done);
    // }
  })
);
