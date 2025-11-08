const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/products
// @desc    Get all products with filtering, sorting, and pagination
// @access  Public
router.get('/', async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 20,
            category,
            brand,
            minPrice,
            maxPrice,
            onSale,
            isFeatured,
            isNewArrival,
            isBestSaving,
            isBuyGetFree,
            sort = '-createdAt',
            search,
        } = req.query;

        // Build query
        const query = { isActive: true };

        if (category) query.category = category;
        if (brand) query.brand = new RegExp(brand, 'i');
        if (onSale) query.onSale = onSale === 'true';
        if (isFeatured) query.isFeatured = isFeatured === 'true';
        if (isNewArrival) query.isNewArrival = isNewArrival === 'true';
        if (isBestSaving) query.isBestSaving = isBestSaving === 'true';
        if (isBuyGetFree) query.isBuyGetFree = isBuyGetFree === 'true';

        // Price filter
        if (minPrice || maxPrice) {
            query['variants.price'] = {};
            if (minPrice) query['variants.price'].$gte = Number(minPrice);
            if (maxPrice) query['variants.price'].$lte = Number(maxPrice);
        }

        // Search by name or description
        if (search) {
            query.$text = { $search: search };
        }

        // Execute query
        const products = await Product.find(query)
            .populate('category', 'name slug')
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        // Count total documents
        const count = await Product.countDocuments(query);

        res.status(200).json({
            success: true,
            count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            products,
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/products/search
// @desc    Search products by name
// @access  Public
router.get('/search', async (req, res, next) => {
    try {
        const { q, limit = 10 } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a search query',
            });
        }

        const products = await Product.find({
            $text: { $search: q },
            isActive: true,
        })
            .select('name slug images variants brand')
            .limit(limit * 1)
            .lean();

        res.status(200).json({
            success: true,
            count: products.length,
            products,
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/products/:slug
// @desc    Get single product by slug
// @access  Public
router.get('/:slug', async (req, res, next) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug })
            .populate('category', 'name slug')
            .lean();

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Increment views
        await Product.findByIdAndUpdate(product._id, { $inc: { views: 1 } });

        res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/products/related/:productId
// @desc    Get related products
// @access  Public
router.get('/related/:productId', async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        const relatedProducts = await Product.find({
            category: product.category,
            _id: { $ne: product._id },
            isActive: true,
        })
            .limit(8)
            .select('name slug images variants brand onSale')
            .lean();

        res.status(200).json({
            success: true,
            products: relatedProducts,
        });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/products
// @desc    Create a new product (Admin only)
// @access  Private/Admin
router.post('/', protect, admin, async (req, res, next) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            product,
        });
    } catch (error) {
        next(error);
    }
});

// @route   PUT /api/products/:id
// @desc    Update a product (Admin only)
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        next(error);
    }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
