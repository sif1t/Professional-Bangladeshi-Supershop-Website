const jwt = require('jsonwebtoken');

// Generate JWT token
exports.generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d',
    });
};

// Send token response
exports.sendTokenResponse = (user, statusCode, res) => {
    // Create token with role
    const token = this.generateToken(user._id, user.role);

    const options = {
        expires: new Date(
            Date.now() + (process.env.JWT_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    };

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        user: {
            _id: user._id,
            name: user.name,
            mobile: user.mobile,
            addresses: user.addresses,
            role: user.role,
        },
    });
};

// Verify token
exports.verifyToken = (token) => {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
};

// Check if user is authenticated
exports.isAuthenticated = (req, res, next) => {
    const token = req.cookies.token || req.header('Authorization').split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const payload = this.verifyToken(token);

    if (!payload) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = payload;
    next();
};
