const jwt = require('jsonwebtoken');

const config = require('../../../app.config');

module.exports = (schema) => {
  schema.add({
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function(v) {
          return /[\w+.]*[\w]+@ccc.ufcg.edu.br/.test(v);
        },
        message: props => `${props.value} is not a valid email!`
      },
    },
  });

  schema.methods.generateAuthToken = function () {
    const user = this;

    const token = jwt.sign({
      id: user._id.toHexString(),
    }, config.jwt.secret, {
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
      decodedUser = jwt.verify(token, config.jwt.secret);
    } catch (e) {
      return Promise.reject();
    }

    return sch.findById(decodedUser.id);
  };
};
