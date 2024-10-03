const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication token missing or invalid' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY); // Use your JWT secret key
        req.user = decoded; // Attach the user object (or just the user ID) to the request
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
