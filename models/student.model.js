const mongoose, {ObjectId} = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const StudentSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  registration: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  curricularGrade: {
    type: String,
    enum: ['NEW', 'OLD']
  },
  disciplines: [{
    type: String
  }],
  tokens: [{
    token: {
      type: String,
      default: ''
    }
  }]
});

StudentSchema.methods.generateAuthToken = function () {
  const student = this;
  const token = jwt.sign({
    id: student._id.toHexString()
  }, keys.jwt.secret, {
    expiresIn: '12h'
  }).toString();

  user.tokens = user.tokens.concat([{token}]);

  return user.save().then(() => token);
};

const Student = mongoose.model('Student', StudentSchema);

module.exports = Student;