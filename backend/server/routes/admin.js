const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const Order = require('../models/Order');

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

module.exports = router;
