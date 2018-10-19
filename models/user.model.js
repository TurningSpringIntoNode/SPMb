const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const Student = require('./users/student.model');
const Coordinator = require('./users/coordinator.model');

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  googleID: {
    type: String,
    required: true,
    unique: true,
  },
  roles: {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
    },
    coordinator: {
      type: Schema.Types.ObjectId,
      ref: 'Coordinator',
    },
  },
});

UserSchema.methods.canPlay = function (role) {
  const user = this;
  if (role === 'Coordinator') return !!user.roles.coordinator;
  if (role === 'Student') return !!user.roles.student;
  return false;
};


UserSchema.methods.toJSON = function () {
  const user = this;

  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
};

UserSchema.methods.getRole = function () {
  const user = this;

  return user.roles.student ? 'Student' : 'Coordinator';
};

UserSchema.methods.generateAuthToken = function () {
  const user = this;

  const token = jwt.sign({
    id: user._id.toHexString(),
  }, keys.jwt.secret, {
    expiresIn: '12h',
  }).toString();

  return user.save().then(() => token);
};

UserSchema.methods.setupRole = function () {
  const user = this;

  const isCoordinator = keys.coordinators.find(x => x === user.email);

  return new Promise((resolve, reject) => {
    const userMeta = {
      user: {
        id: user._id,
        name: user.name,
      },
    };
    let userRole; let
      role;
    if (isCoordinator) {
      userRole = new Coordinator(userMeta);
      role = 'coordinator';
    } else {
      userRole = new Student(userMeta);
      role = 'student';
    }
    userRole
      .save()
      .then((userRole) => {
        user.roles[role] = userRole._id;
        user
          .save()
          .then(resolve);
      })
      .catch(reject);
  });
};

UserSchema.statics.findByToken = function (token) {
  const User = this;

  let decodedUser = null;

  try {
    decodedUser = jwt.verify(token, keys.jwt.secret);
  } catch (e) {
    return Promise.reject();
  }

  console.log(decodedUser);

  return User.findById(decodedUser.id);
};

UserSchema.statics.findOrCreate = function (user) {
  const User = this;

  return User.findOne({
    googleID: user.googleID,
  })
    .then((savedUser) => {
      if (!savedUser) {
        const newUser = new User(user);
        return newUser.setupRole();
      }
      return savedUser;
    });
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
