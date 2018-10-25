const mongoose = require('mongoose');
const _ = require('lodash');

const { Schema } = mongoose;

const DisciplineSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  period: Number,
  credits: Number,
  curricularGrade: [{
    type: String,
    enum: ['NEW', 'OLD'],
  }],
  curricularType: {
    type: String,
    enum: ['REQUIRED', 'OPTIONAL'],
  },
  students: [{
    type: Schema.Types.ObjectId,
    ref: 'Student',
  }],
});

DisciplineSchema.methods.toJSON = function () {
  const discipline = this;
  return _.pick(discipline, ['id', 'name', 'period', 'credits', 'curricularGrade', 'curricularType']);
};

const Discipline = mongoose.model('Discipline', DisciplineSchema);

module.exports = Discipline;
