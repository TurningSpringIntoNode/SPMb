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

router.get('/:id', authMiddleware.isAuthorized(['Coordinator', 'Student']), isAllowedId, StudentsController.getById);

router.delete('/:id', authMiddleware.isAuthorized(['Coordinator', 'Student']), isAllowedId, StudentsController.deleteById);

module.exports = router;
