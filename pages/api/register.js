import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const file = new JSONFile('db.json');
const db = new Low(file, { users: [] });

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const id = generateUserId();

            await db.read();
            db.data.users.push({ id, username, email, password: hashedPassword });
            await db.write();

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
