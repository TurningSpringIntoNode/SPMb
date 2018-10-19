const passport = require('passport');
const GoogleTokenStrategy = require('passport-google-token').Strategy;
const keys = require('./keys');

passport.use(
  new GoogleTokenStrategy({
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
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
