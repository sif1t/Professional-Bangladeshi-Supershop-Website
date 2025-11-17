const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Order = require('../models/Order');
const {
    bKashPayment,
    nagadPayment,
    rocketPayment,
    sslCommerzPayment,
    cashOnDelivery,
} = require('../lib/paymentGateway');

/**
 * @route   POST /api/payment/initialize
 * @desc    Initialize payment for an order
 * @access  Private
 */
router.post('/initialize', protect, async (req, res) => {
    try {
        const {
            orderId,
            paymentMethod,
            amount,
            customerName,
            customerEmail,
            customerMobile,
            customerAddress,
            customerCity,
            customerPostcode,
        } = req.body;

        // Find order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Check if order belongs to user
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const paymentData = {
            orderId: order._id.toString(),
            amount: amount || order.totalAmount,
            customerName: customerName || req.user.name,
            customerEmail: customerEmail || req.user.email,
            customerMobile: customerMobile || req.user.mobile,
            customerAddress: customerAddress || order.shippingAddress.addressLine1,
            customerCity: customerCity || order.shippingAddress.city,
            customerPostcode: customerPostcode || order.shippingAddress.zipCode,
        };

        let paymentResult;

        switch (paymentMethod) {
            case 'bKash':
                paymentResult = await bKashPayment.initiatePayment(paymentData);
                break;

            case 'Nagad':
                paymentResult = await nagadPayment.initiatePayment(paymentData);
                break;

            case 'Rocket':
                paymentResult = await rocketPayment.initiatePayment(paymentData);
                break;

            case 'Credit/Debit Card':
                paymentResult = await sslCommerzPayment.initiatePayment(paymentData);
                break;

            case 'Cash on Delivery':
                paymentResult = await cashOnDelivery.processOrder(paymentData);
                // Update order status for COD
                order.paymentMethod = 'Cash on Delivery';
                order.paymentStatus = 'cod_pending';
                order.status = 'confirmed';
                await order.save();
                break;

            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid payment method',
                });
        }

        if (!paymentResult.success) {
            return res.status(400).json({
                success: false,
                message: paymentResult.error || 'Payment initialization failed',
            });
        }

        // Update order with payment info
        order.paymentMethod = paymentMethod;
        order.paymentInfo = {
            paymentId: paymentResult.paymentID || paymentResult.sessionKey || paymentResult.transactionId,
            initiatedAt: new Date(),
        };
        await order.save();

        res.json({
            success: true,
            paymentResult,
            orderId: order._id,
        });
    } catch (error) {
        console.error('Payment Initialization Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Payment initialization failed',
        });
    }
});

/**
 * @route   POST /api/payment/bkash/execute
 * @desc    Execute bKash payment after user approval
 * @access  Public
 */
router.post('/bkash/execute', async (req, res) => {
    try {
        const { paymentID, status } = req.body;

        if (status === 'cancel' || status === 'failure') {
            return res.json({
                success: false,
                message: 'Payment was cancelled or failed',
            });
        }

        // Execute payment
        const result = await bKashPayment.executePayment(paymentID);

        if (result.success) {
            // Find and update order
            const order = await Order.findOne({ 'paymentInfo.paymentId': paymentID });

            if (order) {
                order.paymentStatus = 'paid';
                order.status = 'confirmed';
                order.paymentInfo.transactionId = result.transactionID;
                order.paymentInfo.paidAt = new Date();
                order.paymentInfo.amount = result.amount;
                await order.save();
            }

            res.json({
                success: true,
                orderId: order._id,
                transactionID: result.transactionID,
                message: 'Payment successful',
            });
        } else {
            res.status(400).json({
                success: false,
                message: result.error || 'Payment execution failed',
            });
        }
    } catch (error) {
        console.error('bKash Execute Error:', error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

/**
 * @route   POST /api/payment/nagad/callback
 * @desc    Handle Nagad payment callback
 * @access  Public
 */
router.post('/nagad/callback', async (req, res) => {
    try {
        const { payment_ref_id, status, order_id } = req.body;

        if (status === 'Success') {
            // Verify payment
            const verification = await nagadPayment.verifyPayment(payment_ref_id);

            if (verification.success) {
                // Update order
                const order = await Order.findById(order_id);
                if (order) {
                    order.paymentStatus = 'paid';
                    order.status = 'confirmed';
                    order.paymentInfo.transactionId = verification.transactionId;
                    order.paymentInfo.paidAt = new Date();
                    await order.save();
                }

                return res.redirect(
                    `/payment/success?orderId=${order_id}&transactionId=${verification.transactionId}&amount=${verification.amount}&paymentMethod=Nagad`
                );
            }
        }

        res.redirect(`/payment/fail?orderId=${order_id}&reason=Payment verification failed`);
    } catch (error) {
        console.error('Nagad Callback Error:', error);
        res.redirect(`/payment/fail?reason=${error.message}`);
    }
});

/**
 * @route   POST /api/payment/ssl-commerz/ipn
 * @desc    Handle SSL Commerz IPN (Instant Payment Notification)
 * @access  Public
 */
router.post('/ipn', async (req, res) => {
    try {
        const { val_id, tran_id, status, amount, card_type, store_amount } = req.body;

        if (status === 'VALID' || status === 'VALIDATED') {
            // Validate with SSL Commerz
            const validation = await sslCommerzPayment.validatePayment(val_id);

            if (validation.success) {
                // Update order
                const order = await Order.findOne({ 'paymentInfo.paymentId': tran_id });

                if (order) {
                    order.paymentStatus = 'paid';
                    order.status = 'confirmed';
                    order.paymentInfo.transactionId = validation.bankTransactionId;
                    order.paymentInfo.cardType = validation.cardType;
                    order.paymentInfo.paidAt = new Date();
                    await order.save();
                }
            }
        }

        res.send('OK');
    } catch (error) {
        console.error('SSL Commerz IPN Error:', error);
        res.status(500).send('ERROR');
    }
});

/**
 * @route   POST /api/payment/verify
 * @desc    Verify payment status
 * @access  Private
 */
router.post('/verify', protect, async (req, res) => {
    try {
        const { orderId } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Check authorization
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        res.json({
            success: true,
            paymentStatus: order.paymentStatus,
            paymentMethod: order.paymentMethod,
            paymentInfo: order.paymentInfo,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

/**
 * @route   POST /api/payment/cod/confirm
 * @desc    Confirm cash on delivery payment (by delivery person)
 * @access  Private (delivery person/admin)
 */
router.post('/cod/confirm', protect, async (req, res) => {
    try {
        const { orderId, collectedAmount } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Only admin or assigned delivery person can confirm
        if (req.user.role !== 'admin' && order.deliveryPerson?.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        order.paymentStatus = 'paid';
        order.status = 'delivered';
        order.paymentInfo = {
            ...order.paymentInfo,
            collectedAmount,
            collectedBy: req.user._id,
            collectedAt: new Date(),
        };
        order.deliveredAt = new Date();
        await order.save();

        res.json({
            success: true,
            message: 'COD payment confirmed',
            order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router;
