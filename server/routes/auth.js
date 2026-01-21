const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if user exists
        const userExist = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExist.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user
        const newUser = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
            [username, email, hashedPassword]
        );

        res.status(201).json(newUser.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid Email or Password' });
        }

        // Check password
        const validPass = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPass) {
            return res.status(400).json({ error: 'Invalid Email or Password' });
        }

        // Create Token
        const token = jwt.sign(
            { id: user.rows[0].id, email: user.rows[0].email },
            process.env.JWT_SECRET || 'secret_key_123',
            { expiresIn: '1h' }
        );

        res.json({ token, user: { id: user.rows[0].id, username: user.rows[0].username, email: user.rows[0].email } });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server Error' });
    }
});

// POST /api/auth/verify
router.post('/verify', require('../middleware/authorize'), async (req, res) => {
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
});

module.exports = router;
