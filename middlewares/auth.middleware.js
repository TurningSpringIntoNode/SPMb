const User = require('../models/user.model');

const auth = (req, res, next) => {
  const token = req.header('x-auth');

  console.log(token);

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

module.exports = auth;