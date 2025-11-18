import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FiUpload, FiCheck, FiX, FiInfo } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../lib/axios';
import { formatPrice } from '../lib/utils';
import { calculateGrandTotal, getCurrentLocation } from '../lib/deliveryFee';
import Image from 'next/image';

export default function ManualCheckoutPage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const { cart, getCartTotal, clearCart } = useCart();

    // Form States
    const [formData, setFormData] = useState({
        customerName: '',
        phoneNumber: '',
        address: '',
        paymentMethod: 'Cash on Delivery',
    });

    // Payment Proof States
    const [transactionId, setTransactionId] = useState('');
    const [paymentScreenshot, setPaymentScreenshot] = useState(null);
    const [screenshotPreview, setScreenshotPreview] = useState('');
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Location & Delivery
    const [currentLocation, setCurrentLocation] = useState('Dhaka');
    const [deliveryInfo, setDeliveryInfo] = useState(null);

    // Payment account details (your business accounts)
    const paymentAccounts = {
        bKash: {
            number: '0130842102', // ← Change to YOUR bKash number
            type: 'Merchant',
            color: 'bg-pink-600',
        },
        Nagad: {
            number: '01306842102', // ← Change to YOUR Nagad number
            type: 'Merchant',
            color: 'bg-orange-600',
        },
        Rocket: {
            number: '01775565507', // ← Change to YOUR Rocket number
            type: 'Agent',
            color: 'bg-purple-600',
        },
    };

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/checkout-manual');
            return;
        }
        if (cart.length === 0) {
            router.push('/cart');
            return;
        }

        // Set initial form data from user
        if (user) {
            setFormData(prev => ({
                ...prev,
                customerName: user.name || '',
                phoneNumber: user.mobile || '',
            }));
        }
    }, [isAuthenticated, cart, router, user]);

    // Calculate totals
    const subtotal = getCartTotal();
    useEffect(() => {
        const location = getCurrentLocation();
        setCurrentLocation(location);
        const info = calculateGrandTotal(subtotal, location);
        setDeliveryInfo(info);
    }, [subtotal]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePaymentMethodChange = (method) => {
        setFormData(prev => ({
            ...prev,
            paymentMethod: method,
        }));
        // Reset payment proof when changing method
        setTransactionId('');
        setPaymentScreenshot(null);
        setScreenshotPreview('');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file');
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size must be less than 5MB');
                return;
            }

            setPaymentScreenshot(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setScreenshotPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadScreenshot = async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const { data } = await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return data.url;
        } catch (error) {
            console.error('Upload error:', error);
            // Fallback: convert to base64 if upload endpoint doesn't exist
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        }
    };

    const validateForm = () => {
        if (!formData.customerName.trim()) {
            toast.error('Please enter your name');
            return false;
        }
        if (!formData.phoneNumber.trim() || formData.phoneNumber.length < 11) {
            toast.error('Please enter a valid phone number (11 digits)');
            return false;
        }
        if (!formData.address.trim()) {
            toast.error('Please enter your delivery address');
            return false;
        }

        // Validate payment proof for online payments
        if (formData.paymentMethod !== 'Cash on Delivery') {
            if (!transactionId.trim()) {
                toast.error('Please enter transaction ID');
                return false;
            }
            if (!paymentScreenshot) {
                toast.error('Please upload payment screenshot');
                return false;
            }
        }

        return true;
    };

    const handleSubmitOrder = async () => {
        if (!validateForm()) return;

        setSubmitting(true);

        try {
            let screenshotUrl = '';

            // Upload screenshot if provided
            if (paymentScreenshot) {
                setUploading(true);
                screenshotUrl = await uploadScreenshot(paymentScreenshot);
                setUploading(false);
            }

            // Prepare order data
            const orderData = {
                items: cart.map(item => ({
                    product: item.product?._id || item._id,
                    name: item.product?.name || item.name || 'Unknown Product',
                    price: item.product?.discountPrice || item.product?.price || item.price || 0,
                    quantity: item.quantity || 1,
                    image: item.product?.images?.[0] || item.image || '',
                })),
                shippingAddress: {
                    addressLine1: formData.address,
                    city: currentLocation,
                },
                contactNumber: formData.phoneNumber,
                customerName: formData.customerName,
                paymentMethod: formData.paymentMethod,
                paymentStatus: formData.paymentMethod === 'Cash on Delivery' ? 'cod_pending' : 'pending_verification',
                status: 'pending',
                subtotal: subtotal,
                deliveryFee: deliveryInfo?.deliveryFee || 0,
                totalAmount: deliveryInfo?.total || subtotal,
                deliveryLocation: currentLocation,

                // Manual payment details
                manualPayment: {
                    transactionId: transactionId || null,
                    screenshot: screenshotUrl || null,
                    accountNumber: formData.paymentMethod !== 'Cash on Delivery'
                        ? paymentAccounts[formData.paymentMethod]?.number
                        : null,
                    submittedAt: new Date(),
                    verificationStatus: 'pending', // pending, approved, rejected
                },
            };

            const { data } = await api.post('/orders', orderData);

            if (data.success) {
                clearCart();
                toast.success('Order placed successfully! Waiting for admin approval.');
                router.push(`/orders/${data.order._id}`);
            } else {
                throw new Error(data.message || 'Failed to place order');
            }
        } catch (error) {
            console.error('Order submission error:', error);
            toast.error(error.response?.data?.message || error.message || 'Failed to place order');
        } finally {
            setSubmitting(false);
            setUploading(false);
        }
    };

    if (!isAuthenticated || cart.length === 0) {
        return null;
    }

    const selectedAccountInfo = formData.paymentMethod !== 'Cash on Delivery'
        ? paymentAccounts[formData.paymentMethod]
        : null;

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="container-custom max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">Complete Your Order</h1>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Left Column - Form */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Customer Information */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-900">Customer Information</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="customerName"
                                        value={formData.customerName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                                        placeholder="01XXXXXXXXX"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Delivery Address <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                                        placeholder="House no, Road no, Area, City"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method Selection */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-900">Select Payment Method</h2>

                            <div className="space-y-3">
                                {/* bKash */}
                                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.paymentMethod === 'bKash'
                                    ? 'border-pink-500 bg-pink-50'
                                    : 'border-gray-200 hover:border-pink-300'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="bKash"
                                        checked={formData.paymentMethod === 'bKash'}
                                        onChange={(e) => handlePaymentMethodChange(e.target.value)}
                                        className="w-5 h-5 text-pink-600"
                                    />
                                    <div className="ml-4 flex items-center flex-1">
                                        <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                            bK
                                        </div>
                                        <div className="ml-3">
                                            <div className="font-semibold text-gray-900">bKash</div>
                                            <div className="text-sm text-gray-700">Mobile Payment</div>
                                        </div>
                                    </div>
                                </label>

                                {/* Nagad */}
                                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.paymentMethod === 'Nagad'
                                    ? 'border-orange-500 bg-orange-50'
                                    : 'border-gray-200 hover:border-orange-300'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="Nagad"
                                        checked={formData.paymentMethod === 'Nagad'}
                                        onChange={(e) => handlePaymentMethodChange(e.target.value)}
                                        className="w-5 h-5 text-orange-600"
                                    />
                                    <div className="ml-4 flex items-center flex-1">
                                        <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                            N
                                        </div>
                                        <div className="ml-3">
                                            <div className="font-semibold text-gray-900">Nagad</div>
                                            <div className="text-sm text-gray-700">Mobile Payment</div>
                                        </div>
                                    </div>
                                </label>

                                {/* Rocket */}
                                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.paymentMethod === 'Rocket'
                                    ? 'border-purple-500 bg-purple-50'
                                    : 'border-gray-200 hover:border-purple-300'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="Rocket"
                                        checked={formData.paymentMethod === 'Rocket'}
                                        onChange={(e) => handlePaymentMethodChange(e.target.value)}
                                        className="w-5 h-5 text-purple-600"
                                    />
                                    <div className="ml-4 flex items-center flex-1">
                                        <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                            🚀
                                        </div>
                                        <div className="ml-3">
                                            <div className="font-semibold text-gray-900">Rocket</div>
                                            <div className="text-sm text-gray-700">Mobile Payment</div>
                                        </div>
                                    </div>
                                </label>

                                {/* Cash on Delivery */}
                                <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.paymentMethod === 'Cash on Delivery'
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-200 hover:border-green-300'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="Cash on Delivery"
                                        checked={formData.paymentMethod === 'Cash on Delivery'}
                                        onChange={(e) => handlePaymentMethodChange(e.target.value)}
                                        className="w-5 h-5 text-green-600"
                                    />
                                    <div className="ml-4 flex items-center flex-1">
                                        <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
                                            💵
                                        </div>
                                        <div className="ml-3">
                                            <div className="font-semibold text-gray-900">Cash on Delivery</div>
                                            <div className="text-sm text-gray-700">Pay when you receive</div>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Payment Instructions (for online payments) */}
                        {selectedAccountInfo && (
                            <div className={`${selectedAccountInfo.color || 'bg-gray-800'} text-white rounded-lg shadow-lg p-6`}>
                                <h3 className="text-xl font-bold mb-4 flex items-center text-white">
                                    <FiInfo className="mr-2" />
                                    Payment Instructions
                                </h3>

                                <div className="bg-white/10 rounded-lg p-4 mb-4">
                                    <p className="text-sm mb-2 text-white">Send Money To:</p>
                                    <p className="text-3xl font-bold mb-1 text-white">{selectedAccountInfo.number}</p>
                                    <p className="text-sm opacity-90 text-white">({selectedAccountInfo.type} Account)</p>
                                </div>

                                <div className="bg-white/10 rounded-lg p-4 mb-4">
                                    <p className="text-sm font-semibold mb-2 text-white">Amount to Send:</p>
                                    <p className="text-4xl font-bold text-white">৳{deliveryInfo?.total?.toFixed(2) || subtotal.toFixed(2)}</p>
                                </div>

                                <div className="bg-white/10 rounded-lg p-4">
                                    <p className="text-sm font-semibold mb-2 text-white">📝 Instructions:</p>
                                    <ol className="list-decimal list-inside space-y-1 text-sm text-white">
                                        <li>Open your {formData.paymentMethod} app</li>
                                        <li>Select "Send Money"</li>
                                        <li>Enter the number: {selectedAccountInfo.number}</li>
                                        <li>Enter amount: ৳{deliveryInfo?.total?.toFixed(2) || subtotal.toFixed(2)}</li>
                                        <li>Complete the transaction</li>
                                        <li>Take a screenshot of the confirmation</li>
                                        <li>Upload screenshot and enter transaction ID below</li>
                                    </ol>
                                </div>

                                {/* QR Code Placeholder */}
                                {/* <div className="mt-4 bg-white rounded-lg p-4 text-center">
                                    <p className="text-gray-800 font-semibold mb-2">Or Scan QR Code</p>
                                    <div className="w-48 h-48 bg-gray-100 mx-auto rounded-lg flex items-center justify-center">
                                        <p className="text-gray-500">QR Code Here</p>
                                    </div>
                                </div> */}
                            </div>
                        )}

                        {/* Payment Proof Upload (for online payments) */}
                        {formData.paymentMethod !== 'Cash on Delivery' && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-semibold mb-4 text-gray-900">Upload Payment Proof</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Transaction ID / TrxID <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={transactionId}
                                            onChange={(e) => setTransactionId(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                                            placeholder="Enter transaction ID from SMS"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Payment Screenshot <span className="text-red-500">*</span>
                                        </label>

                                        {!screenshotPreview ? (
                                            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 hover:bg-gray-50 transition-colors">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <FiUpload className="w-10 h-10 text-gray-400 mb-3" />
                                                    <p className="mb-2 text-sm text-gray-600">
                                                        <span className="font-semibold">Click to upload</span> screenshot
                                                    </p>
                                                    <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                                                </div>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                />
                                            </label>
                                        ) : (
                                            <div className="relative">
                                                <img
                                                    src={screenshotPreview}
                                                    alt="Payment Screenshot"
                                                    className="w-full h-64 object-contain bg-gray-100 rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setPaymentScreenshot(null);
                                                        setScreenshotPreview('');
                                                    }}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                                                >
                                                    <FiX className="w-5 h-5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* COD Notice */}
                        {formData.paymentMethod === 'Cash on Delivery' && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-start">
                                    <FiCheck className="w-6 h-6 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-green-800 mb-1">Cash on Delivery Selected</h3>
                                        <p className="text-sm text-green-700">
                                            You will pay ৳{deliveryInfo?.total?.toFixed(2) || subtotal.toFixed(2)} in cash when you receive your order.
                                            Please keep the exact amount ready.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                            <h2 className="text-xl font-semibold mb-4 text-gray-900">Order Summary</h2>

                            {/* Cart Items */}
                            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                                {cart.map((item) => (
                                    <div key={item.product?._id || Math.random()} className="flex items-center space-x-3 text-sm">
                                        <div className="relative w-12 h-12 flex-shrink-0 bg-gray-100 rounded flex items-center justify-center">
                                            {item.product?.images?.[0] ? (
                                                <img
                                                    src={item.product.images[0]}
                                                    alt={item.product.name || 'Product'}
                                                    className="w-full h-full object-cover rounded"
                                                />
                                            ) : (
                                                <span className="text-gray-400 text-xs">No img</span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate text-gray-900">{item.product?.name || 'Product'}</p>
                                            <p className="text-gray-700">Qty: {item.quantity || 1}</p>
                                        </div>
                                        <p className="font-semibold text-gray-900">
                                            {formatPrice((item.product?.discountPrice || item.product?.price || 0) * (item.quantity || 1))}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-700 font-medium">Subtotal:</span>
                                    <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-700 font-medium">Delivery Fee:</span>
                                    <span className="font-semibold text-gray-900">
                                        {deliveryInfo?.isFree ? (
                                            <span className="text-green-600 font-bold">FREE</span>
                                        ) : (
                                            formatPrice(deliveryInfo?.deliveryFee || 0)
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-700 font-medium">Location:</span>
                                    <span className="font-semibold text-gray-900">{currentLocation}</span>
                                </div>
                                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                                    <span className="text-gray-900">Total:</span>
                                    <span className="text-primary-600">
                                        {formatPrice(deliveryInfo?.total || subtotal)}
                                    </span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmitOrder}
                                disabled={submitting || uploading}
                                className="w-full mt-6 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {uploading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                                        Uploading...
                                    </>
                                ) : submitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                                        Placing Order...
                                    </>
                                ) : (
                                    <>
                                        <FiCheck className="mr-2" />
                                        Place Order
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-gray-700 font-medium text-center mt-3">
                                {formData.paymentMethod === 'Cash on Delivery'
                                    ? 'Your order will be confirmed after verification'
                                    : 'Your order will be processed after payment verification'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
