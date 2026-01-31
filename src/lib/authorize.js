import jwt from 'jsonwebtoken';

export function withAuth(handler) {
    return async (req, res) => {
        console.log(`[Auth Check] Verifying token for: ${req.method} ${req.url}`);

        const token = req.headers.authorization;
        if (!token) {
            console.log('[Auth Check] Failed: No token provided');
            return res.status(401).json({ error: 'Access Denied: No Token Provided' });
        }

        try {
            const tokenString = token.split(' ')[1];
            if (!tokenString) throw new Error('Malformed Token');

            const verified = jwt.verify(tokenString, process.env.JWT_SECRET || 'secret_key_123');
            req.user = verified;

            return handler(req, res);
        } catch (err) {
            console.log('[Auth Check] Failed: Invalid token');
            return res.status(400).json({ error: 'Invalid Token' });
        }
    };
}
