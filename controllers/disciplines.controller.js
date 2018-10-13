const Discipline = require('../models/discipline.model');

const getAll = () => {
  return Discipline.find({});
};

const getById = (id) => {
  return Discipline.findById(id);
};

module.exports = {
  getAll,
  getById
};