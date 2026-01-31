import pool from '../../../lib/db';
import { withAuth } from '../../../lib/authorize';

async function handler(req, res) {
    const user_id = req.user.id;

    if (req.method === 'GET') {
        try {
            const { type } = req.query;

            if (!type || !['public', 'private'].includes(type)) {
                return res.status(400).json({ error: 'Invalid or missing type parameter' });
            }

            const query = 'SELECT * FROM transactions WHERE account_type = $1 AND user_id = $2 ORDER BY txn_date DESC';
            const params = [type, user_id];

            const result = await pool.query(query, params);
            res.json(result.rows);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Server Error' });
        }
    } else if (req.method === 'POST') {
        try {
            const { amount, category, description, txn_date, account_type } = req.body;

            if (!amount || !category || !txn_date || !account_type) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            if (!['public', 'private'].includes(account_type)) {
                return res.status(400).json({ error: 'Invalid account_type' });
            }

            const newTxn = await pool.query(
                'INSERT INTO transactions (user_id, amount, category, description, txn_date, account_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [user_id, amount, category, description, txn_date, account_type]
            );

            res.status(201).json(newTxn.rows[0]);
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Server Error' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}

export default withAuth(handler);
