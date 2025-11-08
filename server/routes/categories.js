const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/categories
// @desc    Get all categories with hierarchy
// @access  Public
router.get('/', async (req, res, next) => {
    try {
        const { level, parentId, all } = req.query;

        let query = { isActive: true };

        // If 'all' parameter is present, return all categories
        if (all === 'true') {
            const categories = await Category.find(query)
                .populate('parentCategory', 'name slug')
                .sort({ level: 1, order: 1, name: 1 })
                .lean();

            return res.status(200).json({
                success: true,
                count: categories.length,
                categories,
            });
        }

        if (level) {
            query.level = level;
        }

        if (parentId) {
            query.parentCategory = parentId;
        } else if (!level) {
            // Get only root categories if no level or parent specified
            query.parentCategory = null;
        }

        const categories = await Category.find(query)
            .populate({
                path: 'subcategories',
                match: { isActive: true },
                populate: {
                    path: 'subcategories',
                    match: { isActive: true },
                },
            })
            .sort({ order: 1, name: 1 })
            .lean();

        res.status(200).json({
            success: true,
            count: categories.length,
            categories,
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/categories/tree
// @desc    Get complete category tree
// @access  Public
router.get('/tree', async (req, res, next) => {
    try {
        const buildTree = async (parentId = null) => {
            const categories = await Category.find({
                parentCategory: parentId,
                isActive: true,
            })
                .sort({ order: 1, name: 1 })
                .lean();

            const tree = [];

            for (const category of categories) {
                const children = await buildTree(category._id);
                tree.push({
                    ...category,
                    children: children.length > 0 ? children : undefined,
                });
            }

            return tree;
        };

        const tree = await buildTree();

        res.status(200).json({
            success: true,
            categories: tree,
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/categories/:slug
// @desc    Get single category by slug
// @access  Public
router.get('/:slug', async (req, res, next) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug })
            .populate({
                path: 'subcategories',
                match: { isActive: true },
            })
            .populate('parentCategory', 'name slug')
            .lean();

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        res.status(200).json({
            success: true,
            category,
        });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/categories
// @desc    Create a new category (Admin only)
// @access  Private/Admin
router.post('/', protect, admin, async (req, res, next) => {
    try {
        const { name, parentCategory, icon, image, description } = req.body;

        // Calculate level based on parent
        let level = 1;
        if (parentCategory) {
            const parent = await Category.findById(parentCategory);
            if (parent) {
                level = parent.level + 1;
            }
        }

        const category = await Category.create({
            name,
            parentCategory: parentCategory || null,
            icon,
            image,
            description,
            level,
        });

        res.status(201).json({
            success: true,
            category,
        });
    } catch (error) {
        next(error);
    }
});

// @route   PUT /api/categories/:id
// @desc    Update a category (Admin only)
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res, next) => {
    try {
        let category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        // If parent is being changed, recalculate level
        if (req.body.parentCategory && req.body.parentCategory !== category.parentCategory) {
            const parent = await Category.findById(req.body.parentCategory);
            if (parent) {
                req.body.level = parent.level + 1;
            }
        }

        category = await Category.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            category,
        });
    } catch (error) {
        next(error);
    }
});

// @route   DELETE /api/categories/:id
// @desc    Delete a category (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        // Check if category has subcategories
        const hasSubcategories = await Category.findOne({ parentCategory: req.params.id });
        if (hasSubcategories) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete category with subcategories',
            });
        }

        await category.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
