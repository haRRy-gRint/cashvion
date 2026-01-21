const jwt = require('jsonwebtoken');
require('dotenv').config();

const authorize = (req, res, next) => {
    // 1. Check for token in header (Bearer token)
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Access Denied: No Token Provided' });
    }

    try {
        // Remove 'Bearer ' prefix
        const tokenString = token.split(' ')[1];
        if (!tokenString) throw new Error('Malformed Token');

        // 2. Verify token
        const verified = jwt.verify(tokenString, process.env.JWT_SECRET || 'secret_key_123');

        // 3. Attach user to request
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid Token' });
    }
};

module.exports = authorize;
