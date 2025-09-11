const express = require('express');
const router = express.Router();
const captcha = require('svg-captcha');

router.get('/captcha', (req, res) => {
    const cap = captcha.create();
    req.session.captcha = cap.text;
    res.type('svg');
    res.status(200).send(cap.data);
});

module.exports = router;