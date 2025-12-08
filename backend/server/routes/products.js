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

        // Handle category filtering - include subcategories
        if (category) {
            const Category = require('../models/Category');
            const categoryDoc = await Category.findById(category);

            if (categoryDoc) {
                // Find all subcategories recursively
                const getAllSubcategoryIds = async (catId) => {
                    const subcats = await Category.find({ parentCategory: catId }).select('_id');
                    let ids = [catId];

                    for (const subcat of subcats) {
                        const subIds = await getAllSubcategoryIds(subcat._id);
                        ids = ids.concat(subIds);
                    }

                    return ids;
                };

                const categoryIds = await getAllSubcategoryIds(category);
                query.category = { $in: categoryIds };
            } else {
                query.category = category;
            }
        }
        if (brand) query.brand = new RegExp(brand, 'i');
        if (onSale) query.onSale = onSale === 'true';
        if (isFeatured) query.isFeatured = isFeatured === 'true';
        if (isNewArrival) query.isNewArrival = isNewArrival === 'true';
        if (isBestSaving) query.isBestSaving = isBestSaving === 'true';
        if (isBuyGetFree) query.isBuyGetFree = isBuyGetFree === 'true';

        // Price filter - handle both variants and direct price
        if (minPrice || maxPrice) {
            const priceQuery = { $or: [] };

            // Check direct price field
            const directPriceCondition = {};
            if (minPrice) directPriceCondition.$gte = Number(minPrice);
            if (maxPrice) directPriceCondition.$lte = Number(maxPrice);
            if (Object.keys(directPriceCondition).length > 0) {
                priceQuery.$or.push({ price: directPriceCondition });
            }

            // Check variants price field
            const variantPriceCondition = {};
            if (minPrice) variantPriceCondition.$gte = Number(minPrice);
            if (maxPrice) variantPriceCondition.$lte = Number(maxPrice);
            if (Object.keys(variantPriceCondition).length > 0) {
                priceQuery.$or.push({ 'variants.price': variantPriceCondition });
            }

            if (priceQuery.$or.length > 0) {
                Object.assign(query, priceQuery);
            }
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
// @desc    Search products by name (autocomplete)
// @access  Public
router.get('/search', async (req, res, next) => {
    try {
        const { q, limit = 10 } = req.query;

        if (!q || q.trim().length < 2) {
            return res.status(200).json({
                success: true,
                count: 0,
                products: [],
            });
        }

        // Create regex for case-insensitive partial matching
        const searchRegex = new RegExp(q.trim().split(' ').join('|'), 'i');

        // Search in name, description, brand
        const products = await Product.find({
            isActive: true,
            $or: [
                { name: searchRegex },
                { description: searchRegex },
                { brand: searchRegex }
            ]
        })
            .select('name slug images price originalPrice stock category brand')
            .populate('category', 'name')
            .sort({ isFeatured: -1, createdAt: -1 }) // Prioritize featured products
            .limit(parseInt(limit))
            .lean();

        res.status(200).json({
            success: true,
            count: products.length,
            products,
        });
    } catch (error) {
        console.error('Search error:', error);
        next(error);
    }
});

// @route   GET /api/products/:slugOrId
// @desc    Get single product by slug or ID
// @access  Public
router.get('/:slugOrId', async (req, res, next) => {
    try {
        const { slugOrId } = req.params;
        let product;

        // Check if it's a valid MongoDB ObjectId (24 hex characters)
        if (slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
            // It's an ID, fetch by ID
            product = await Product.findById(slugOrId)
                .populate('category', 'name slug parentCategory')
                .lean();
        } else {
            // It's a slug, fetch by slug
            product = await Product.findOne({ slug: slugOrId })
                .populate('category', 'name slug parentCategory')
                .lean();
        }

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Increment views (only for slug-based lookups, not admin ID lookups)
        if (!slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
            await Product.findByIdAndUpdate(product._id, { $inc: { views: 1 } });
        }

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
            data: product,
        });
    } catch (error) {
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', '),
            });
        }
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'A product with this name already exists',
            });
        }
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
