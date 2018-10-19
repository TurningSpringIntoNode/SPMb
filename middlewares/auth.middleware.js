const UserModels = require('../models/users');

const isAuthorized = (validRoles) => {
  return (req, res, next) => {

    const token = req.header('x-auth');

    validRoles.forEach(role => {
      const userModel = UserModels[role];
      if (userModel) {
        userModel
          .findByToken(token)
          .then(user => {
            if (user) {
              req.role = role;
              req.user = user;
              next();
            }
          });
      }
    });
  };
};


module.exports = {
  isAuthorized
};
