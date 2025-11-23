import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FiCheck, FiX, FiEye, FiDownload, FiFilter } from 'react-icons/fi';
import { toast } from 'react-toastify';
import api from '../../lib/axios';
import { formatPrice } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import Image from 'next/image';

export default function AdminManualPayments() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending'); // all, pending, approved, rejected
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/admin/manual-payments');
            return;
        }
        if (user?.role !== 'admin') {
            toast.error('Access denied. Admin only.');
            router.push('/');
            return;
        }
        fetchOrders();
    }, [isAuthenticated, user, filter]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/admin/manual-payments', {
                params: { status: filter },
            });
            setOrders(data.orders || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleApprove = async (orderId) => {
        if (!confirm('Are you sure you want to approve this payment?')) return;

        setProcessing(true);
        try {
            const { data } = await api.post(`/admin/manual-payments/${orderId}/approve`);
            if (data.success) {
                toast.success('Payment approved successfully!');
                fetchOrders();
                setShowModal(false);
            }
        } catch (error) {
            console.error('Error approving payment:', error);
            toast.error(error.response?.data?.message || 'Failed to approve payment');
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async (orderId) => {
        const reason = prompt('Enter rejection reason (optional):');

        setProcessing(true);
        try {
            const { data } = await api.post(`/admin/manual-payments/${orderId}/reject`, {
                reason,
            });
            if (data.success) {
                toast.success('Payment rejected');
                fetchOrders();
                setShowModal(false);
            }
        } catch (error) {
            console.error('Error rejecting payment:', error);
            toast.error(error.response?.data?.message || 'Failed to reject payment');
        } finally {
            setProcessing(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            pending_verification: 'bg-blue-100 text-blue-800',
            cod_pending: 'bg-purple-100 text-purple-800',
        };
        return badges[status] || 'bg-gray-100 text-gray-800';
    };

    const getPaymentMethodColor = (method) => {
        const colors = {
            bKash: 'text-pink-600',
            Nagad: 'text-orange-600',
            Rocket: 'text-purple-600',
            'Cash on Delivery': 'text-green-600',
        };
        return colors[method] || 'text-gray-600';
    };

    if (!isAuthenticated || user?.role !== 'admin') {
        return null;
    }

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="container-custom max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">Manual Payment Orders</h1>
                    <p className="text-gray-600">Review and verify customer payments</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex items-center space-x-2">
                        <FiFilter className="text-gray-600" />
                        <span className="font-semibold text-gray-700">Filter:</span>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                All Orders
                            </button>
                            <button
                                onClick={() => setFilter('pending')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'pending'
                                        ? 'bg-yellow-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Pending ({orders.filter(o => o.manualPayment?.verificationStatus === 'pending').length})
                            </button>
                            <button
                                onClick={() => setFilter('approved')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'approved'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Approved
                            </button>
                            <button
                                onClick={() => setFilter('rejected')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'rejected'
                                        ? 'bg-red-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Rejected
                            </button>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
                        <p className="mt-4 text-gray-600">Loading orders...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <p className="text-gray-600 text-lg">No orders found</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-lg font-bold">Order #{order._id.slice(-8)}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(order.manualPayment?.verificationStatus)}`}>
                                                {order.manualPayment?.verificationStatus?.toUpperCase() || 'PENDING'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {new Date(order.createdAt).toLocaleString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-primary-600">
                                            {formatPrice(order.totalAmount)}
                                        </p>
                                        <p className={`text-sm font-semibold ${getPaymentMethodColor(order.paymentMethod)}`}>
                                            {order.paymentMethod}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    <div>
                                        <p className="text-xs text-gray-600 mb-1">Customer</p>
                                        <p className="font-semibold">{order.customerName || order.user?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600 mb-1">Phone</p>
                                        <p className="font-semibold">{order.contactNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600 mb-1">Items</p>
                                        <p className="font-semibold">{order.items?.length || 0} items</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600 mb-1">Location</p>
                                        <p className="font-semibold">{order.deliveryLocation || 'N/A'}</p>
                                    </div>
                                </div>

                                {/* Payment Details */}
                                {order.paymentMethod !== 'Cash on Delivery' && (
                                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                        <p className="text-sm font-semibold mb-2">Payment Details:</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-600">Transaction ID</p>
                                                <p className="font-mono font-semibold">{order.manualPayment?.transactionId || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600">Account Number</p>
                                                <p className="font-mono font-semibold">{order.manualPayment?.accountNumber || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => handleViewOrder(order)}
                                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                                    >
                                        <FiEye className="mr-2" />
                                        View Details
                                    </button>

                                    {order.manualPayment?.verificationStatus === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleApprove(order._id)}
                                                disabled={processing}
                                                className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center disabled:bg-gray-400"
                                            >
                                                <FiCheck className="mr-2" />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(order._id)}
                                                disabled={processing}
                                                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center disabled:bg-gray-400"
                                            >
                                                <FiX className="mr-2" />
                                                Reject
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Order Detail Modal */}
                {showModal && selectedOrder && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
                                <h2 className="text-2xl font-bold">Order Details</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <FiX className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Order Info */}
                                <div>
                                    <h3 className="font-semibold mb-3">Order Information</h3>
                                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                        <div>
                                            <p className="text-sm text-gray-600">Order ID</p>
                                            <p className="font-semibold">{selectedOrder._id}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Date</p>
                                            <p className="font-semibold">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Customer</p>
                                            <p className="font-semibold">{selectedOrder.customerName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Phone</p>
                                            <p className="font-semibold">{selectedOrder.contactNumber}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-sm text-gray-600">Address</p>
                                            <p className="font-semibold">{selectedOrder.shippingAddress?.addressLine1}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Items */}
                                <div>
                                    <h3 className="font-semibold mb-3">Order Items</h3>
                                    <div className="space-y-3">
                                        {selectedOrder.items?.map((item, index) => (
                                            <div key={index} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                                                {item.image && (
                                                    <div className="relative w-16 h-16 flex-shrink-0 bg-gray-200 rounded">
                                                        <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            fill
                                                            className="object-cover rounded"
                                                        />
                                                    </div>
                                                )}
                                                <div className="flex-1">
                                                    <p className="font-semibold">{item.name}</p>
                                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                </div>
                                                <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Payment Details */}
                                <div>
                                    <h3 className="font-semibold mb-3">Payment Details</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                        <div className="flex justify-between">
                                            <span>Payment Method:</span>
                                            <span className={`font-semibold ${getPaymentMethodColor(selectedOrder.paymentMethod)}`}>
                                                {selectedOrder.paymentMethod}
                                            </span>
                                        </div>
                                        {selectedOrder.paymentMethod !== 'Cash on Delivery' && (
                                            <>
                                                <div className="flex justify-between">
                                                    <span>Transaction ID:</span>
                                                    <span className="font-mono font-semibold">
                                                        {selectedOrder.manualPayment?.transactionId}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Paid To Account:</span>
                                                    <span className="font-mono font-semibold">
                                                        {selectedOrder.manualPayment?.accountNumber}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                        <div className="border-t pt-3 space-y-2">
                                            <div className="flex justify-between">
                                                <span>Subtotal:</span>
                                                <span>{formatPrice(selectedOrder.subtotal)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Delivery Fee:</span>
                                                <span>{formatPrice(selectedOrder.deliveryFee)}</span>
                                            </div>
                                            <div className="flex justify-between text-lg font-bold">
                                                <span>Total:</span>
                                                <span className="text-primary-600">{formatPrice(selectedOrder.totalAmount)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Screenshot */}
                                {selectedOrder.manualPayment?.screenshot && (
                                    <div>
                                        <h3 className="font-semibold mb-3">Payment Screenshot</h3>
                                        <div className="border rounded-lg p-4 bg-gray-50">
                                            <img
                                                src={selectedOrder.manualPayment.screenshot}
                                                alt="Payment Screenshot"
                                                className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                                            />
                                            <a
                                                href={selectedOrder.manualPayment.screenshot}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-4 flex items-center justify-center text-primary-600 hover:text-primary-700"
                                            >
                                                <FiDownload className="mr-2" />
                                                Download Screenshot
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                {selectedOrder.manualPayment?.verificationStatus === 'pending' && (
                                    <div className="flex space-x-4 pt-4 border-t">
                                        <button
                                            onClick={() => handleApprove(selectedOrder._id)}
                                            disabled={processing}
                                            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center disabled:bg-gray-400"
                                        >
                                            <FiCheck className="mr-2" />
                                            {processing ? 'Processing...' : 'Approve Payment'}
                                        </button>
                                        <button
                                            onClick={() => handleReject(selectedOrder._id)}
                                            disabled={processing}
                                            className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center disabled:bg-gray-400"
                                        >
                                            <FiX className="mr-2" />
                                            {processing ? 'Processing...' : 'Reject Payment'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
