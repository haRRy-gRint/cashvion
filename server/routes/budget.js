const router = require('express').Router();
const pool = require('../db');
const authorize = require('../middleware/authorize');

// POST /api/budget
// Set or Update Budget for a month
router.post('/', authorize, async (req, res) => {
    try {
        const { month, monthly_budget, savings_target } = req.body;
        const user_id = req.user.id;

        // Validation
        if (!month || !monthly_budget) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Upsert logic (Insert or Update on conflict)
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
});

// GET /api/budget/status
// Get status for a specific month
router.get('/status', authorize, async (req, res) => {
    try {
        const { month } = req.query; // YYYY-MM-01 format expected or YYYY-MM
        const user_id = req.user.id;

        if (!month) {
            return res.status(400).json({ error: 'Month parameter is required' });
        }

        // Ensure month is first day of month for DB consistency
        // If frontend sends '2026-01', append '-01'
        const dbMonth = month.length === 7 ? `${month}-01` : month;

        // 1. Get Budget
        const budgetRes = await pool.query(
            'SELECT * FROM budgets WHERE user_id = $1 AND month = $2',
            [user_id, dbMonth]
        );

        if (budgetRes.rows.length === 0) {
            return res.json({ notSet: true }); // No budget set for this month
        }

        const budget = budgetRes.rows[0];
        const totalBudget = Number(budget.monthly_budget);

        // 2. Calculate Total Spent for that month (Private transactions only for now? Or all? 
        // Logic: Budget usually applies to YOUR spending. 
        // We will sum ALL transactions for this user in that month range.

        // Extract Year and Month for range query
        // Start date: dbMonth
        // End date: Next month start
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

        // 3. Alert Logic
        let alert = null;
        let alertLevel = 'none'; // none, warning, danger

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
});

module.exports = router;
