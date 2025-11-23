const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private
router.post('/', protect, async (req, res, next) => {
    try {
        const {
            products,
            items, // For manual checkout compatibility
            shippingAddress,
            contactNumber,
            paymentMethod,
            deliverySlot,
            notes,
        } = req.body;

        // Support both 'products' and 'items' fields
        const orderItems = products || items;

        // Validate products
        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No products in order',
            });
        }

        // Calculate totals
        let subtotal = 0;
        const orderProducts = [];

        for (const item of orderItems) {
            const productId = item.productId || item.product;
            const product = await Product.findById(productId);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product not found: ${item.productId}`,
                });
            }

            // Handle both variant-based and simple products
            let variant;
            let price;
            let stock;

            if (product.variants && product.variants.length > 0) {
                // Product has variants
                variant = product.variants.find(v => v.name === item.variant);
                if (!variant) {
                    return res.status(400).json({
                        success: false,
                        message: `Variant not found: ${item.variant}`,
                    });
                }
                price = variant.salePrice || variant.price;
                stock = variant.stock;
            } else {
                // Simple product without variants
                price = product.salePrice || product.price;
                stock = product.stock;
                variant = {
                    name: product.unit || 'piece',
                    price: product.price,
                    stock: product.stock
                };
            }

            // Check stock
            if (stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}`,
                });
            }

            subtotal += price * item.quantity;

            orderProducts.push({
                productId: product._id,
                name: product.name,
                image: product.images[0] || '',
                variant: item.variant || product.unit || 'piece',
                quantity: item.quantity,
                price: price,
            });

            // Reduce stock
            if (product.variants && product.variants.length > 0) {
                variant.stock -= item.quantity;
            } else {
                product.stock -= item.quantity;
            }
            await product.save();
        }

        // Calculate delivery fee (can be based on area or order amount)
        const deliveryFee = req.body.deliveryFee || (subtotal >= 1000 ? 0 : 50);

        const totalAmount = req.body.totalAmount || (subtotal + deliveryFee);

        // Create order
        const order = await Order.create({
            user: req.user.id,
            products: orderProducts,
            shippingAddress,
            contactNumber,
            subtotal,
            deliveryFee,
            totalAmount,
            paymentMethod,
            paymentStatus: req.body.paymentStatus || 'Pending',
            status: req.body.status || 'Pending',
            deliverySlot: deliverySlot || 'Standard Delivery',
            notes,
            customerName: req.body.customerName || req.user.name,
            deliveryLocation: req.body.deliveryLocation,
            manualPayment: req.body.manualPayment || null,
        });

        res.status(201).json({
            success: true,
            order,
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/orders/track
// @desc    Track order by order number (Authenticated - User can only see their own orders)
// @access  Private
router.get('/track', protect, async (req, res, next) => {
    try {
        const { orderNumber, phone } = req.query;

        if (!orderNumber && !phone) {
            return res.status(400).json({
                success: false,
                message: 'Please provide either order number or phone number',
            });
        }

        // Get the user's information
        const User = require('../models/User');
        const user = await User.findById(req.user.id).select('mobile');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found',
            });
        }

        // Build query - SECURITY: Only show orders that belong to the authenticated user
        const query = {
            user: req.user.id, // MUST be the logged-in user's ID
        };

        // Additionally filter by order number or phone if provided
        if (orderNumber) {
            query.orderNumber = orderNumber.trim();
        }

        // SECURITY CHECK: If phone is provided, verify it matches the user's registered phone
        if (phone) {
            const phoneToCheck = phone.trim();

            // Check if the provided phone matches the user's registered mobile number
            if (phoneToCheck !== user.mobile) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only track orders placed with your registered phone number',
                });
            }

            query.contactNumber = phoneToCheck;
        }

        // Find orders matching the criteria
        const orders = await Order.find(query)
            .populate('user', 'name mobile')
            .sort('-createdAt')
            .limit(10) // Limit to most recent 10 orders
            .lean();

        if (!orders || orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No orders found with the provided information',
            });
        }

        res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        });
    } catch (error) {
        console.error('Track order error:', error);
        next(error);
    }
});

// @route   GET /api/orders/my-orders
// @desc    Get logged in user's orders
// @access  Private
router.get('/my-orders', protect, async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status } = req.query;

        const query = { user: req.user.id };
        if (status) query.status = status;

        const orders = await Order.find(query)
            .sort('-createdAt')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const count = await Order.countDocuments(query);

        res.status(200).json({
            success: true,
            count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            orders,
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name mobile')
            .populate('products.productId', 'name slug images')
            .lean();

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        // Make sure user is authorized
        if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this order',
            });
        }

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/orders
// @desc    Get all orders (Admin only)
// @access  Private/Admin
router.get('/', protect, admin, async (req, res, next) => {
    try {
        const { page = 1, limit = 20, status } = req.query;

        const query = {};
        if (status) query.status = status;

        const orders = await Order.find(query)
            .populate('user', 'name mobile')
            .sort('-createdAt')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const count = await Order.countDocuments(query);

        res.status(200).json({
            success: true,
            count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            orders,
        });
    } catch (error) {
        next(error);
    }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Admin only)
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res, next) => {
    try {
        const { status, note } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        order.status = status;
        if (note) {
            order.statusHistory.push({ status, note });
        }

        await order.save();

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        next(error);
    }
});

// @route   PUT /api/orders/:id/payment
// @desc    Update payment status
// @access  Private/Admin
router.put('/:id/payment', protect, admin, async (req, res, next) => {
    try {
        const { paymentStatus, transactionId } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        order.paymentStatus = paymentStatus;
        if (transactionId) order.transactionId = transactionId;

        await order.save();

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        next(error);
    }
});

// @route   DELETE /api/orders/:id
// @desc    Delete order (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        // Delete the order
        await Order.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Order deleted successfully',
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
