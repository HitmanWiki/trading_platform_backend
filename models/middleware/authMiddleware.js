const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(403).json({ message: 'Access denied' });

    try {
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decodedData.id;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = auth;
