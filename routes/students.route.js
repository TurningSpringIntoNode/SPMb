const express = require('express');

const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const StudentsController = require('../controllers/students.controller');

router.all('/*', authMiddleware.isAuthenticatedUser);

const isAllowedId = (req, res, next) => {
  if (req.user.canPlay('Coordinator') || (req.user.canPlay('Student') && req.user._id.toHexString() === req.params.id)) {
    next();
  } else {
    res.status(401).send();
  }
};

router.get('/', authMiddleware.hasRole('Coordinator'), StudentsController.getAll);

router.get('/:id', isAllowedId, StudentsController.getById);

router.delete('/:id', isAllowedId, StudentsController.deleteById);

module.exports = router;
