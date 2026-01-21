const router = require('express').Router();
const pool = require('../db');
const authorize = require('../middleware/authorize');

// POST /api/transactions
// Secured: Any user can add, but we record THEIR user_id
router.post('/', authorize, async (req, res) => {
    try {
        const { amount, category, description, txn_date, account_type } = req.body;
        const user_id = req.user.id; // From token

        // Validation
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
});

// GET /api/transactions
// Secured Logic:
// - If public: Show ALL public transactions (global)
// - If private: Show ONLY requesting user's private transactions
router.get('/', authorize, async (req, res) => {
    try {
        const { type } = req.query;
        const user_id = req.user.id; // From token

        if (!type || !['public', 'private'].includes(type)) {
            return res.status(400).json({ error: 'Invalid or missing type parameter' });
        }

        let query, params;

        if (type === 'private') {
            // PRIVATE: Strict ownership check
            query = 'SELECT * FROM transactions WHERE account_type = $1 AND user_id = $2 ORDER BY txn_date DESC';
            params = ['private', user_id];
        } else {
            // PUBLIC: Visible to ONLY the user (Personal Public)
            // Requirement update: User expects TOTAL isolation.
            query = 'SELECT * FROM transactions WHERE account_type = $1 AND user_id = $2 ORDER BY txn_date DESC';
            params = ['public', user_id];
        }

        const result = await pool.query(query, params);

        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

// DELETE /api/transactions/:id
router.delete('/:id', authorize, async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;
        console.log(`[DELETE] Attempting to delete txn ${id} for user ${user_id}`);

        // 1. Check existence
        const checkTxn = await pool.query('SELECT * FROM transactions WHERE id = $1', [id]);

        if (checkTxn.rows.length === 0) {
            console.log('[DELETE] Failed: ID not found in DB');
            return res.status(404).json({ error: 'Transaction not found' });
        }

        const txn = checkTxn.rows[0];
        console.log(`[DELETE] Found Txn: UserID=${txn.user_id} (${typeof txn.user_id}), ReqUser=${user_id} (${typeof user_id})`);

        // 2. Check ownership
        // Use loose equality (==) to handle string vs number differences
        if (txn.user_id != user_id) {
            console.log(`[DELETE] Failed: Ownership mismatch.`);
            return res.status(403).json({ error: 'Unauthorized: You do not own this transaction' });
        }

        // 3. Delete
        const deleteOp = await pool.query('DELETE FROM transactions WHERE id = $1', [id]);
        console.log('[DELETE] Success, rows deleted:', deleteOp.rowCount);

        res.json({ message: 'Transaction deleted' });
    } catch (err) {
        console.error('[DELETE] Server Error:', err.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router;
