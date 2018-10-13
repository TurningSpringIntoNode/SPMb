const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');

router.get('/me', authMiddleware.isAuthenticatedUser, (req, res) => {
  res.send(req.user);
});

module.exports = router;