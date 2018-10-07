const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const CoordinatorSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  tokens: [{
    token: {
      type: String,
      default: ''
    }
  }]
});

CoordinatorSchema.methods.generateAuthToken = function () {
  const coordinator = this;

  const token = jwt.sign({
    id: coordinator._id.toHexString()
  }, keys.jwt.secret, {
    expiresIn: '12h'
  }).toString();

  coordinator.tokens = coordinator.tokens.concat([{token}]);

  return coordinator.save().then(() => token);
};

CoordinatorSchema.statics.findByToken = function (token) {
  const Coordinator = this;

  let decodedCoordinator = null;

  try {
    decodeCoordinator = jwt.verify(token, keys.jwt.secret);
  } catch (e) {
    return Promise.reject();
  }

  return Coordinator.findOne({
    '_id': decodedCoordinator.id,
    'tokens.token': token
  });
};


CoordinatorSchema.statics.findOrCreate = function (coordinator, cb) {
  const Coordinator = this;

  return Coordinator.findOne({
    googleId: coordinator.googleId
  })
  .then(savedCoordinator => {
    if (!savedCoordinator) {
      const newCoordinator = new Coordinator(coordinator);
      newCoordinator
      .save()
      .then(coordinator => cb(null, coordinator))
      .catch(err => cb(err));
    } else {
      cb(null, savedCoordinator);
    }
  })
  .catch(err => cb(err));
};

const Coordinator = mongoose.model('Coordinator', CoordinatorSchema);

module.exports = Coordinator;