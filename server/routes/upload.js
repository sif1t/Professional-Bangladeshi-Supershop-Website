const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for payment screenshots
const paymentStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../../public/uploads/payments');

        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'payment-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Configure multer for product images
const productStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../../public/uploads/products');

        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'));
    }
};

const paymentUpload = multer({
    storage: paymentStorage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
    },
    fileFilter: fileFilter,
});

const productUpload = multer({
    storage: productStorage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
    },
    fileFilter: fileFilter,
});

/**
 * @route   POST /api/upload
 * @desc    Upload payment screenshot
 * @access  Public (but should be protected in production)
 */
router.post('/', paymentUpload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload an image file',
            });
        }

        const fileUrl = `/uploads/payments/${req.file.filename}`;

        res.json({
            success: true,
            message: 'Image uploaded successfully',
            url: fileUrl,
            filename: req.file.filename,
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to upload image',
        });
    }
});

/**
 * @route   POST /api/upload/product
 * @desc    Upload product image
 * @access  Public (but should be protected in production)
 */
router.post('/product', productUpload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload an image file',
            });
        }

        const fileUrl = `/uploads/products/${req.file.filename}`;

        res.json({
            success: true,
            message: 'Product image uploaded successfully',
            url: fileUrl,
            filename: req.file.filename,
        });
    } catch (error) {
        console.error('Product upload error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to upload product image',
        });
    }
});

/**
 * @route   DELETE /api/upload/:filename
 * @desc    Delete uploaded image
 * @access  Protected
 */
router.delete('/:filename', (req, res) => {
    try {
        const filePath = path.join(__dirname, '../../public/uploads/payments', req.params.filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.json({
                success: true,
                message: 'Image deleted successfully',
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Image not found',
            });
        }
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete image',
        });
    }
});

module.exports = router;
