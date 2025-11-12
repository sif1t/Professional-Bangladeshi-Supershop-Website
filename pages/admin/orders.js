import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiArrowLeft, FiPackage, FiUser, FiMapPin, FiPhone, FiCalendar, FiDollarSign, FiDownload, FiPrinter, FiSearch, FiFilter, FiRefreshCw, FiTrendingUp, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function AdminOrders() {
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('all'); // all, today, week, month
    const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, amount-desc, amount-asc
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [showStats, setShowStats] = useState(true);

    useEffect(() => {
        checkAuth();
        fetchOrders();
    }, []);

    const checkAuth = () => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        if (!token || user.role !== 'admin') {
            router.push('/admin-login');
        }
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:5000/api/orders?limit=1000', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await res.json();

            if (data.success) {
                setOrders(data.orders || []);
                toast.success(`Loaded ${data.orders?.length || 0} orders`);
            } else {
                toast.error(data.message || 'Failed to fetch orders');
                setOrders([]);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to fetch orders. Please check connection.');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await res.json();

            if (data.success) {
                toast.success('Order status updated successfully!');
                fetchOrders();
            } else {
                toast.error(data.message || 'Failed to update order status');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error('Failed to update order status');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            Pending: 'bg-yellow-100 text-yellow-800',
            Confirmed: 'bg-blue-100 text-blue-800',
            Processing: 'bg-blue-100 text-blue-800',
            Packed: 'bg-indigo-100 text-indigo-800',
            Shipped: 'bg-purple-100 text-purple-800',
            Delivered: 'bg-green-100 text-green-800',
            Cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    // Advanced filtering
    const getFilteredOrders = () => {
        let filtered = [...orders];

        // Status filter
        if (filter !== 'all') {
            filtered = filtered.filter(order => order.status === filter);
        }

        // Search filter (by order ID, customer name, phone)
        if (searchTerm) {
            filtered = filtered.filter(order =>
                order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.contactNumber?.includes(searchTerm) ||
                order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Date filter
        if (dateFilter !== 'all') {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            filtered = filtered.filter(order => {
                const orderDate = new Date(order.createdAt);

                if (dateFilter === 'today') {
                    return orderDate >= today;
                } else if (dateFilter === 'week') {
                    const weekAgo = new Date(today);
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return orderDate >= weekAgo;
                } else if (dateFilter === 'month') {
                    const monthAgo = new Date(today);
                    monthAgo.setMonth(monthAgo.getMonth() - 1);
                    return orderDate >= monthAgo;
                }
                return true;
            });
        }

        // Sorting
        filtered.sort((a, b) => {
            if (sortBy === 'date-desc') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else if (sortBy === 'date-asc') {
                return new Date(a.createdAt) - new Date(b.createdAt);
            } else if (sortBy === 'amount-desc') {
                return (b.totalAmount || 0) - (a.totalAmount || 0);
            } else if (sortBy === 'amount-asc') {
                return (a.totalAmount || 0) - (b.totalAmount || 0);
            }
            return 0;
        });

        return filtered;
    };

    const filteredOrders = getFilteredOrders();

    const statusCounts = {
        all: orders.length,
        Pending: orders.filter(o => o.status === 'Pending').length,
        Confirmed: orders.filter(o => o.status === 'Confirmed').length,
        Processing: orders.filter(o => o.status === 'Processing').length,
        Shipped: orders.filter(o => o.status === 'Shipped').length,
        Delivered: orders.filter(o => o.status === 'Delivered').length,
        Cancelled: orders.filter(o => o.status === 'Cancelled').length
    };

    // Calculate statistics
    const calculateStats = () => {
        const total = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        const delivered = orders.filter(o => o.status === 'Delivered');
        const deliveredAmount = delivered.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        const pending = orders.filter(o => o.status === 'Pending');
        const cancelled = orders.filter(o => o.status === 'Cancelled');

        const avgOrderValue = orders.length > 0 ? total / orders.length : 0;

        return {
            totalOrders: orders.length,
            totalRevenue: total,
            deliveredOrders: delivered.length,
            deliveredRevenue: deliveredAmount,
            pendingOrders: pending.length,
            cancelledOrders: cancelled.length,
            avgOrderValue
        };
    };

    const stats = calculateStats();

    // Export functions
    const exportToCSV = () => {
        const headers = ['Order ID', 'Date', 'Customer', 'Phone', 'Total', 'Status', 'Payment Method'];
        const rows = filteredOrders.map(order => [
            order._id?.slice(-8).toUpperCase(),
            new Date(order.createdAt).toLocaleDateString(),
            order.user?.name || 'N/A',
            order.contactNumber || 'N/A',
            `৳${order.totalAmount || 0}`,
            order.status,
            order.paymentMethod || 'N/A'
        ]);

        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        toast.success('Orders exported successfully!');
    };

    const printOrders = () => {
        window.print();
        toast.success('Print dialog opened!');
    };

    const bulkUpdateStatus = async (newStatus) => {
        if (selectedOrders.length === 0) {
            toast.warning('Please select orders first');
            return;
        }

        if (!confirm(`Update ${selectedOrders.length} order(s) to ${newStatus}?`)) return;

        try {
            const promises = selectedOrders.map(orderId =>
                fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ status: newStatus })
                })
            );

            await Promise.all(promises);
            toast.success(`Updated ${selectedOrders.length} orders!`);
            setSelectedOrders([]);
            fetchOrders();
        } catch (error) {
            toast.error('Failed to update orders');
        }
    };

    const toggleOrderSelection = (orderId) => {
        setSelectedOrders(prev =>
            prev.includes(orderId)
                ? prev.filter(id => id !== orderId)
                : [...prev, orderId]
        );
    };

    const selectAllOrders = () => {
        if (selectedOrders.length === filteredOrders.length) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders(filteredOrders.map(o => o._id));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading orders...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Link href="/admin">
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <FiArrowLeft className="text-xl" />
                                </button>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Orders Management</h1>
                                <p className="text-gray-600">View and manage customer orders</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={fetchOrders}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <FiRefreshCw />
                                Refresh
                            </button>
                            <button
                                onClick={exportToCSV}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                <FiDownload />
                                Export CSV
                            </button>
                            <button
                                onClick={printOrders}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                            >
                                <FiPrinter />
                                Print
                            </button>
                        </div>
                    </div>
                </div>

                {/* Statistics Dashboard */}
                {showStats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Orders</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
                                </div>
                                <FiPackage className="text-4xl text-blue-600" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Revenue</p>
                                    <p className="text-3xl font-bold text-green-600">৳{stats.totalRevenue.toLocaleString()}</p>
                                </div>
                                <FiTrendingUp className="text-4xl text-green-600" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Avg Order Value</p>
                                    <p className="text-3xl font-bold text-purple-600">৳{stats.avgOrderValue.toFixed(0)}</p>
                                </div>
                                <FiDollarSign className="text-4xl text-purple-600" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Pending Orders</p>
                                    <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
                                </div>
                                <FiClock className="text-4xl text-yellow-600" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters and Search */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search orders..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            />
                        </div>

                        {/* Date Filter */}
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                        </select>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        >
                            <option value="date-desc">Newest First</option>
                            <option value="date-asc">Oldest First</option>
                            <option value="amount-desc">Highest Amount</option>
                            <option value="amount-asc">Lowest Amount</option>
                        </select>

                        {/* Results */}
                        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded-lg">
                            <span className="text-sm text-gray-700">
                                Showing {filteredOrders.length} of {orders.length}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedOrders.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between">
                            <span className="text-blue-900 font-medium">
                                {selectedOrders.length} order(s) selected
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => bulkUpdateStatus('Processing')}
                                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                                >
                                    Mark Processing
                                </button>
                                <button
                                    onClick={() => bulkUpdateStatus('Shipped')}
                                    className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                                >
                                    Mark Shipped
                                </button>
                                <button
                                    onClick={() => bulkUpdateStatus('Delivered')}
                                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                                >
                                    Mark Delivered
                                </button>
                                <button
                                    onClick={() => setSelectedOrders([])}
                                    className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                                >
                                    Clear Selection
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Status Filter Tabs */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex flex-wrap gap-2">
                        {[
                            { key: 'all', label: 'All Orders' },
                            { key: 'Pending', label: 'Pending' },
                            { key: 'Confirmed', label: 'Confirmed' },
                            { key: 'Processing', label: 'Processing' },
                            { key: 'Shipped', label: 'Shipped' },
                            { key: 'Delivered', label: 'Delivered' },
                            { key: 'Cancelled', label: 'Cancelled' }
                        ].map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => setFilter(key)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === key
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {label} ({statusCounts[key] || 0})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Select All */}
                {filteredOrders.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedOrders.length === filteredOrders.length}
                                onChange={selectAllOrders}
                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Select All Orders</span>
                        </label>
                    </div>
                )}

                {/* Orders List */}
                <div className="space-y-4">
                    {filteredOrders.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-12 text-center">
                            <FiPackage className="mx-auto text-gray-400 text-5xl mb-4" />
                            <p className="text-gray-600 text-lg">No {filter !== 'all' ? filter : ''} orders found</p>
                        </div>
                    ) : (
                        filteredOrders.map(order => (
                            <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                                {/* Order Header */}
                                <div className="flex flex-wrap items-start justify-between mb-4 pb-4 border-b">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedOrders.includes(order._id)}
                                            onChange={() => toggleOrderSelection(order._id)}
                                            className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                        />
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                Order #{order._id?.slice(-8).toUpperCase()}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <FiCalendar />
                                                <span>{new Date(order.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                            {order.status?.toUpperCase()}
                                        </span>
                                        <span className="text-lg font-bold text-green-600">
                                            ৳{order.totalAmount?.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Customer & Shipping Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                            <FiUser /> Customer Information
                                        </h4>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p><strong>Name:</strong> {order.user?.name || 'N/A'}</p>
                                            <p className="flex items-center gap-1">
                                                <FiPhone size={14} />
                                                {order.contactNumber || order.user?.mobile || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                            <FiMapPin /> Shipping Address
                                        </h4>
                                        <div className="text-sm text-gray-600">
                                            <p>{order.shippingAddress?.addressLine1}</p>
                                            {order.shippingAddress?.addressLine2 && (
                                                <p>{order.shippingAddress.addressLine2}</p>
                                            )}
                                            <p>
                                                {order.shippingAddress?.area}, {order.shippingAddress?.city}
                                                {order.shippingAddress?.zipCode && ` - ${order.shippingAddress.zipCode}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="mb-4">
                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <FiPackage /> Order Items ({order.products?.length || 0})
                                    </h4>
                                    <div className="space-y-2">
                                        {order.products?.map((item, index) => (
                                            <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    {item.image && (
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-12 h-12 object-cover rounded"
                                                        />
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-gray-900">{item.name || 'Product'}</p>
                                                        <p className="text-sm text-gray-600">
                                                            Qty: {item.quantity} × ৳{item.price?.toLocaleString()}
                                                            {item.variant && <span className="ml-2 text-gray-500">({item.variant})</span>}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="font-semibold text-gray-900">
                                                    ৳{(item.quantity * item.price)?.toLocaleString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Subtotal:</span>
                                            <span className="font-medium">৳{order.subtotal?.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Delivery Fee:</span>
                                            <span className="font-medium">৳{order.deliveryFee?.toLocaleString()}</span>
                                        </div>
                                        {order.discount > 0 && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Discount:</span>
                                                <span className="font-medium text-red-600">-৳{order.discount?.toLocaleString()}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between pt-2 border-t border-gray-300">
                                            <span className="font-semibold text-gray-900">Total Amount:</span>
                                            <span className="font-bold text-green-600 text-lg">
                                                ৳{order.totalAmount?.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Info */}
                                <div className="flex items-center justify-between mb-4 p-3 bg-blue-50 rounded-lg">
                                    <div className="flex items-center gap-2 text-sm">
                                        <FiDollarSign className="text-blue-600" />
                                        <span className="text-gray-700">Payment Method:</span>
                                        <span className="font-semibold text-gray-900">
                                            {order.paymentMethod}
                                        </span>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.paymentStatus === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {order.paymentStatus}
                                    </span>
                                </div>

                                {/* Status Update Actions */}
                                <div className="flex flex-wrap gap-2">
                                    <span className="text-sm font-medium text-gray-700 mr-2">Update Status:</span>
                                    {['Pending', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => updateOrderStatus(order._id, status)}
                                            disabled={order.status === status}
                                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${order.status === status
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Summary Stats */}
                {orders.length > 0 && (
                    <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Order Statistics</h2>
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                            <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                <p className="text-2xl font-bold text-yellow-600">{statusCounts.Pending}</p>
                                <p className="text-sm text-gray-600">Pending</p>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <p className="text-2xl font-bold text-blue-600">{statusCounts.Confirmed}</p>
                                <p className="text-sm text-gray-600">Confirmed</p>
                            </div>
                            <div className="text-center p-4 bg-indigo-50 rounded-lg">
                                <p className="text-2xl font-bold text-indigo-600">{statusCounts.Processing}</p>
                                <p className="text-sm text-gray-600">Processing</p>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                                <p className="text-2xl font-bold text-purple-600">{statusCounts.Shipped}</p>
                                <p className="text-sm text-gray-600">Shipped</p>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <p className="text-2xl font-bold text-green-600">{statusCounts.Delivered}</p>
                                <p className="text-sm text-gray-600">Delivered</p>
                            </div>
                            <div className="text-center p-4 bg-red-50 rounded-lg">
                                <p className="text-2xl font-bold text-red-600">{statusCounts.Cancelled}</p>
                                <p className="text-sm text-gray-600">Cancelled</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
