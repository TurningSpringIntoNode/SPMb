const passport = require('passport');
const GoogleTokenStrategy = require('passport-google-token').Strategy;
const config = require('../app.config');

passport.use(
  new GoogleTokenStrategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
  }, (acessToken, refreshToken, profile, done) => {
    // console.log(profile);
    const email = profile.emails[0].value;
    const user = {
      email,
      name: profile.displayName,
    };
    done(null, user);
  }),
);
