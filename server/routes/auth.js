const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { sendTokenResponse } = require('../utils/auth');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res, next) => {
    try {
        const { name, mobile, password } = req.body;

        // Validate input
        if (!name || !mobile || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields',
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ mobile });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Mobile number already registered',
            });
        }

        // Create user
        const user = await User.create({
            name,
            mobile,
            password,
        });

        // Send token response
        sendTokenResponse(user, 201, res);
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res, next) => {
    try {
        const { mobile, password } = req.body;

        // Validate input
        if (!mobile || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide mobile number and password',
            });
        }

        // Check for user (include password field)
        const user = await User.findOne({ mobile }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Check if password matches
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Your account has been deactivated',
            });
        }

        // Send token response
        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', protect, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                mobile: user.mobile,
                addresses: user.addresses,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/auth/logout
// @desc    Logout user / clear cookie
// @access  Private
router.post('/logout', protect, async (req, res, next) => {
    try {
        res.cookie('token', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true,
        });

        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        next(error);
    }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res, next) => {
    try {
        const { name } = req.body;

        const user = await User.findById(req.user.id);

        if (name) user.name = name;

        await user.save();

        res.status(200).json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                mobile: user.mobile,
                addresses: user.addresses,
                role: user.role,
            },
        });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/auth/address
// @desc    Add a new address
// @access  Private
router.post('/address', protect, async (req, res, next) => {
    try {
        const { addressLine1, addressLine2, city, area, zipCode, isDefault } = req.body;

        const user = await User.findById(req.user.id);

        // If this is set as default, set all others to false
        if (isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        user.addresses.push({
            addressLine1,
            addressLine2,
            city,
            area,
            zipCode,
            isDefault: isDefault || user.addresses.length === 0,
        });

        await user.save();

        res.status(201).json({
            success: true,
            addresses: user.addresses,
        });
    } catch (error) {
        next(error);
    }
});

// @route   PUT /api/auth/address/:addressId
// @desc    Update an address
// @access  Private
router.put('/address/:addressId', protect, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const address = user.addresses.id(req.params.addressId);

        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found',
            });
        }

        // If this is set as default, set all others to false
        if (req.body.isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        Object.assign(address, req.body);
        await user.save();

        res.status(200).json({
            success: true,
            addresses: user.addresses,
        });
    } catch (error) {
        next(error);
    }
});

// @route   DELETE /api/auth/address/:addressId
// @desc    Delete an address
// @access  Private
router.delete('/address/:addressId', protect, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        user.addresses = user.addresses.filter(
            addr => addr._id.toString() !== req.params.addressId
        );

        await user.save();

        res.status(200).json({
            success: true,
            addresses: user.addresses,
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
