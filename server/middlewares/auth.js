//authentication middleware - checks if its valid token in the cookies

const { decodeToken } = require('../utils/token');

module.exports = function (req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ errors: [{ msg: 'Access denied' }] });
    }
    const payload = decodeToken(token);
    if (payload) {
        req.userId = payload.user.id;
        next();
    } else {
        res.status(401).json({ errors: [{ msg: 'Invalid token' }] });
    }
}