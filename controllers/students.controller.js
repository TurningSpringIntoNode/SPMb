const Student = require('../models/users/student.model');

const getAll = (req, res) => {
  Student
    .find({})
    .then((students) => {
      res.send(students);
    })
    .catch(() => res.sendStatus(400));
};

const getById = (req, res) => {

  const studentId = req.params.id;

  Student
    .findById(studentId)
    .then(student => res.send(student))
    .catch(() => res.sendStatus(400));
};

const deleteById = (req, res) => {

  const studentId = req.params.id;

  Student
    .deleteById(studentId)
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(400));
};

const getDisciplinesOfStudentById = (req, res) => {

  const studentId = req.params.id;

  Student
    .findById(studentId)
    .then(student => {
      if (!student) {
        return res.send([]);
      }
      student.poopulate('disciplines', (err, populatedStudent) => {
        if (err) {
          return Promise.reject();
        } else {
          res.send(populatedStudent.disciplines);
        }
      })
    })
    .catch(() => res.sendStatus(400))
};

const updateDisciplinesOfStudentById = (req, res) => {

  const studentId = req.params.id;

  Student
    .findById(studentId)
    .then(student => {
      if (!student) {
        return res.sendStatus(200);
      }
      student.disciplines = disciplines;
      student
        .save()
        .then(() => res.sendStatus(200));
    })
    .catch(() => res.sendStatus(400))
};

module.exports = {
  getAll,
  getById,
  deleteById,
  getDisciplinesOfStudentById,
  updateDisciplinesOfStudentById,
};
