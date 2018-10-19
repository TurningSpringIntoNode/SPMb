const express = require('express');

const router = express.Router();
const passport = require('passport');
const models = require('../models');

router.post('/google', passport.authenticate('google-token', { session: false }), (req, res, next) => {
  if (!req.user) {
    return res.status(401).send('User not authorized');
  }

  const role = req.body.role;

  if (role !== 'Student' && role !== 'Coordinator') {
    return res.sendStatus(400);
  }

  const user = req.user;

  const User = models[role];
  User
    .findByEmail(user.email)
    .then(user => {
      if (!user) {
        const newUser = new User(req.user);
        newUser.save();
        return newUser;
      }
      return user;
    })
    .then(user => res.send({token: user.generateAuthToken()}))
    .catch(() => res.sendStatus(400));
});

module.exports = router;
