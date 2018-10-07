const express = require('express');
const router = express.Router();
const passport = require('passport');

router.post('/google', passport.authenticate('google-token', {session: false}), (req, res, next) => {
  if(!req.user){
    return res.status(401).send('User not authorized');
  }
  req.user
  .generateAuthToken()
  .then(token => res.send({token}))
});

module.exports = router;