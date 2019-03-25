const express = require('express');

const router = express.Router();
const DisciplinesController = require('../controllers/disciplines.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', DisciplinesController.getAll);

router.get('/:id', DisciplinesController.getById);

router.post('/', authMiddleware.isAuthorized(['Coordinator']), DisciplinesController.addDiscipline);

router.delete('/:id', authMiddleware.isAuthorized(['Coordinator']), DisciplinesController.deleteById);

module.exports = router;
