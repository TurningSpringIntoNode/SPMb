const express = require('express');
const router = express.Router();
const DisciplinesController = require('../controllers/disciplines.controller');

router.get('/', (req, res) => {
  DisciplinesController
  .getAll()
  .then(disciplines => res.send(disciplines))
  .catch(e => res.status(404).send());
});

router.get('/:id', (req, res) => {
  const disciplineId = req.params.id;
  DisciplinesController
  .getById(disciplineId)
  .then(discipline => res.send(discipline))
  .catch(e => res.status(404).send());
});

module.exports = router;
