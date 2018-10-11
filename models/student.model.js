const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const StudentSchema = new Schema({
  user: {
    id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      default: ''
    }
  },
  registration: String,
  curricularGrade: {
    type: String,
    enum: ['NEW', 'OLD']
  },
  disciplines: [{
    type: String
  }]
});

StudentSchema.methods.generateAuthToken = function () {
  const student = this;

  const token = jwt.sign({
    id: student._id.toHexString()
  }, keys.jwt.secret, {
    expiresIn: '12h'
  }).toString();

  return student.save().then(() => token);
};

StudentSchema.methods.toJSON = function () {
  const student = this;
  return {
    name: student.user.name,
    registration: student.registration,
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
    '_id': decodedStudent.id
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