import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const file = new JSONFile('db.json');
const db = new Low(file, { users: [] });

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        try {
            await db.read();
            const user = db.data.users.find(u => u.username === username);

            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

            return res.status(200).json({ message: 'Login successful', token: token });
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({ message: 'Login failed' });
        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}