const express = require('express');
const router = express.Router();
const DisciplinesController = require('../controllers/disciplines.controller');
const authMiddleware = require('../middlewares/auth.middleware');

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

router.post('/', authMiddleware.isAuthenticatedUser, authMiddleware.hasRole('Coordinator'), (req, res) => {
  const discipline = req.body;
  DisciplinesController
  .addDiscipline(discipline)
  .then(discipline => res.send(discipline))
  .catch(e => res.status(400).send());
});

router.delete('/:id', authMiddleware.isAuthenticatedUser, authMiddleware.hasRole('Coordinator'), (req, res) => {
  const disciplineId = req.params.id;
  DisciplinesController
  .deleteById(disciplineId)
  .then(() => res.send())
  .catch(e => res.status(400).send())
});

module.exports = router;
