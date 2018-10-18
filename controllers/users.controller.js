const User = require('../models/user.model');

const updateStudentRef = (id, newRef) => User.findById(id).then((user) => {
  if (user) {
    user.roles.student = newRef;
    return user.save();
  }
  return null;
});

module.exports = {
  updateStudentRef,
};
