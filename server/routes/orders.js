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
            shippingAddress,
            contactNumber,
            paymentMethod,
            deliverySlot,
            notes, 
        } = req.body;

        // Validate products
        if (!products || products.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No products in order',
            });
        }

        // Calculate totals
        let subtotal = 0;
        const orderProducts = [];

        for (const item of products) {
            const product = await Product.findById(item.productId);

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
        const deliveryFee = subtotal >= 1000 ? 0 : 50;

        const totalAmount = subtotal + deliveryFee;

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
            deliverySlot,
            notes,
        });

        res.status(201).json({
            success: true,
            order,
        });
    } catch (error) {
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

module.exports = router;
