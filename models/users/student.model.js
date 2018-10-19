const mongoose = require('mongoose');
const userPlugin = require('./plugins/user.plugin');

const { Schema } = mongoose;

const StudentSchema = new Schema({
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

StudentSchema.plugin(userPlugin);

StudentSchema.methods.toJSON = function () {
  const student = this;
  return {
    id: student._id.toHexString(),
    name: student.name,
    registration: student.registration,
    curricularGrade: student.curricularGrade,
    disciplines: student.disciplines,
  };
};

const Student = mongoose.model('Student', StudentSchema);

module.exports = Student;
