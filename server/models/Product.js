const mongoose = require('mongoose');
const slugify = require('slugify');

const variantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    salePrice: {
        type: Number,
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
    },
    sku: {
        type: String,
    },
});

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a product name'],
        trim: true,
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        default: '',
    },
    images: [{
        type: String,
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Please provide a category'],
    },
    brand: {
        type: String,
        trim: true,
    },
    price: {
        type: Number,
        default: 0,
    },
    salePrice: {
        type: Number,
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
    },
    variants: [variantSchema],
    isFeatured: {
        type: Boolean,
        default: false,
    },
    onSale: {
        type: Boolean,
        default: false,
    },
    isNewArrival: {
        type: Boolean,
        default: false,
    },
    isBestSaving: {
        type: Boolean,
        default: false,
    },
    isBuyGetFree: {
        type: Boolean,
        default: false,
    },
    buyGetFreeDetails: {
        buy: Number,
        get: Number,
        freeProductName: String,
    },
    tags: [{
        type: String,
        trim: true,
    }],
    unit: {
        type: String,
        default: 'piece',
    },
    weight: {
        type: Number,
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
    views: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Create slug from name before saving
productSchema.pre('save', function (next) {
    if (this.isModified('name') || !this.slug) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    this.updatedAt = Date.now();
    next();
});

// Index for search and filtering
productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, brand: 1, onSale: 1, isFeatured: 1 });

module.exports = mongoose.model('Product', productSchema);
