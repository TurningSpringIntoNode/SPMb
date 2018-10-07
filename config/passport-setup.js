const passport = require('passport');
const GoogleTokenStrategy = require('passport-google-token').Strategy;
const keys = require('./keys');
const Student = require('../models/student.model');
const Coordinator = require('../models/coordinator.model');

passport.use(
  new GoogleTokenStrategy({
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret
  }, (acessToken, refreshToken, profile, done) => {
    console.log(profile);
    const email = profile.emails[0].value;
    const user = {
      email,
      googleId: profile.id,
      name: profile.displayName
    };
    if(keys.coordinators.find(x => x === email)){
      Coordinator.findOrCreate(user, done);
    } else {
      Student.findOrCreate(user, done);
    }
  })
);
