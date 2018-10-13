const Discipline = require('../models/discipline.model');

const getAll = () => {
  return Discipline.find({});
};

const getById = (id) => {
  return Discipline.findById(id);
};

const addDiscipline = (discipline) => {
  const disciplineObj = new Discipline(discipline);
  return disciplineObj.save();
};

const deleteById = (id) => {
  return Discipline.deleteOne({
    '_id': id
  });
};

module.exports = {
  getAll,
  getById,
  addDiscipline,
  deleteById
};