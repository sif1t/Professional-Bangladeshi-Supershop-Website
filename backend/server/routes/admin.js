const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const Order = require('../models/Order');
const User = require('../models/User');

/**
 * @route   GET /api/admin/manual-payments
 * @desc    Get all manual payment orders
 * @access  Admin
 */
router.get('/manual-payments', protect, admin, async (req, res) => {
    try {
        const { status } = req.query;

        let query = {};

        // Filter by verification status
        if (status && status !== 'all') {
            if (status === 'pending') {
                query['manualPayment.verificationStatus'] = 'pending';
            } else if (status === 'approved') {
                query['manualPayment.verificationStatus'] = 'approved';
            } else if (status === 'rejected') {
                query['manualPayment.verificationStatus'] = 'rejected';
            }
        }

        const orders = await Order.find(query)
            .populate('user', 'name email mobile')
            .sort({ createdAt: -1 })
            .limit(100);

        res.json({
            success: true,
            orders,
            count: orders.length,
        });
    } catch (error) {
        console.error('Error fetching manual payment orders:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch orders',
        });
    }
});

/**
 * @route   GET /api/admin/manual-payments/:orderId
 * @desc    Get single manual payment order details
 * @access  Admin
 */
router.get('/manual-payments/:orderId', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId)
            .populate('user', 'name email mobile')
            .populate('items.product');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        res.json({
            success: true,
            order,
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch order',
        });
    }
});

/**
 * @route   POST /api/admin/manual-payments/:orderId/approve
 * @desc    Approve manual payment
 * @access  Admin
 */
router.post('/manual-payments/:orderId/approve', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        // Update order status
        order.manualPayment = {
            ...order.manualPayment,
            verificationStatus: 'approved',
            verifiedBy: req.user._id,
            verifiedAt: new Date(),
        };
        order.paymentStatus = 'paid';
        order.status = 'confirmed';

        await order.save();

        // TODO: Send notification to customer (email/SMS)

        res.json({
            success: true,
            message: 'Payment approved successfully',
            order,
        });
    } catch (error) {
        console.error('Error approving payment:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to approve payment',
        });
    }
});

/**
 * @route   POST /api/admin/manual-payments/:orderId/reject
 * @desc    Reject manual payment
 * @access  Admin
 */
router.post('/manual-payments/:orderId/reject', protect, admin, async (req, res) => {
    try {
        const { reason } = req.body;
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        // Update order status
        order.manualPayment = {
            ...order.manualPayment,
            verificationStatus: 'rejected',
            rejectionReason: reason || 'Payment verification failed',
            verifiedBy: req.user._id,
            verifiedAt: new Date(),
        };
        order.paymentStatus = 'failed';
        order.status = 'cancelled';

        await order.save();

        // TODO: Send notification to customer (email/SMS)

        res.json({
            success: true,
            message: 'Payment rejected',
            order,
        });
    } catch (error) {
        console.error('Error rejecting payment:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to reject payment',
        });
    }
});

/**
 * @route   GET /api/admin/manual-payments/stats
 * @desc    Get manual payment statistics
 * @access  Admin
 */
router.get('/stats', protect, admin, async (req, res) => {
    try {
        const pending = await Order.countDocuments({
            'manualPayment.verificationStatus': 'pending',
        });

        const approved = await Order.countDocuments({
            'manualPayment.verificationStatus': 'approved',
        });

        const rejected = await Order.countDocuments({
            'manualPayment.verificationStatus': 'rejected',
        });

        const totalRevenue = await Order.aggregate([
            {
                $match: {
                    'manualPayment.verificationStatus': 'approved',
                    paymentStatus: 'paid',
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$totalAmount' },
                },
            },
        ]);

        res.json({
            success: true,
            stats: {
                pending,
                approved,
                rejected,
                total: pending + approved + rejected,
                revenue: totalRevenue[0]?.total || 0,
            },
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch statistics',
        });
    }
});

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with filters
 * @access  Admin
 */
router.get('/users', protect, admin, async (req, res) => {
    try {
        const { role, verified, search, page = 1, limit = 50 } = req.query;

        let query = {};

        // Filter by role
        if (role && role !== 'all') {
            query.role = role;
        }

        // Filter by verification status
        if (verified === 'true') {
            query.emailVerified = true;
            query.mobileVerified = true;
        } else if (verified === 'false') {
            query.$or = [
                { emailVerified: false },
                { mobileVerified: false }
            ];
        }

        // Search by name, email, or mobile
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { mobile: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const users = await User.find(query)
            .select('-password -emailOTP -mobileOTP -otpExpires')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await User.countDocuments(query);

        res.json({
            success: true,
            users,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch users'
        });
    }
});

/**
 * @route   GET /api/admin/users/stats/overview
 * @desc    Get user statistics
 * @access  Admin
 */
router.get('/users/stats/overview', protect, admin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const adminUsers = await User.countDocuments({ role: 'admin' });
        const normalUsers = await User.countDocuments({ role: 'user' });
        const verifiedUsers = await User.countDocuments({
            emailVerified: true,
            mobileVerified: true
        });
        const unverifiedUsers = await User.countDocuments({
            $or: [
                { emailVerified: false },
                { mobileVerified: false }
            ]
        });

        // New users in last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const newUsers = await User.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        res.json({
            success: true,
            stats: {
                total: totalUsers,
                admins: adminUsers,
                normalUsers: normalUsers,
                verified: verifiedUsers,
                unverified: unverifiedUsers,
                newInLast7Days: newUsers
            }
        });
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch user statistics'
        });
    }
});

/**
 * @route   GET /api/admin/users/:id
 * @desc    Get single user details
 * @access  Admin
 */
router.get('/users/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password -emailOTP -mobileOTP -otpExpires');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get user's order statistics
        const orderStats = await Order.aggregate([
            { $match: { user: user._id } },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalSpent: { $sum: '$totalAmount' },
                    completedOrders: {
                        $sum: { $cond: [{ $eq: ['$status', 'Delivered'] }, 1, 0] }
                    }
                }
            }
        ]);

        const stats = orderStats[0] || {
            totalOrders: 0,
            totalSpent: 0,
            completedOrders: 0
        };

        res.json({
            success: true,
            user: {
                ...user.toObject(),
                orderStats: stats
            }
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch user'
        });
    }
});

/**
 * @route   PUT /api/admin/users/:id/role
 * @desc    Update user role (admin/user)
 * @access  Admin
 */
router.put('/users/:id/role', protect, admin, async (req, res) => {
    try {
        const { role } = req.body;

        if (!role || !['user', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be "user" or "admin"'
            });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent admin from demoting themselves
        if (user._id.toString() === req.user._id.toString() && role === 'user') {
            return res.status(400).json({
                success: false,
                message: 'You cannot demote yourself from admin'
            });
        }

        user.role = role;
        await user.save();

        res.json({
            success: true,
            message: `User role updated to ${role} successfully`,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update user role'
        });
    }
});

/**
 * @route   PUT /api/admin/users/:id/verification
 * @desc    Manually verify user email/mobile
 * @access  Admin
 */
router.put('/users/:id/verification', protect, admin, async (req, res) => {
    try {
        const { emailVerified, mobileVerified } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (emailVerified !== undefined) {
            user.emailVerified = emailVerified;
        }

        if (mobileVerified !== undefined) {
            user.mobileVerified = mobileVerified;
        }

        await user.save();

        res.json({
            success: true,
            message: 'User verification status updated successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                emailVerified: user.emailVerified,
                mobileVerified: user.mobileVerified
            }
        });
    } catch (error) {
        console.error('Error updating verification:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update verification status'
        });
    }
});

/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete user account
 * @access  Admin
 */
router.delete('/users/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent admin from deleting themselves
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own account'
            });
        }

        await User.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete user'
        });
    }
});

module.exports = router;
