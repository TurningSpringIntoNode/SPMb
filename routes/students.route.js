const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const studentMiddleware = require('../middlewares/student.middleware');
const StudentsController = require('../controllers/students.controller');

router.all('/*', authMiddleware);

router.get('/:id', (req, res, next) => {
  
  if(req.user.canPlay('Coordinator') || (req.user.canPlay('Student') && req.user._id.toHexString() === req.params.id)) {
    next();
  } else {
    res.status(401).send();
  }

}, (req, res) => {
  const studentId = req.params.id;
  StudentsController
  .getById(studentId)
  .then(student => res.send(student))
  .catch(e => res.status(404).send())
});


module.exports = router;