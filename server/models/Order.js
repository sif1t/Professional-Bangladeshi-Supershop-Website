const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    variant: {
        type: String,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    price: {
        type: Number,
        required: true,
    },
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    orderNumber: {
        type: String,
        unique: true,
    },
    products: [orderItemSchema],
    shippingAddress: {
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
    },
    contactNumber: {
        type: String,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    subtotal: {
        type: Number,
        required: true,
    },
    deliveryFee: {
        type: Number,
        default: 0,
    },
    discount: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending',
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['Cash on Delivery'],
        default: 'Cash on Delivery',
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed', 'pending_verification', 'cod_pending', 'paid', 'failed'],
        default: 'Pending',
    },
    transactionId: {
        type: String,
    },
    // Manual Payment fields
    manualPayment: {
        transactionId: String,
        screenshot: String,
        accountNumber: String,
        submittedAt: Date,
        verificationStatus: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        verifiedAt: Date,
        rejectionReason: String,
    },
    customerName: {
        type: String,
    },
    deliveryLocation: {
        type: String,
    },
    deliverySlot: {
        type: String,
    },
    deliveryDate: {
        type: Date,
    },
    notes: {
        type: String,
    },
    statusHistory: [{
        status: String,
        timestamp: {
            type: Date,
            default: Date.now,
        },
        note: String,
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Generate order number before saving
orderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        const count = await mongoose.model('Order').countDocuments();
        this.orderNumber = `ORD${Date.now()}${String(count + 1).padStart(4, '0')}`;
    }
    this.updatedAt = Date.now();
    next();
});

// Update status history when status changes
orderSchema.pre('save', function (next) {
    if (this.isModified('status')) {
        this.statusHistory.push({
            status: this.status,
            timestamp: new Date(),
        });
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
