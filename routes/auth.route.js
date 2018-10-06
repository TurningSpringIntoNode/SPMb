const express = require('express');
const router = express.Router();
const passport = require('passport');

router.post('/google', passport.authenticate('google-token', {session: false}), (req, res, next) => {
  if(!req.user){
    return res.status(401).send('User not authorized');
  }
  console.log(req.user);
  res.send('OK');
});

module.exports = router;