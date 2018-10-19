const Discipline = require('../models/discipline.model');

const getAll = (req, res) => {
  Discipline
    .find({})
    .then(disciplines => res.send(disciplines))
    .catch(() => res.sendStatus(400));
};

const getById = (req, res) => {
  const disciplineId = req.params.id;

  Discipline
    .findById(disciplineId)
    .then(discipline => res.send(discipline))
    .catch(() => res.sendStatus(400));
};

const addDiscipline = (req, res) => {
  const discipline = new Discipline(req.body);

  discipline
    .save()
    .then(savedDiscipline => res.send(savedDiscipline))
    .catch(() => res.sendStatus(400))
};

const deleteById = (req, res) => {
  const disciplineId = req.params.id;

  Discipline
    .deleteById(disciplineId)
    .then(() => res.sendStatus(200))
    .catch(() => res.sendStatus(400));
};

module.exports = {
  getAll,
  getById,
  addDiscipline,
  deleteById,
};
