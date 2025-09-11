const express = require('express');
const router = express.Router();

router.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/register');
  }
  res.render('dashboard');
});

module.exports = router;
