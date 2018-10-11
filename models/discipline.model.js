const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DisciplineSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  period: Number,
  credits: Number,
  curricularGrade: [{
    type: String,
    enum: ['NEW', 'OLD']
  }],
  curricularType: {
    type: String,
    enum: ['REQUIRED', 'OPTIONAL']
  },
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'Student'
  }]
});

const Discipline = mongoose.model('Discipline', DisciplineSchema);

module.exports = Discipline;