import pool from '../../../lib/db';
import bcrypt from 'bcryptjs';
import { withAuth } from '../../../lib/authorize';

async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { password } = req.body;
        const user_id = req.user.id;

        const user = await pool.query('SELECT password_hash FROM users WHERE id = $1', [user_id]);

        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const validPass = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPass) {
            return res.status(401).json({ error: 'Invalid Password' });
        }

        res.json({ success: true });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server Error' });
    }
}

export default withAuth(handler);
