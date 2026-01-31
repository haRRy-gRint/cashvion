import pool from '../../../lib/db';
import { withAuth } from '../../../lib/authorize';

async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { id } = req.query; // Next.js dynamic routes put params in req.query
        const user_id = req.user.id;

        const checkTxn = await pool.query('SELECT * FROM transactions WHERE id = $1', [id]);

        if (checkTxn.rows.length === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        const txn = checkTxn.rows[0];

        if (txn.user_id != user_id) {
            return res.status(403).json({ error: 'Unauthorized: You do not own this transaction' });
        }

        await pool.query('DELETE FROM transactions WHERE id = $1', [id]);
        res.json({ message: 'Transaction deleted' });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server Error' });
    }
}

export default withAuth(handler);
