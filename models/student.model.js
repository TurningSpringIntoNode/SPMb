const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  user: {
    id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      default: '',
    },
  },
  registration: String,
  curricularGrade: {
    type: String,
    enum: ['NEW', 'OLD'],
  },
  disciplines: [{
    type: Schema.Types.ObjectId,
    ref: 'Discipline',
  }],
});

StudentSchema.methods.toJSON = function () {
  const student = this;
  return {
    name: student.user.name,
    registration: student.registration,
    curricularGrade: student.curricularGrade,
    disciplines: student.disciplines,
  };
};

const Student = mongoose.model('Student', StudentSchema);

module.exports = Student;
