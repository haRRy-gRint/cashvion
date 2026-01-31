import pool from '../../../lib/db';
import bcrypt from 'bcryptjs';

// Explicitly NOT importing withAuth

export default async function handler(req, res) {
    console.log('[Signup Route] Request received:', req.method);

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { username, email, password } = req.body;
        console.log('[Signup Route] Processing:', { username, email });

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const userExist = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExist.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
            [username, email, hashedPassword]
        );

        console.log('[Signup Route] Success:', newUser.rows[0]);
        res.status(201).json(newUser.rows[0]);

    } catch (err) {
        console.error('[Signup Route] Error:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
}
