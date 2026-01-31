import pool from '../../../lib/db';
import { withAuth } from '../../../lib/authorize';

async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { month } = req.query;
        const user_id = req.user.id;

        if (!month) {
            return res.status(400).json({ error: 'Month parameter is required' });
        }

        const dbMonth = month.length === 7 ? `${month}-01` : month;

        const budgetRes = await pool.query(
            'SELECT * FROM budgets WHERE user_id = $1 AND month = $2',
            [user_id, dbMonth]
        );

        if (budgetRes.rows.length === 0) {
            return res.json({ notSet: true });
        }

        const budget = budgetRes.rows[0];
        const totalBudget = Number(budget.monthly_budget);

        const startDate = new Date(dbMonth);
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 1);
        const endDateStr = endDate.toISOString().split('T')[0];

        const spentRes = await pool.query(
            `SELECT SUM(amount) as total FROM transactions 
             WHERE user_id = $1 AND txn_date >= $2 AND txn_date < $3`,
            [user_id, dbMonth, endDateStr]
        );

        const totalSpent = Number(spentRes.rows[0].total) || 0;
        const remaining = totalBudget - totalSpent;

        let alert = null;
        let alertLevel = 'none';

        if (totalSpent >= 0.9 * totalBudget) {
            alert = "⚠️ Budget almost exhausted! You have spent over 90%.";
            alertLevel = 'danger';
        } else if (totalSpent >= 0.7 * totalBudget) {
            alert = "⚠️ You're crossing safe spending (70% used).";
            alertLevel = 'warning';
        }

        res.json({
            monthly_budget: totalBudget,
            savings_target: Number(budget.savings_target),
            total_spent: totalSpent,
            remaining: remaining,
            alert,
            alert_level: alertLevel
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server Error' });
    }
}

export default withAuth(handler);
