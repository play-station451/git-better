import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
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
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const id = generateUserId();

            const conn = await pool.getConnection();
            await conn.query('INSERT INTO users (id, username, password) VALUES (?, ?, ?)', [id, username, hashedPassword]);
            conn.release();

            return res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            console.error('Registration error:', error);
            return res.status(500).json({ message: 'Registration failed' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}

function generateUserId() {
    const uuid = uuidv4();
    const numericID = uuid.replace(/[^0-9]/g, '').substring(0, 10);
    return numericID;
}
