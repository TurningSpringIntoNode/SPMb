const UserModels = require('../models/users');

const isAuthorized = validRoles => (req, res, next) => {
  const token = req.header('x-auth');

  const userPromies = validRoles.map(role => new Promise((resolve) => {
    const userModel = UserModels[role];
    if (userModel) {
      userModel
        .findByToken(token)
        .then((user) => {
          if (user) {
            resolve({
              user,
              role,
            });
          } else {
            resolve();
          }
        })
        .catch(resolve);
    } else {
      resolve();
    }
  }));

  Promise
    .all(userPromies)
    .then((usersOrNull) => {
      const users = usersOrNull.filter(x => !!x);
      if (users.length > 0) {
        req.user = users[0].user;
        req.role = users[0].role;
        next();
      } else {
        res.sendStatus(401);
      }
    });
};


module.exports = {
  isAuthorized,
};
