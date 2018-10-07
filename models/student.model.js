const mongoose = require('mongoose');
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

  student.tokens = student.tokens.concat([{token}]);

  return student.save().then(() => token);
};

StudentSchema.methods.toJSON = function () {
  const student = this;
  return {
    name: student.name,
    registration: student.registration,
    email: student.email,
    curricularGrade: student.curricularGrade,
    disciplines: student.disciplines
  }
};

StudentSchema.statics.findByToken = function (token) {
  const Student = this;
  
  let decodedStudent = null;

  try {
    decodedStudent = jwt.verify(token, keys.jwt.secret);
  } catch (e) {
    return Promise.reject();
  }

  return Student.findOne({
    '_id': decodedStudent.id,
    'tokens.token': token
  });
};

StudentSchema.statics.findOrCreate = function (student, cb) {

  const Student = this;

  return Student.findOne({
    googleId: student.googleId
  })
  .then(savedStudent => {
    if(!savedStudent){
      const newStudent = new Student(student);
      newStudent
      .save()
      .then(student => cb(null, student))
      .catch(err => cb(err));
    } else {
      cb(null, savedStudent);
    }
  })
  .catch(err => cb(err));
};  

const Student = mongoose.model('Student', StudentSchema);

module.exports = Student;