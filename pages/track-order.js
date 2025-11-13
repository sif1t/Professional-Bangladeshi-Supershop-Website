import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiPackage, FiClock, FiCheckCircle, FiTruck, FiMapPin, FiPhone, FiCalendar, FiDollarSign, FiUser, FiAlertCircle, FiLock } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';
import Image from 'next/image';

export default function TrackOrder() {
    const router = useRouter();
    const { isAuthenticated, user, loading: authLoading } = useAuth();
    const [orderNumber, setOrderNumber] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState(null);
    const [error, setError] = useState('');

    // Auto-populate from URL params and auto-search
    useEffect(() => {
        if (router.query.orderNumber) {
            setOrderNumber(router.query.orderNumber);
            // Auto-track if order number is in URL
            setTimeout(() => {
                const fakeEvent = { preventDefault: () => { } };
                handleTrackOrder(fakeEvent, router.query.orderNumber);
            }, 500);
        }
        if (router.query.phone) {
            setPhoneNumber(router.query.phone);
        }
    }, [router.query]);

    const handleTrackOrder = async (e, autoOrderNum = null) => {
        e.preventDefault();
        setError('');
        setOrder(null);

        const orderNum = autoOrderNum || orderNumber;

        if (!orderNum.trim() && !phoneNumber.trim()) {
            setError('Please enter either Order Number or Phone Number');
            return;
        }

        setLoading(true);

        try {
            const params = new URLSearchParams();
            if (orderNum.trim()) params.append('orderNumber', orderNum.trim());
            if (phoneNumber.trim()) params.append('phone', phoneNumber.trim());

            const response = await api.get(`/orders/track?${params.toString()}`);

            if (response.data.success) {
                if (response.data.orders && response.data.orders.length > 0) {
                    setOrder(response.data.orders[0]); // Show the most recent order
                    toast.success('Order found!');
                } else {
                    setError('No order found with the provided information');
                    toast.error('Order not found');
                }
            }
        } catch (err) {
            console.error('Track order error:', err);

            // Handle authentication errors
            if (err.response?.status === 401 || err.response?.status === 403) {
                const errorMsg = err.response?.data?.message || 'Please login to track your orders';
                setError(errorMsg);
                toast.error(errorMsg);

                // Redirect to login after 2 seconds
                setTimeout(() => {
                    router.push('/login?redirect=/track-order');
                }, 2000);
            } else {
                setError(err.response?.data?.message || 'Failed to track order. Please check your details and try again.');
                toast.error('Failed to track order');
            }
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending':
                return <FiClock className="text-yellow-500" size={24} />;
            case 'Confirmed':
                return <FiCheckCircle className="text-blue-500" size={24} />;
            case 'Processing':
                return <FiPackage className="text-blue-600" size={24} />;
            case 'Packed':
                return <FiPackage className="text-indigo-600" size={24} />;
            case 'Shipped':
                return <FiTruck className="text-purple-600" size={24} />;
            case 'Delivered':
                return <FiCheckCircle className="text-green-500" size={24} />;
            case 'Cancelled':
                return <FiAlertCircle className="text-red-500" size={24} />;
            default:
                return <FiClock className="text-gray-500" size={24} />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'Confirmed':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'Processing':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'Packed':
                return 'bg-indigo-100 text-indigo-800 border-indigo-300';
            case 'Shipped':
                return 'bg-purple-100 text-purple-800 border-purple-300';
            case 'Delivered':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'Cancelled':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const orderStatuses = ['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered'];
    const currentStatusIndex = order ? orderStatuses.indexOf(order.status) : -1;

    // Show loading state while checking authentication
    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // If not authenticated, show login prompt
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container-custom max-w-2xl">
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiLock className="text-primary-600" size={40} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h1>
                        <p className="text-gray-600 mb-6">
                            For security reasons, you need to be logged in to track your orders.
                            This ensures that only you can view your order information.
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <FiAlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                                <div className="text-left text-sm text-blue-800">
                                    <p className="font-medium mb-1">🔒 Your Privacy is Protected</p>
                                    <p>Only you can track orders placed with your registered phone number. No one else can see your order details.</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                href="/login?redirect=/track-order"
                                className="btn-primary px-6 py-3 inline-block"
                            >
                                Login to Track Orders
                            </Link>
                            <Link
                                href="/register?redirect=/track-order"
                                className="btn-outline px-6 py-3 inline-block"
                            >
                                Create Account
                            </Link>
                        </div>
                        <p className="text-sm text-gray-500 mt-6">
                            Don't have an account? Register now to start shopping and track your orders!
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container-custom">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
                    <p className="text-gray-600">
                        Logged in as: <span className="font-semibold text-primary-600">{user?.name}</span> ({user?.mobile})
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        🔒 You can only track orders placed with your registered phone number
                    </p>
                </div>

                {/* Security Notice */}
                <div className="max-w-2xl mx-auto mb-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <FiCheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                            <div className="text-sm text-green-800">
                                <p className="font-medium">Secure Order Tracking</p>
                                <p className="mt-1">Your orders are private and secure. Only you can view orders placed with your account.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Track Order Form */}
                <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
                    <form onSubmit={handleTrackOrder} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Order Number (Optional)
                            </label>
                            <input
                                type="text"
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(e.target.value)}
                                placeholder="e.g., ORD-2025-001234"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                            />
                        </div>

                        <div className="text-center text-gray-500 font-medium">OR</div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number (Optional)
                            </label>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder={user?.mobile || "e.g., 01XXXXXXXXX"}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                🔒 Security: You can only track orders placed with your registered number ({user?.mobile})
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                                <FiAlertCircle />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Tracking...
                                </span>
                            ) : (
                                'Track Order'
                            )}
                        </button>
                    </form>
                </div>

                {/* Order Details */}
                {order && (
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Order Status Card */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                        Order #{order.orderNumber || order._id?.slice(-8).toUpperCase()}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className={`px-4 py-2 rounded-lg border-2 font-semibold ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </div>
                            </div>

                            {/* Progress Timeline */}
                            <div className="mt-8">
                                <div className="relative">
                                    {/* Progress Bar */}
                                    <div className="absolute top-5 left-0 w-full h-1 bg-gray-200">
                                        <div
                                            className="h-full bg-primary-600 transition-all duration-500"
                                            style={{
                                                width: `${order.status === 'Cancelled' ? 0 : ((currentStatusIndex + 1) / orderStatuses.length) * 100}%`
                                            }}
                                        ></div>
                                    </div>

                                    {/* Status Points */}
                                    <div className="relative grid grid-cols-6 gap-2">
                                        {orderStatuses.map((status, index) => {
                                            const isCompleted = index <= currentStatusIndex && order.status !== 'Cancelled';
                                            const isCurrent = status === order.status;

                                            return (
                                                <div key={status} className="flex flex-col items-center">
                                                    <div
                                                        className={`w-10 h-10 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${isCompleted
                                                            ? 'bg-primary-600 border-primary-600'
                                                            : 'bg-white border-gray-300'
                                                            } ${isCurrent ? 'ring-4 ring-primary-200' : ''}`}
                                                    >
                                                        {isCompleted ? (
                                                            <FiCheckCircle className="text-white" size={20} />
                                                        ) : (
                                                            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                                        )}
                                                    </div>
                                                    <p className={`mt-2 text-xs font-medium text-center ${isCompleted ? 'text-primary-600' : 'text-gray-500'
                                                        }`}>
                                                        {status}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Cancelled Status */}
                                {order.status === 'Cancelled' && (
                                    <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                                        <FiAlertCircle size={20} />
                                        <span className="font-medium">This order has been cancelled</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Customer & Delivery Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Customer Info */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <FiUser className="text-primary-600" />
                                    Customer Information
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <FiUser className="text-gray-400 mt-1" />
                                        <div>
                                            <p className="text-sm text-gray-500">Name</p>
                                            <p className="font-medium">{order.user?.name || 'Guest'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <FiPhone className="text-gray-400 mt-1" />
                                        <div>
                                            <p className="text-sm text-gray-500">Phone</p>
                                            <p className="font-medium">{order.contactNumber || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Info */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <FiMapPin className="text-primary-600" />
                                    Delivery Address
                                </h3>
                                <div className="flex items-start gap-3">
                                    <FiMapPin className="text-gray-400 mt-1" />
                                    <div>
                                        <p className="font-medium">
                                            {order.shippingAddress?.addressLine1 || 'N/A'}
                                        </p>
                                        {order.shippingAddress?.addressLine2 && (
                                            <p className="text-gray-600">{order.shippingAddress.addressLine2}</p>
                                        )}
                                        <p className="text-gray-600">
                                            {order.shippingAddress?.area || ''}, {order.shippingAddress?.city || ''}
                                        </p>
                                        {order.shippingAddress?.zipCode && (
                                            <p className="text-gray-600">ZIP: {order.shippingAddress.zipCode}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <FiPackage className="text-primary-600" />
                                Order Items
                            </h3>
                            <div className="space-y-4">
                                {order.products && order.products.map((item, index) => (
                                    <div key={index} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                                            {item.image ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="64px"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <FiPackage className="text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                                            <p className="text-sm text-gray-500">
                                                Quantity: {item.quantity} × ৳{item.price}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">
                                                ৳{(item.quantity * item.price).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <FiDollarSign className="text-primary-600" />
                                Payment Summary
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">৳{order.subtotal || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Delivery Fee</span>
                                    <span className="font-medium">৳{order.deliveryFee || 0}</span>
                                </div>
                                {order.discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span className="font-medium">-৳{order.discount}</span>
                                    </div>
                                )}
                                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-primary-600">৳{order.totalAmount || 0}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Payment Method</span>
                                    <span className="font-medium">{order.paymentMethod || 'Cash on Delivery'}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Payment Status</span>
                                    <span className={`font-medium ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-orange-600'
                                        }`}>
                                        {order.paymentStatus || 'Unpaid'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Need Help Section */}
                        <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
                            <h3 className="text-lg font-bold text-primary-900 mb-2">Need Help?</h3>
                            <p className="text-primary-700 mb-4">
                                If you have any questions about your order, please contact our customer support.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <a
                                    href="tel:16469"
                                    className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                                >
                                    <FiPhone />
                                    Call 16469
                                </a>
                                <a
                                    href="/help"
                                    className="flex items-center gap-2 bg-white text-primary-600 border border-primary-600 px-6 py-2 rounded-lg hover:bg-primary-50 transition-colors"
                                >
                                    Help Center
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {/* No Order State */}
                {!order && !loading && (
                    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-12 text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiPackage className="text-gray-400" size={48} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Track Your Order</h3>
                        <p className="text-gray-600">
                            Enter your order number or phone number above to track your delivery status
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
