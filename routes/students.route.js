const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const studentMiddleware = require('../middlewares/student.middleware');

router.all('/*', authMiddleware);
router.all('/*', studentMiddleware);

router.get('/me', (req, res) => {
  req.user.populate('roles.student', (err, user) => {
    console.log(err, user);
    res.send(user.roles.student);
  })
});

module.exports = router;