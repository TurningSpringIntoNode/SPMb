const express = require('express');

const router = express.Router();
const passport = require('passport');
const UserModels = require('../models/users/index');
const { isProduction } = require('../app.config');

let passportMiddleware;

if (isProduction) {
  passportMiddleware = passport.authenticate('google-token', { session: false });
} else {
  passportMiddleware = (req, res, next) => {
    req.user = Object.assign({}, req.body.user);
    next();
  };
}

router.post('/google', passportMiddleware, (req, res) => {
  if (!req.user) {
    res.status(401).send('User not authorized');
  } else {
    const { role } = req.body;

    if (role !== 'Student' && role !== 'Coordinator') {
      res.sendStatus(400);
    } else {
      const { user } = req;

      const User = UserModels[role];
      User
        .findByEmail(user.email)
        .then((dbUser) => {
          if (!dbUser) {
            if (role === 'Coordinator' && isProduction) {
              return Promise.reject();
            }
            const newUser = new User(req.user);
            return newUser.save();
          }
          if (!dbUser.name) {
            dbUser.name = user.name;
            return dbUser.save();
          }
          return dbUser;
        })
        .then(myUser => res.send({ token: myUser.generateAuthToken() }))
        .catch(() => res.sendStatus(401));
    }
  }
});

module.exports = router;
