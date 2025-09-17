import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mariadb from 'mariadb';

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Ol20091026',
    database: 'git_better',
    connectionLimit: 5
});

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        try {
            const conn = await pool.getConnection();
            const rows = await conn.query('SELECT * FROM users WHERE username = ?', [username]);
            conn.release();

            if (rows.length === 0) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const user = rows[0];
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user.id, username: user.username }, 'your-secret-key', { expiresIn: '1h' });

            return res.status(200).json({ message: 'Login successful', token: token });
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({ message: 'Login failed' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}