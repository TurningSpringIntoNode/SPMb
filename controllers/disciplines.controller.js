const Discipline = require('../models/discipline.model');

const getAll = () => Discipline.find({});

const getById = id => Discipline.findById(id);

const addDiscipline = (discipline) => {
  const disciplineObj = new Discipline(discipline);
  return disciplineObj.save();
};

const deleteById = id => Discipline.deleteOne({
  _id: id,
});

module.exports = {
  getAll,
  getById,
  addDiscipline,
  deleteById,
};
