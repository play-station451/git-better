const express = require('express');
const bodyParser = require('body-parser');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');

const app = express();
const port = 3000;

const file = path.join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const defaultData = { users: [] };
const db = new Low(adapter, defaultData);

db.read().then(async () => {
  db.data = db.data || defaultData;
  db.data.users = db.data.users || []; // Ensure users array exists
  await db.write();

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(session({
    secret: 'your_secret_key', // Replace with a strong secret in production
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
  }));

  app.get('/register', (req, res) => {
    res.render('register', { errors: [] });
  });

  app.post('/register', async (req, res) => {
    const { email, username, password, repeat_password } = req.body;
    const errors = [];

    if (!email || !username || !password || !repeat_password) {
      errors.push('All fields are required.');
    }
    if (password !== repeat_password) {
      errors.push('Passwords do not match.');
    }
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long.');
    }

    await db.read();
    db.data = db.data || defaultData;
    db.data.users = db.data.users || []; // Ensure users array exists
    if (db.data.users.some(user => user.email === email)) {
      errors.push('Email already registered.');
    }
    if (db.data.users.some(user => user.username === username)) {
      errors.push('Username already taken.');
    }

    if (errors.length > 0) {
      res.render('register', { errors });
    } else {
      const id = nanoid(15);
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = { id, email, username, password: hashedPassword };
      db.data = { ...db.data, users: [...db.data.users, newUser] };
      await db.write();
      res.redirect('/dashboard');
    }
  });

  app.get('/login', (req, res) => {
    res.render('login', { errors: [] });
  });

  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const errors = [];

    await db.read();
    db.data = db.data || defaultData;
    db.data.users = db.data.users || []; // Ensure users array exists
    const user = db.data.users.find(u => u.username === username);

    if (!user) {
      errors.push('Invalid username or password.');
    } else {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        errors.push('Invalid username or password.');
      }
    }

    if (errors.length > 0) {
      res.render('login', { errors });
    } else {
      req.session.userId = user.id;
      req.session.username = user.username;
      res.redirect('/dashboard');
    }
  });

  app.get('/dashboard', (req, res) => {
    if (!req.session.userId) {
      return res.redirect('/login');
    }
    res.render('dashboard', { username: req.session.username });
  });

  app.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.redirect('/dashboard');
      }
      res.redirect('/login');
    });
  });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
});