const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config();
const session = require('express-session');
const registerRoute = require('./routes/register');
const captchaRoute = require('./routes/captcha');
const loginRoute = require('./routes/login');
const dashboardRoute = require('./routes/dashboard');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/register');
    }
});

app.use('/', registerRoute);
app.use('/', captchaRoute);
app.use('/', loginRoute);
app.use('/', dashboardRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});