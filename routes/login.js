const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const bcrypt = require('bcrypt');

router.get('/login', (req, res) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    res.render('login', { error: null });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.render('login', { error: 'Please enter both username and password.' });
    }

    try {
        const data = await fs.readFile('users.json', 'utf8');
        const users = JSON.parse(data);

        const user = users.find(u => u.username === username);
        if (!user) {
            return res.render('login', { error: 'Invalid username or password.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.render('login', { error: 'Invalid username or password.' });
        }

        req.session.user = { username: user.username };
        res.redirect('/dashboard');

    } catch (error) {
        console.error('Error during login:', error);
        res.render('login', { error: 'An error occurred during login.' });
    }
});

module.exports = router;