const Student = require('../models/student.model');
const UsersController = require('./users.controller');

const getAll = (req, res) => {
  Student
    .find({})
    .then((students) => {
      res.send(students);
    })
    .catch(() => res.sendStatus(400));
};

const getById = (req, res) => {
  Student
    .find({ 'user.id': req.params.id })
    .then(student => res.send(student))
    .catch(() => res.sendStatus(400));
};

const deleteById = (req, res) => {
  UsersController
    .updateStudentRef(req.params.id)
    .then(() => Student.deleteOne({ 'user.id': req.params.id }))
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(400));
};

const getDisciplinesOfStudentById = id => getById(id).then((student) => {
  if (!student) {
    return [];
  }
  return student.populate('disciplines', (err, populatedStudent) => {
    if (err) return Promise.reject();
    return populatedStudent.disciplines;
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
