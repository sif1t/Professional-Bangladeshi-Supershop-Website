import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { 
    FiArrowLeft, 
    FiPackage, 
    FiMapPin, 
    FiPhone, 
    FiUser, 
    FiCalendar, 
    FiClock, 
    FiCheckCircle, 
    FiTruck, 
    FiDollarSign,
    FiDownload,
    FiPrinter,
    FiShare2,
    FiAlertCircle,
    FiCreditCard,
    FiTag,
    FiInfo,
    FiHome,
    FiMail
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/axios';

export default function OrderDetailsPage() {
    const router = useRouter();
    const { id } = router.query;
    const { isAuthenticated, user, loading: authLoading } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showShareModal, setShowShareModal] = useState(false);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login?redirect=/account/orders');
        }
    }, [isAuthenticated, authLoading, router]);

    useEffect(() => {
        if (id && isAuthenticated) {
            fetchOrderDetails();
        }
    }, [id, isAuthenticated]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/orders/${id}`);
            
            if (response.data.success) {
                setOrder(response.data.order);
            } else {
                setError('Order not found');
                toast.error('Order not found');
            }
        } catch (err) {
            console.error('Error fetching order:', err);
            setError(err.response?.data?.message || 'Failed to load order details');
            toast.error('Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'Confirmed': 'bg-blue-100 text-blue-800 border-blue-300',
            'Processing': 'bg-blue-100 text-blue-800 border-blue-300',
            'Packed': 'bg-indigo-100 text-indigo-800 border-indigo-300',
            'Shipped': 'bg-purple-100 text-purple-800 border-purple-300',
            'Delivered': 'bg-green-100 text-green-800 border-green-300',
            'Cancelled': 'bg-red-100 text-red-800 border-red-300'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending':
                return <FiClock className="text-yellow-600" size={24} />;
            case 'Confirmed':
                return <FiCheckCircle className="text-blue-600" size={24} />;
            case 'Processing':
                return <FiPackage className="text-blue-600" size={24} />;
            case 'Packed':
                return <FiPackage className="text-indigo-600" size={24} />;
            case 'Shipped':
                return <FiTruck className="text-purple-600" size={24} />;
            case 'Delivered':
                return <FiCheckCircle className="text-green-600" size={24} />;
            case 'Cancelled':
                return <FiAlertCircle className="text-red-600" size={24} />;
            default:
                return <FiClock className="text-gray-600" size={24} />;
        }
    };

    const getPaymentStatusColor = (status) => {
        const colors = {
            'Pending': 'bg-orange-100 text-orange-800',
            'Completed': 'bg-green-100 text-green-800',
            'Failed': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const handlePrint = () => {
        window.print();
        toast.success('Print dialog opened');
    };

    const handleDownloadInvoice = () => {
        // Generate invoice data
        const invoiceContent = `
INVOICE
===========================================
BD Supershop
Order #${order.orderNumber || order._id?.slice(-8).toUpperCase()}
Date: ${new Date(order.createdAt).toLocaleString()}

Customer Information:
---------------------
Name: ${order.user?.name || 'Guest'}
Phone: ${order.contactNumber}
Address: ${order.shippingAddress?.addressLine1}, ${order.shippingAddress?.city}

Items:
---------------------
${order.products.map((item, index) => 
    `${index + 1}. ${item.name} (${item.variant || 'Standard'})
   Qty: ${item.quantity} × ৳${item.price} = ৳${item.quantity * item.price}`
).join('\n')}

Payment Summary:
---------------------
Subtotal:      ৳${order.subtotal || 0}
Delivery Fee:  ৳${order.deliveryFee || 0}
Discount:      -৳${order.discount || 0}
---------------------
Total:         ৳${order.totalAmount}

Payment Method: ${order.paymentMethod}
Payment Status: ${order.paymentStatus}
Order Status:   ${order.status}

Thank you for shopping with BD Supershop!
For support, call: 16469
        `;

        const blob = new Blob([invoiceContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Invoice-${order.orderNumber || order._id?.slice(-8)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        toast.success('Invoice downloaded successfully!');
    };

    const handleCopyOrderNumber = () => {
        navigator.clipboard.writeText(order.orderNumber || order._id);
        toast.success('Order number copied to clipboard!');
    };

    const handleShareOrder = () => {
        setShowShareModal(true);
    };

    const orderStatuses = ['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered'];
    const currentStatusIndex = order ? orderStatuses.indexOf(order.status) : -1;

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container-custom max-w-6xl">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="bg-white rounded-lg p-6 mb-4">
                            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container-custom max-w-6xl">
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <FiAlertCircle className="mx-auto text-red-500 mb-4" size={64} />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
                        <p className="text-gray-600 mb-6">{error || 'The order you are looking for does not exist.'}</p>
                        <Link href="/account/orders" className="btn-primary inline-block">
                            Back to My Orders
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container-custom max-w-6xl">
                {/* Header with Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <Link 
                            href="/account/orders" 
                            className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
                        >
                            <FiArrowLeft size={20} />
                            <span className="font-medium">Back to Orders</span>
                        </Link>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={handlePrint}
                            className="btn-outline px-4 py-2 text-sm flex items-center gap-2"
                        >
                            <FiPrinter size={16} />
                            Print
                        </button>
                        <button
                            onClick={handleDownloadInvoice}
                            className="btn-outline px-4 py-2 text-sm flex items-center gap-2"
                        >
                            <FiDownload size={16} />
                            Download Invoice
                        </button>
                        <Link
                            href={`/track-order?orderNumber=${order.orderNumber}`}
                            className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
                        >
                            <FiTruck size={16} />
                            Track Order
                        </Link>
                    </div>
                </div>

                {/* Order Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Order #{order.orderNumber || order._id?.slice(-8).toUpperCase()}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <FiCalendar size={16} />
                                    <span>
                                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                                <button 
                                    onClick={handleCopyOrderNumber}
                                    className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
                                >
                                    <FiShare2 size={16} />
                                    <span>Copy Order Number</span>
                                </button>
                            </div>
                        </div>
                        
                        <div className="text-right">
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-semibold text-lg ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                {order.status}
                            </div>
                            <div className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                                Payment: {order.paymentStatus}
                            </div>
                        </div>
                    </div>

                    {/* Order Progress Timeline */}
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Progress</h3>
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
                                                className={`w-10 h-10 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                                                    isCompleted
                                                        ? 'bg-primary-600 border-primary-600'
                                                        : 'bg-white border-gray-300'
                                                } ${isCurrent ? 'ring-4 ring-primary-200 scale-110' : ''}`}
                                            >
                                                {isCompleted ? (
                                                    <FiCheckCircle className="text-white" size={20} />
                                                ) : (
                                                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                                                )}
                                            </div>
                                            <p className={`mt-2 text-xs font-medium text-center ${
                                                isCompleted ? 'text-primary-600' : 'text-gray-500'
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

                        {/* Status History Timeline */}
                        {order.statusHistory && order.statusHistory.length > 0 && (
                            <div className="mt-8 bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <FiClock size={18} />
                                    Status History
                                </h4>
                                <div className="space-y-3">
                                    {order.statusHistory.map((history, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                                                <FiCheckCircle className="text-primary-600" size={16} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium text-gray-900">{history.status}</span>
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(history.timestamp).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                                {history.note && (
                                                    <p className="text-sm text-gray-600 mt-1">{history.note}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Customer Information */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FiUser className="text-primary-600" />
                            Customer Information
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <FiUser className="text-gray-400 mt-1 flex-shrink-0" size={18} />
                                <div>
                                    <p className="text-sm text-gray-500">Full Name</p>
                                    <p className="font-medium text-gray-900">{order.user?.name || 'Guest User'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <FiPhone className="text-gray-400 mt-1 flex-shrink-0" size={18} />
                                <div>
                                    <p className="text-sm text-gray-500">Contact Number</p>
                                    <p className="font-medium text-gray-900">{order.contactNumber}</p>
                                </div>
                            </div>
                            {order.user?.mobile && order.user.mobile !== order.contactNumber && (
                                <div className="flex items-start gap-3">
                                    <FiPhone className="text-gray-400 mt-1 flex-shrink-0" size={18} />
                                    <div>
                                        <p className="text-sm text-gray-500">Registered Mobile</p>
                                        <p className="font-medium text-gray-900">{order.user.mobile}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Delivery Information */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FiMapPin className="text-primary-600" />
                            Delivery Information
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <FiHome className="text-gray-400 mt-1 flex-shrink-0" size={18} />
                                <div>
                                    <p className="text-sm text-gray-500">Delivery Address</p>
                                    <p className="font-medium text-gray-900">
                                        {order.shippingAddress?.addressLine1}
                                    </p>
                                    {order.shippingAddress?.addressLine2 && (
                                        <p className="text-gray-600">{order.shippingAddress.addressLine2}</p>
                                    )}
                                    <p className="text-gray-600">
                                        {order.shippingAddress?.area}, {order.shippingAddress?.city}
                                    </p>
                                    {order.shippingAddress?.zipCode && (
                                        <p className="text-gray-600">ZIP: {order.shippingAddress.zipCode}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <FiClock className="text-gray-400 mt-1 flex-shrink-0" size={18} />
                                <div>
                                    <p className="text-sm text-gray-500">Delivery Slot</p>
                                    <p className="font-medium text-gray-900">{order.deliverySlot || 'Standard Delivery'}</p>
                                </div>
                            </div>
                            {order.deliveryDate && (
                                <div className="flex items-start gap-3">
                                    <FiCalendar className="text-gray-400 mt-1 flex-shrink-0" size={18} />
                                    <div>
                                        <p className="text-sm text-gray-500">Expected Delivery</p>
                                        <p className="font-medium text-gray-900">
                                            {new Date(order.deliveryDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FiCreditCard className="text-primary-600" />
                            Payment Information
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <FiDollarSign className="text-gray-400 mt-1 flex-shrink-0" size={18} />
                                <div>
                                    <p className="text-sm text-gray-500">Payment Method</p>
                                    <p className="font-medium text-gray-900">{order.paymentMethod}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <FiInfo className="text-gray-400 mt-1 flex-shrink-0" size={18} />
                                <div>
                                    <p className="text-sm text-gray-500">Payment Status</p>
                                    <span className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                                        {order.paymentStatus}
                                    </span>
                                </div>
                            </div>
                            {order.transactionId && (
                                <div className="flex items-start gap-3">
                                    <FiTag className="text-gray-400 mt-1 flex-shrink-0" size={18} />
                                    <div>
                                        <p className="text-sm text-gray-500">Transaction ID</p>
                                        <p className="font-medium text-gray-900 font-mono text-sm">
                                            {order.transactionId}
                                        </p>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-start gap-3">
                                <FiDollarSign className="text-gray-400 mt-1 flex-shrink-0" size={18} />
                                <div>
                                    <p className="text-sm text-gray-500">Total Amount</p>
                                    <p className="font-bold text-2xl text-primary-600">৳{order.totalAmount}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <FiPackage className="text-primary-600" />
                        Order Items ({order.products?.length || 0})
                    </h3>
                    <div className="space-y-4">
                        {order.products && order.products.map((item, index) => (
                            <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                                    {item.image ? (
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                            sizes="80px"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FiPackage className="text-gray-400" size={32} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
                                    {item.variant && (
                                        <p className="text-sm text-gray-500 mb-1">
                                            Variant: <span className="font-medium">{item.variant}</span>
                                        </p>
                                    )}
                                    <div className="flex flex-wrap items-center gap-4 text-sm">
                                        <span className="text-gray-600">
                                            Quantity: <span className="font-semibold text-gray-900">{item.quantity}</span>
                                        </span>
                                        <span className="text-gray-600">
                                            Unit Price: <span className="font-semibold text-gray-900">৳{item.price}</span>
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500 mb-1">Item Total</p>
                                    <p className="text-xl font-bold text-gray-900">
                                        ৳{(item.quantity * item.price).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Notes */}
                {order.notes && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <FiInfo className="text-primary-600" />
                            Order Notes
                        </h3>
                        <p className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            {order.notes}
                        </p>
                    </div>
                )}

                {/* Payment Summary */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <FiDollarSign className="text-primary-600" />
                        Payment Summary
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                            <span className="text-gray-600">Subtotal ({order.products?.length || 0} items)</span>
                            <span className="font-semibold text-gray-900">৳{order.subtotal || 0}</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                            <span className="text-gray-600 flex items-center gap-2">
                                <FiTruck size={16} />
                                Delivery Fee
                            </span>
                            <span className="font-semibold text-gray-900">৳{order.deliveryFee || 0}</span>
                        </div>
                        {order.discount > 0 && (
                            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                                <span className="text-green-600 flex items-center gap-2">
                                    <FiTag size={16} />
                                    Discount
                                </span>
                                <span className="font-semibold text-green-600">-৳{order.discount}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center pt-4 border-t-2 border-gray-300">
                            <span className="text-xl font-bold text-gray-900">Total Amount</span>
                            <span className="text-2xl font-bold text-primary-600">৳{order.totalAmount}</span>
                        </div>
                        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mt-4">
                            <div className="flex items-start gap-3">
                                <FiCreditCard className="text-primary-600 flex-shrink-0 mt-0.5" size={20} />
                                <div className="text-sm">
                                    <p className="font-medium text-primary-900 mb-1">Payment Method</p>
                                    <p className="text-primary-700">{order.paymentMethod}</p>
                                    <p className="text-primary-600 mt-2">
                                        Status: <span className="font-semibold">{order.paymentStatus}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Need Help Section */}
                <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-lg p-6 mt-6">
                    <h3 className="text-lg font-bold text-primary-900 mb-3 flex items-center gap-2">
                        <FiPhone className="text-primary-600" />
                        Need Help with Your Order?
                    </h3>
                    <p className="text-primary-700 mb-4">
                        Our customer support team is here to assist you with any questions or concerns about your order.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <a
                            href="tel:16469"
                            className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                        >
                            <FiPhone size={18} />
                            Call 16469
                        </a>
                        <Link
                            href="/help"
                            className="flex items-center gap-2 bg-white text-primary-600 border-2 border-primary-600 px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors font-medium"
                        >
                            <FiMail size={18} />
                            Contact Support
                        </Link>
                        <Link
                            href={`/track-order?orderNumber=${order.orderNumber}`}
                            className="flex items-center gap-2 bg-white text-primary-600 border-2 border-primary-600 px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors font-medium"
                        >
                            <FiTruck size={18} />
                            Track Order
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
