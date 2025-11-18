import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FiCheck, FiPackage, FiMapPin, FiPhone, FiUser } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../lib/axios';
import { formatPrice } from '../lib/utils';
import { calculateGrandTotal, getCurrentLocation } from '../lib/deliveryFee';

export default function CheckoutPage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const { cart, getCartTotal, clearCart } = useCart();

    // Form States
    const [formData, setFormData] = useState({
        customerName: '',
        phoneNumber: '',
        address: '',
        notes: '',
    });

    const [submitting, setSubmitting] = useState(false);

    // Location & Delivery
    const [currentLocation, setCurrentLocation] = useState('Dhaka');
    const [deliveryInfo, setDeliveryInfo] = useState(null);

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
        return true;
    };

    const handleSubmitOrder = async () => {
        if (!validateForm()) return;

        setSubmitting(true);

        try {
            // Prepare order data
            const orderData = {
                items: cart.map(item => ({
                    product: item.productId || item._id,
                    name: item.name || 'Unknown Product',
                    price: item.price || 0,
                    quantity: item.quantity || 1,
                    image: item.image || '',
                    variant: item.variant || 'default',
                })),
                shippingAddress: {
                    addressLine1: formData.address,
                    city: currentLocation,
                    area: currentLocation,
                },
                contactNumber: formData.phoneNumber,
                customerName: formData.customerName,
                paymentMethod: 'Cash on Delivery',
                paymentStatus: 'cod_pending',
                status: 'Pending',
                subtotal: subtotal,
                deliveryFee: deliveryInfo?.deliveryFee || 0,
                totalAmount: deliveryInfo?.total || subtotal,
                deliveryLocation: currentLocation,
                notes: formData.notes || '',
            };

            const { data } = await api.post('/orders', orderData);

            if (data.success) {
                clearCart();
                toast.success('Order placed successfully!');
                router.push(`/orders/${data.order._id}`);
            } else {
                throw new Error(data.message || 'Failed to place order');
            }
        } catch (error) {
            console.error('Order submission error:', error);
            toast.error(error.response?.data?.message || error.message || 'Failed to place order');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isAuthenticated || cart.length === 0) {
        return null;
    }

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="container-custom max-w-4xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Order</h1>
                    <p className="text-gray-600">Pay with cash when your order arrives</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Left Column - Form */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Customer Information */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center mb-4">
                                <FiUser className="text-primary-600 text-xl mr-2" />
                                <h2 className="text-xl font-semibold text-gray-900">Customer Information</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <span className="flex items-center">
                                            <FiUser className="mr-2" />
                                            Full Name <span className="text-red-500 ml-1">*</span>
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        name="customerName"
                                        value={formData.customerName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 transition"
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <span className="flex items-center">
                                            <FiPhone className="mr-2" />
                                            Phone Number <span className="text-red-500 ml-1">*</span>
                                        </span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 transition"
                                        placeholder="01XXXXXXXXX"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <span className="flex items-center">
                                            <FiMapPin className="mr-2" />
                                            Delivery Address <span className="text-red-500 ml-1">*</span>
                                        </span>
                                    </label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 transition resize-none"
                                        placeholder="House no, Road no, Area, City"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Special Instructions (Optional)
                                    </label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        rows="2"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 transition resize-none"
                                        placeholder="Any special delivery instructions..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method - Cash on Delivery */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg shadow-md p-6">
                            <div className="flex items-center mb-4">
                                <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg">
                                    💵
                                </div>
                                <div className="ml-4">
                                    <h2 className="text-xl font-bold text-gray-900">Cash on Delivery</h2>
                                    <p className="text-sm text-gray-600">Pay when you receive your order</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-4 border border-green-200">
                                <div className="flex items-start space-x-3">
                                    <FiCheck className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 mb-2">How it works:</h3>
                                        <ul className="space-y-2 text-sm text-gray-700">
                                            <li className="flex items-start">
                                                <span className="inline-block w-6 h-6 bg-green-100 text-green-700 rounded-full text-center mr-2 flex-shrink-0 font-semibold">1</span>
                                                <span>Your order will be processed and prepared for delivery</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="inline-block w-6 h-6 bg-green-100 text-green-700 rounded-full text-center mr-2 flex-shrink-0 font-semibold">2</span>
                                                <span>Our delivery person will contact you before delivery</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="inline-block w-6 h-6 bg-green-100 text-green-700 rounded-full text-center mr-2 flex-shrink-0 font-semibold">3</span>
                                                <span>Pay <strong className="text-green-700">৳{deliveryInfo?.total?.toFixed(2) || subtotal.toFixed(2)}</strong> in cash when you receive</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                                <FiPackage className="text-blue-600 mr-2 flex-shrink-0" />
                                <span>Please keep the exact amount ready for smooth delivery</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                            <div className="flex items-center mb-4">
                                <FiPackage className="text-primary-600 text-xl mr-2" />
                                <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
                            </div>

                            {/* Cart Items */}
                            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                                {cart.map((item, index) => (
                                    <div key={item.productId || index} className="flex items-center space-x-3 pb-3 border-b border-gray-100 last:border-0">
                                        <div className="relative w-14 h-14 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name || 'Product'}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <FiPackage className="text-gray-400 text-xl" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 truncate text-sm">{item.name || 'Product'}</p>
                                            <p className="text-xs text-gray-500">{item.variant}</p>
                                            <p className="text-sm text-gray-600">Qty: {item.quantity || 1}</p>
                                        </div>
                                        <p className="font-semibold text-gray-900 text-sm">
                                            {formatPrice((item.price || 0) * (item.quantity || 1))}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Delivery Fee:</span>
                                    <span className="font-semibold text-gray-900">
                                        {deliveryInfo?.isFree ? (
                                            <span className="text-green-600 font-bold">FREE</span>
                                        ) : (
                                            formatPrice(deliveryInfo?.deliveryFee || 0)
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 flex items-center">
                                        <FiMapPin className="mr-1" />
                                        Location:
                                    </span>
                                    <span className="font-semibold text-gray-900">{currentLocation}</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-900">Total:</span>
                                    <span className="text-2xl font-bold text-primary-600">
                                        {formatPrice(deliveryInfo?.total || subtotal)}
                                    </span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmitOrder}
                                disabled={submitting}
                                className="w-full mt-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-lg font-bold text-lg hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center"
                            >
                                {submitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                                        Placing Order...
                                    </>
                                ) : (
                                    <>
                                        <FiCheck className="mr-2 text-xl" />
                                        Place Order
                                    </>
                                )}
                            </button>

                            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-xs text-blue-800 text-center font-medium">
                                    🔒 Secure checkout · Your order will be confirmed within 24 hours
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
