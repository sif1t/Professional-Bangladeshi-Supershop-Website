const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../../config/cloudinary');

// Configure multer to use memory storage for Cloudinary
const memoryStorage = multer.memoryStorage();

// Configure multer for payment screenshots (local storage fallback)
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

// File filter for images only (including WebP)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (JPG, PNG, GIF, WebP)!'));
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

// Multer for Cloudinary uploads (memory storage)
const cloudinaryUpload = multer({
    storage: memoryStorage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max
    },
    fileFilter: fileFilter,
});

// File filter for videos
const videoFilter = (req, file, cb) => {
    const allowedTypes = /mp4|mov|avi|webm|mkv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = /video/.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only video files are allowed (MP4, MOV, AVI, WebM, MKV)!'));
    }
};

// Multer for video uploads to Cloudinary
const videoUpload = multer({
    storage: memoryStorage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB max for videos
    },
    fileFilter: videoFilter,
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
 * @desc    Upload product image to Cloudinary
 * @access  Public (but should be protected in production)
 */
router.post('/product', cloudinaryUpload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload an image file',
            });
        }

        // Upload to Cloudinary using upload_stream
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'bd-supershop/products',
                transformation: [
                    { width: 1000, height: 1000, crop: 'limit' },
                    { quality: 'auto:good' },
                    { fetch_format: 'auto' }
                ]
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to upload to Cloudinary',
                        error: error.message
                    });
                }

                res.json({
                    success: true,
                    message: 'Product image uploaded successfully',
                    url: result.secure_url,
                    publicId: result.public_id,
                    filename: req.file.originalname,
                });
            }
        );

        // Pipe the buffer to Cloudinary
        const bufferStream = require('stream').Readable.from(req.file.buffer);
        bufferStream.pipe(uploadStream);

    } catch (error) {
        console.error('Product upload error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to upload product image',
        });
    }
});

/**
 * @route   POST /api/upload/url
 * @desc    Upload image from URL to Cloudinary (works with any image URL)
 * @access  Public
 */
router.post('/url', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: 'Image URL is required',
            });
        }

        // Validate URL format
        try {
            new URL(url);
        } catch {
            return res.status(400).json({
                success: false,
                message: 'Invalid URL format',
            });
        }

        // Upload to Cloudinary directly from URL
        const result = await cloudinary.uploader.upload(url, {
            folder: 'bd-supershop/products',
            transformation: [
                { width: 1000, height: 1000, crop: 'limit' },
                { quality: 'auto:good' },
                { fetch_format: 'auto' }
            ]
        });

        res.json({
            success: true,
            message: 'Image uploaded successfully from URL',
            url: result.secure_url,
            publicId: result.public_id,
        });

    } catch (error) {
        console.error('URL upload error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to upload image from URL',
        });
    }
});

/**
 * @route   POST /api/upload/video
 * @desc    Upload product video to Cloudinary
 * @access  Public
 */
router.post('/video', videoUpload.single('video'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a video file',
            });
        }

        // Upload to Cloudinary using upload_stream
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'bd-supershop/videos',
                resource_type: 'video',
                transformation: [
                    { width: 1920, height: 1080, crop: 'limit' },
                    { quality: 'auto:good' },
                    { fetch_format: 'auto' }
                ]
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary video upload error:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to upload video to Cloudinary',
                        error: error.message
                    });
                }

                res.json({
                    success: true,
                    message: 'Video uploaded successfully',
                    url: result.secure_url,
                    publicId: result.public_id,
                    filename: req.file.originalname,
                    duration: result.duration,
                    format: result.format,
                });
            }
        );

        // Pipe the buffer to Cloudinary
        const bufferStream = require('stream').Readable.from(req.file.buffer);
        bufferStream.pipe(uploadStream);

    } catch (error) {
        console.error('Video upload error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to upload video',
        });
    }
});

/**
 * @route   POST /api/upload/video-url
 * @desc    Upload video from URL to Cloudinary
 * @access  Public
 */
router.post('/video-url', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: 'Video URL is required',
            });
        }

        // Validate URL format
        try {
            new URL(url);
        } catch {
            return res.status(400).json({
                success: false,
                message: 'Invalid URL format',
            });
        }

        // Upload to Cloudinary directly from URL
        const result = await cloudinary.uploader.upload(url, {
            folder: 'bd-supershop/videos',
            resource_type: 'video',
            transformation: [
                { width: 1920, height: 1080, crop: 'limit' },
                { quality: 'auto:good' },
            ]
        });

        res.json({
            success: true,
            message: 'Video uploaded successfully from URL',
            url: result.secure_url,
            publicId: result.public_id,
            duration: result.duration,
            format: result.format,
        });

    } catch (error) {
        console.error('Video URL upload error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to upload video from URL',
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
