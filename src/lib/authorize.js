import jwt from 'jsonwebtoken';

export function withAuth(handler) {
    return async (req, res) => {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ error: 'Access Denied: No Token Provided' });
        }

        try {
            const tokenString = token.split(' ')[1];
            if (!tokenString) throw new Error('Malformed Token');

            const verified = jwt.verify(tokenString, process.env.JWT_SECRET || 'secret_key_123');
            req.user = verified;

            return handler(req, res);
        } catch (err) {
            return res.status(400).json({ error: 'Invalid Token' });
        }
    };
}
