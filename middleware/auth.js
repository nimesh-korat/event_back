const jwt = require('jsonwebtoken');
const secretKey = 'your-secret-key';

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Authentication failed, try again' });
        }
        const decodedToken = jwt.verify(token, secretKey);

        req.userData = { decodedToken };
        // console.log(req.userData);
        next();
    } catch (error) {
        console.log(error.message);
        return res.status(401).json({ error: 'Authentication failed, try again' });
    }
};