const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
    label: {
        type: String,
        enum: ['Home', 'Office', 'Other'],
        default: 'Home',
    },
    addressLine1: {
        type: String,
        required: true,
    },
    addressLine2: {
        type: String,
    },
    city: {
        type: String,
        required: true,
    },
    area: {
        type: String,
        required: true,
    },
    zipCode: {
        type: String,
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Please provide a valid Gmail address'],
        index: true,
    },
    mobile: {
        type: String,
        required: [true, 'Please provide your mobile number'],
        unique: true,
        trim: true,
        match: [/^01[0-9]{9}$/, 'Please provide a valid Bangladeshi mobile number'],
        index: true,
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId; // Password required only if not OAuth user
        },
        minlength: [6, 'Password must be at least 6 characters'],
        select: false,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true, // Allow null values to be non-unique
    },
    avatar: {
        type: String,
    },
    addresses: [addressSchema],
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
