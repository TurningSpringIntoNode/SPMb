const User = require('../models/user.model');

const isAuthenticatedUser = (req, res, next) => {
  const token = req.header('x-auth');

  User.findByToken(token).then(user => {
      if (!user) {
        return Promise.reject();
      }
      req.user = user;
      next();
    })
    .catch(e => {
      res.status(401).send();
    });
};

const hasRole = (role) => {
  const isAuthenticatedWithRole = (req, res, next) => {
    if(req.user.canPlay(role)){
      next();
    } else {
      res.status(401).send();
    }
  };
  return isAuthenticatedWithRole;
};

module.exports = {
  isAuthenticatedUser,
  hasRole
};