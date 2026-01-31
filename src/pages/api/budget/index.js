import pool from '../../../lib/db';
import { withAuth } from '../../../lib/authorize';

async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { month, monthly_budget, savings_target } = req.body;
        const user_id = req.user.id;

        if (!month || !monthly_budget) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const query = `
            INSERT INTO budgets (user_id, month, monthly_budget, savings_target)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (user_id, month)
            DO UPDATE SET monthly_budget = EXCLUDED.monthly_budget, savings_target = EXCLUDED.savings_target
            RETURNING *;
        `;

        const result = await pool.query(query, [user_id, month, monthly_budget, savings_target || 0]);
        res.json(result.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server Error' });
    }
}

export default withAuth(handler);
