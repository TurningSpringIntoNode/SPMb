const Student = require('../models/student.model');
const UsersController = require('./users.controller');

const getAll = () => {
  return Student.find({});
};

const getById = (id) => {
  return Student.findOne({
    'user.id': id
  });
};

const deleteById = (id) => {
  return UsersController.updateStudentRef(id).then(() => {
    return Student.deleteOne({
      'user.id': id
    });
  });
};

const getDisciplinesOfStudentById = (id) => {
  return getById(id).then(student => {
    if(!student){
      return [];
    }
    student.populate('disciplines', (err, student) => {
      if(err)
        return Promise.reject();
      return student.disciplines;
    });
  })
};

const updateDisciplinesOfStudentById = (id, disciplines) => {
  return getById(id).then(student => {
    if(student){
      student.disciplines = disciplines;
      return student.save();
    }
    return student;
  })
};

module.exports = {
  getAll,
  getById,
  deleteById,
  getDisciplinesOfStudentById,
  updateDisciplinesOfStudentById
};