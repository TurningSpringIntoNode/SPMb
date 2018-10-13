const User = require('../models/user.model');

const updateStudentRef = (id, newRef) => {
  return User.findById(id).then(user => {
    if(user){
      user.roles.student = newRef;
      return user.save();
    }
  })
};

module.exports = {
  updateStudentRef
};