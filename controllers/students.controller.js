const Student = require('../models/student.model');
const UsersController = require('./users.controller');

const getAll = () => Student.find({});

const getById = id => Student.findOne({
  'user.id': id,
});

const deleteById = id => UsersController.updateStudentRef(id).then(() => Student.deleteOne({
  'user.id': id,
}));

const getDisciplinesOfStudentById = id => getById(id).then((student) => {
  if (!student) {
    return [];
  }
  student.populate('disciplines', (err, student) => {
    if (err) return Promise.reject();
    return student.disciplines;
  });
});

const updateDisciplinesOfStudentById = (id, disciplines) => getById(id).then((student) => {
  if (student) {
    student.disciplines = disciplines;
    return student.save();
  }
  return student;
});

module.exports = {
  getAll,
  getById,
  deleteById,
  getDisciplinesOfStudentById,
  updateDisciplinesOfStudentById,
};
