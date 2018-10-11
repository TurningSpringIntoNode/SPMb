const passport = require('passport');
const GoogleTokenStrategy = require('passport-google-token').Strategy;
const keys = require('./keys');
const User = require('../models/user.model');

passport.use(
  new GoogleTokenStrategy({
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret
  }, (acessToken, refreshToken, profile, done) => {
    console.log(profile);
    const email = profile.emails[0].value;
    const user = {
      email,
      googleID: profile.id,
      name: profile.displayName
    };
    User
    .findOrCreate(user)
    .then(user => done(null, user))
    .catch(err => done(err));
  })
);
