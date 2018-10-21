const jwt = require('jsonwebtoken');

const keys = require('../../../config/keys');

module.exports = (schema) => {
  schema.add({
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  });

  schema.methods.generateAuthToken = function () {
    const user = this;

    const token = jwt.sign({
      id: user._id.toHexString(),
    }, keys.jwt.secret, {
      expiresIn: '12h',
    });

    return token;
  };

  schema.statics.findByEmail = function (email) {
    const sch = this;
    return sch.findOne({ email });
  };

  schema.statics.findByToken = function (token) {
    const sch = this;

    let decodedUser;

    try {
      decodedUser = jwt.verify(token, keys.jwt.secret);
    } catch (e) {
      return Promise.reject();
    }

    return sch.findById(decodedUser.id);
  };
};
