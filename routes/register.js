const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const bcrypt = require('bcrypt');

router.get('/register', (req, res) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    res.render('register');
});

router.post('/register', async (req, res) => {
    const { username, email, password, repeatPassword, captcha } = req.body;

    if (!username || !email || !password || password !== repeatPassword || !captcha) {
        return res.render('register', { error: 'Please fill in all fields correctly.' });
    }

    if (req.session.captcha !== captcha) {
        return res.render('register', { error: 'Invalid CAPTCHA.' });
    }

    try {
        let users = [];
        try {
            const data = await fs.readFile('users.json', 'utf8');
            users = JSON.parse(data);
        } catch (error) {
            users = [];
        }

        if (users.find(user => user.username === username)) {
            return res.render('register', { error: 'Username already exists.' });
        }
        if (users.find(user => user.email === email)) {
            return res.render('register', { error: 'Email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = { username, email, password: hashedPassword };

        users.push(newUser);

        await fs.writeFile('users.json', JSON.stringify(users, null, 2));

        res.render('register', { success: 'Registration successful!' });

    } catch (error) {
        console.error('Error during registration:', error);
        res.render('register', { error: 'An error occurred during registration.' });
    }
});

module.exports = router;