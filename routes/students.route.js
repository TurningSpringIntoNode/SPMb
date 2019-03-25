const express = require('express');

const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const StudentsController = require('../controllers/students.controller');

const isAllowedId = (req, res, next) => {
  if (req.role === 'Coordinator') {
    next();
  } else if (req.role === 'Student' && req.params.id === req.user._id.toHexString()) {
    next();
  } else {
    res.sendStatus(401);
  }
};

router.get('/', authMiddleware.isAuthorized(['Coordinator']), StudentsController.getAll);

router.all('/:id', authMiddleware.isAuthorized(['Coordinator', 'Student']), isAllowedId);

router.get('/:id', StudentsController.getById);

router.delete('/:id', StudentsController.deleteById);

router.get('/:id/disciplines', StudentsController.getDisciplinesOfStudentById);

router.patch('/:id/disciplines', StudentsController.updateDisciplinesOfStudentById);

module.exports = router;
