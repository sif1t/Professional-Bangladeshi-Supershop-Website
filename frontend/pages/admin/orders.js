import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiArrowLeft, FiPackage, FiUser, FiMapPin, FiPhone, FiCalendar, FiDollarSign, FiDownload, FiPrinter, FiSearch, FiFilter, FiRefreshCw, FiTrendingUp, FiClock, FiCheckCircle, FiXCircle, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function AdminOrders() {
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('all'); // all, today, week, month, custom
    const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, amount-desc, amount-asc
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [showStats, setShowStats] = useState(true);
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

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
                toast.success(`${data.orders?.length || 0} টি অর্ডার লোড হয়েছে`);
            } else {
                toast.error(data.message || 'অর্ডার লোড করতে ব্যর্থ');
                setOrders([]);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('অর্ডার লোড করতে ব্যর্থ। দয়া করে সংযোগ চেক করুন।');
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
                toast.success('অর্ডার স্ট্যাটাস সফলভাবে আপডেট হয়েছে!');
                fetchOrders();
            } else {
                toast.error(data.message || 'অর্ডার স্ট্যাটাস আপডেট করতে ব্যর্থ');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error('অর্ডার স্ট্যাটাস আপডেট করতে ব্যর্থ');
        }
    };

    const updatePaymentStatus = async (orderId, newPaymentStatus) => {
        try {
            const res = await fetch(`http://localhost:5000/api/orders/${orderId}/payment`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ paymentStatus: newPaymentStatus })
            });

            const data = await res.json();

            if (data.success) {
                toast.success('পেমেন্ট স্ট্যাটাস সফলভাবে আপডেট হয়েছে!');
                fetchOrders();
            } else {
                toast.error(data.message || 'পেমেন্ট স্ট্যাটাস আপডেট করতে ব্যর্থ');
            }
        } catch (error) {
            console.error('Error updating payment status:', error);
            toast.error('পেমেন্ট স্ট্যাটাস আপডেট করতে ব্যর্থ');
        }
    };

    const deleteOrder = async (orderId) => {
        if (!confirm('আপনি কি নিশ্চিত এই অর্ডার ডিলিট করতে চান? এটি ডাটাবেস থেকে স্থায়ীভাবে মুছে যাবে।')) {
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await res.json();

            if (data.success) {
                toast.success('অর্ডার সফলভাবে ডিলিট হয়েছে!');
                fetchOrders();
            } else {
                toast.error(data.message || 'অর্ডার ডিলিট করতে ব্যর্থ');
            }
        } catch (error) {
            console.error('Error deleting order:', error);
            toast.error('অর্ডার ডিলিট করতে ব্যর্থ');
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
                } else if (dateFilter === 'custom') {
                    if (customStartDate && customEndDate) {
                        const startDate = new Date(customStartDate);
                        startDate.setHours(0, 0, 0, 0);
                        const endDate = new Date(customEndDate);
                        endDate.setHours(23, 59, 59, 999);
                        return orderDate >= startDate && orderDate <= endDate;
                    } else if (customStartDate) {
                        const startDate = new Date(customStartDate);
                        startDate.setHours(0, 0, 0, 0);
                        return orderDate >= startDate;
                    } else if (customEndDate) {
                        const endDate = new Date(customEndDate);
                        endDate.setHours(23, 59, 59, 999);
                        return orderDate <= endDate;
                    }
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

    // Format date for display
    const formatDateRange = () => {
        if (dateFilter === 'custom' && (customStartDate || customEndDate)) {
            const start = customStartDate ? new Date(customStartDate).toLocaleDateString('bn-BD') : 'শুরু';
            const end = customEndDate ? new Date(customEndDate).toLocaleDateString('bn-BD') : 'আজ';
            return `${start} - ${end}`;
        }
        return '';
    };

    // Export functions
    const exportToCSV = () => {
        if (filteredOrders.length === 0) {
            toast.warning('এক্সপোর্ট করার জন্য কোনো অর্ডার নেই!');
            return;
        }

        // CSV headers
        const headers = [
            'Order ID',
            'Order Number',
            'Date',
            'Customer Name',
            'Phone',
            'Address',
            'Products',
            'Quantity',
            'Subtotal',
            'Delivery Fee',
            'Discount',
            'Total Amount',
            'Status',
            'Payment Method',
            'Payment Status'
        ];

        // CSV rows with complete data
        const rows = filteredOrders.map(order => {
            const products = order.products || [];
            const productNames = products.map(p => `${p.name || 'N/A'} (${p.quantity || 0})`).join('; ');
            const totalQty = products.reduce((sum, p) => sum + (p.quantity || 0), 0);

            return [
                order._id?.slice(-8).toUpperCase() || 'N/A',
                order.orderNumber || 'N/A',
                new Date(order.createdAt).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                order.user?.name || 'Guest',
                order.contactNumber || 'N/A',
                `"${order.shippingAddress?.addressLine1 || 'N/A'}, ${order.shippingAddress?.city || ''}"`,
                `"${productNames}"`,
                totalQty,
                order.subtotal || 0,
                order.deliveryFee || 0,
                order.discount || 0,
                order.totalAmount || 0,
                order.status || 'Pending',
                order.paymentMethod || 'Cash on Delivery',
                order.paymentStatus || 'Unpaid'
            ].map(cell => {
                // Escape quotes and commas properly
                const cellStr = String(cell);
                if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
                    return `"${cellStr.replace(/"/g, '""')}"`;
                }
                return cellStr;
            });
        });

        // Create CSV content with BOM for Excel compatibility
        const csvContent = '\ufeff' + [headers, ...rows].map(row => row.join(',')).join('\n');

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        // Generate filename with date range if custom filter is active
        let filename = 'orders_export';
        if (dateFilter === 'custom' && customStartDate && customEndDate) {
            filename += `_${customStartDate}_to_${customEndDate}`;
        } else {
            filename += `_${new Date().toISOString().split('T')[0]}`;
        }
        link.download = `${filename}.csv`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success(`${filteredOrders.length} টি অর্ডার সফলভাবে এক্সপোর্ট হয়েছে!`);
    };

    const printOrders = () => {
        window.print();
        toast.success('প্রিন্ট ডায়ালগ খোলা হয়েছে!');
    };

    const bulkUpdateStatus = async (newStatus) => {
        if (selectedOrders.length === 0) {
            toast.warning('প্রথমে অর্ডার নির্বাচন করুন');
            return;
        }

        if (!confirm(`${selectedOrders.length} টি অর্ডার ${newStatus} এ আপডেট করবেন?`)) return;

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
            toast.success(`${selectedOrders.length} টি অর্ডার আপডেট হয়েছে!`);
            setSelectedOrders([]);
            fetchOrders();
        } catch (error) {
            toast.error('অর্ডার আপডেট করতে ব্যর্থ');
        }
    };

    const bulkDeleteOrders = async () => {
        if (selectedOrders.length === 0) {
            toast.warning('প্রথমে অর্ডার নির্বাচন করুন');
            return;
        }

        if (!confirm(`আপনি কি নিশ্চিত ${selectedOrders.length} টি অর্ডার ডিলিট করতে চান? এটি ডাটাবেস থেকে স্থায়ীভাবে মুছে যাবে।`)) {
            return;
        }

        try {
            const promises = selectedOrders.map(orderId =>
                fetch(`http://localhost:5000/api/orders/${orderId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
            );

            await Promise.all(promises);
            toast.success(`${selectedOrders.length} টি অর্ডার সফলভাবে ডিলিট হয়েছে!`);
            setSelectedOrders([]);
            fetchOrders();
        } catch (error) {
            toast.error('অর্ডার ডিলিট করতে ব্যর্থ');
        }
    };

    // Quick date presets
    const setQuickDateRange = (type) => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        switch (type) {
            case 'yesterday':
                setCustomStartDate(yesterday.toISOString().split('T')[0]);
                setCustomEndDate(yesterday.toISOString().split('T')[0]);
                break;
            case 'last7days':
                const week = new Date(today);
                week.setDate(week.getDate() - 7);
                setCustomStartDate(week.toISOString().split('T')[0]);
                setCustomEndDate(today.toISOString().split('T')[0]);
                break;
            case 'last30days':
                const month = new Date(today);
                month.setDate(month.getDate() - 30);
                setCustomStartDate(month.toISOString().split('T')[0]);
                setCustomEndDate(today.toISOString().split('T')[0]);
                break;
            case 'thisMonth':
                const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                setCustomStartDate(firstDay.toISOString().split('T')[0]);
                setCustomEndDate(today.toISOString().split('T')[0]);
                break;
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
                <div className="text-lg">অর্ডার লোড হচ্ছে...</div>
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
                                <h1 className="text-3xl font-bold text-gray-800">অর্ডার ম্যানেজমেন্ট</h1>
                                <p className="text-gray-600">গ্রাহকদের অর্ডার দেখুন এবং পরিচালনা করুন</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={fetchOrders}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <FiRefreshCw />
                                রিফ্রেশ করুন
                            </button>
                            <button
                                onClick={exportToCSV}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                <FiDownload />
                                CSV এক্সপোর্ট
                            </button>
                            <button
                                onClick={printOrders}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                            >
                                <FiPrinter />
                                প্রিন্ট করুন
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
                                    <p className="text-sm text-gray-600">মোট অর্ডার</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
                                </div>
                                <FiPackage className="text-4xl text-blue-600" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">মোট আয়</p>
                                    <p className="text-3xl font-bold text-green-600">৳{stats.totalRevenue.toLocaleString()}</p>
                                </div>
                                <FiTrendingUp className="text-4xl text-green-600" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">গড় অর্ডার মূল্য</p>
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
                        <div className="relative">
                            <select
                                value={dateFilter}
                                onChange={(e) => {
                                    setDateFilter(e.target.value);
                                    if (e.target.value === 'custom') {
                                        setShowDatePicker(true);
                                    } else {
                                        setShowDatePicker(false);
                                    }
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 w-full"
                            >
                                <option value="all">সব সময়</option>
                                <option value="today">আজ</option>
                                <option value="week">এই সপ্তাহ</option>
                                <option value="month">এই মাস</option>
                                <option value="custom">নির্দিষ্ট তারিখ</option>
                            </select>
                        </div>

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

                    {/* Custom Date Range Picker */}
                    {dateFilter === 'custom' && (
                        <div className="mt-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl shadow-lg">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-600 rounded-lg">
                                    <FiCalendar className="text-white text-xl" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">📅 নির্দিষ্ট তারিখ নির্বাচন করুন</h3>
                            </div>

                            {/* Quick Date Presets */}
                            <div className="mb-4 p-3 bg-white rounded-lg border border-blue-200">
                                <p className="text-xs font-semibold text-gray-600 mb-2">দ্রুত নির্বাচন:</p>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setQuickDateRange('yesterday')}
                                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors"
                                    >
                                        গতকাল
                                    </button>
                                    <button
                                        onClick={() => setQuickDateRange('last7days')}
                                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors"
                                    >
                                        শেষ ৭ দিন
                                    </button>
                                    <button
                                        onClick={() => setQuickDateRange('last30days')}
                                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors"
                                    >
                                        শেষ ৩০ দিন
                                    </button>
                                    <button
                                        onClick={() => setQuickDateRange('thisMonth')}
                                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors"
                                    >
                                        এই মাস
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <span className="text-blue-600">📆</span> শুরুর তারিখ
                                    </label>
                                    <input
                                        type="date"
                                        value={customStartDate}
                                        onChange={(e) => setCustomStartDate(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <span className="text-blue-600">📆</span> শেষের তারিখ
                                    </label>
                                    <input
                                        type="date"
                                        value={customEndDate}
                                        onChange={(e) => setCustomEndDate(e.target.value)}
                                        min={customStartDate}
                                        className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 font-medium"
                                    />
                                </div>
                                <div className="flex items-end gap-2">
                                    <button
                                        onClick={() => {
                                            setCustomStartDate('');
                                            setCustomEndDate('');
                                        }}
                                        className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                                    >
                                        🔄 রিসেট
                                    </button>
                                    <button
                                        onClick={exportToCSV}
                                        disabled={!customStartDate && !customEndDate}
                                        className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        <FiDownload size={18} />
                                        ডাউনলোড
                                    </button>
                                </div>
                            </div>
                            {(customStartDate || customEndDate) && (
                                <div className="mt-4 p-4 bg-white rounded-lg border-2 border-green-300 shadow-md">
                                    <div className="flex items-start gap-3">
                                        <div className="text-2xl">✅</div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-700 font-medium">
                                                <span className="font-bold text-blue-600">নির্বাচিত সময়সীমা:</span> {formatDateRange()}
                                            </p>
                                            <p className="text-sm text-green-600 mt-1 font-semibold">
                                                📊 ফিল্টারকৃত অর্ডার: {filteredOrders.length} টি
                                            </p>
                                            {filteredOrders.length > 0 && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    💰 মোট টাকা: ৳{filteredOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0).toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Bulk Actions */}
                {selectedOrders.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <span className="text-blue-900 font-medium">
                                {selectedOrders.length} টি অর্ডার নির্বাচিত
                            </span>
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    onClick={() => bulkUpdateStatus('Processing')}
                                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                                >
                                    প্রসেসিং করুন
                                </button>
                                <button
                                    onClick={() => bulkUpdateStatus('Shipped')}
                                    className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                                >
                                    শিপড করুন
                                </button>
                                <button
                                    onClick={() => bulkUpdateStatus('Delivered')}
                                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                                >
                                    ডেলিভার্ড করুন
                                </button>
                                <button
                                    onClick={bulkDeleteOrders}
                                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 flex items-center gap-1"
                                >
                                    <FiTrash2 size={14} />
                                    সব ডিলিট করুন
                                </button>
                                <button
                                    onClick={() => setSelectedOrders([])}
                                    className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                                >
                                    নির্বাচন বাতিল
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Status Filter Tabs */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex flex-wrap gap-2">
                        {[
                            { key: 'all', label: 'সব অর্ডার' },
                            { key: 'Pending', label: 'পেন্ডিং' },
                            { key: 'Confirmed', label: 'নিশ্চিত' },
                            { key: 'Processing', label: 'প্রসেসিং' },
                            { key: 'Shipped', label: 'শিপড' },
                            { key: 'Delivered', label: 'ডেলিভার্ড' },
                            { key: 'Cancelled', label: 'বাতিল' }
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
                            <span className="text-sm font-medium text-gray-700">সব অর্ডার নির্বাচন করুন</span>
                        </label>
                    </div>
                )}

                {/* Orders List */}
                <div className="space-y-4">
                    {filteredOrders.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-12 text-center">
                            <FiPackage className="mx-auto text-gray-400 text-5xl mb-4" />
                            <p className="text-gray-600 text-lg">{filter !== 'all' ? filter : ''} কোনো অর্ডার পাওয়া যায়নি</p>
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
                                            <FiUser /> গ্রাহকের তথ্য
                                        </h4>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p><strong>নাম:</strong> {order.user?.name || 'N/A'}</p>
                                            <p className="flex items-center gap-1">
                                                <FiPhone size={14} />
                                                {order.contactNumber || order.user?.mobile || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                            <FiMapPin /> শিপিং ঠিকানা
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
                                        <FiPackage /> অর্ডার পণ্য ({order.products?.length || 0})
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
                                                            পরিমাণ: {item.quantity} × ৳{item.price?.toLocaleString()}
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
                                            <span className="text-gray-600">উপমোট:</span>
                                            <span className="font-medium">৳{order.subtotal?.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">ডেলিভারি চার্জ:</span>
                                            <span className="font-medium">৳{order.deliveryFee?.toLocaleString()}</span>
                                        </div>
                                        {order.discount > 0 && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">ছাড়:</span>
                                                <span className="font-medium text-red-600">-৳{order.discount?.toLocaleString()}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between pt-2 border-t border-gray-300">
                                            <span className="font-semibold text-gray-900">মোট টাকা:</span>
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
                                        <span className="text-gray-700">পেমেন্ট পদ্ধতি:</span>
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
                                <div className="flex flex-wrap gap-2 mb-3">
                                    <span className="text-sm font-medium text-gray-700 mr-2">স্ট্যাটাস আপডেট করুন:</span>
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

                                {/* Payment Status Update Actions */}
                                <div className="flex flex-wrap gap-2 items-center mb-3">
                                    <span className="text-sm font-medium text-gray-700 mr-2">পেমেন্ট স্ট্যাটাস আপডেট করুন:</span>
                                    {['Pending', 'Completed', 'Failed'].map(payStatus => (
                                        <button
                                            key={payStatus}
                                            onClick={() => updatePaymentStatus(order._id, payStatus)}
                                            disabled={order.paymentStatus === payStatus}
                                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${order.paymentStatus === payStatus
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : payStatus === 'Completed'
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                    : payStatus === 'Failed'
                                                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                                        : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                }`}
                                        >
                                            {payStatus === 'Pending' ? 'পেন্ডিং' : payStatus === 'Completed' ? 'সম্পন্ন' : 'ব্যর্থ'}
                                        </button>
                                    ))}
                                </div>

                                {/* Delete Order Action */}
                                <div className="flex justify-end pt-3 border-t border-gray-200">
                                    <button
                                        onClick={() => deleteOrder(order._id)}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                                    >
                                        <FiTrash2 size={16} />
                                        অর্ডার ডিলিট করুন
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Summary Stats */}
                {orders.length > 0 && (
                    <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">অর্ডার পরিসংখ্যান</h2>
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                            <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                <p className="text-2xl font-bold text-yellow-600">{statusCounts.Pending}</p>
                                <p className="text-sm text-gray-600">পেন্ডিং</p>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <p className="text-2xl font-bold text-blue-600">{statusCounts.Confirmed}</p>
                                <p className="text-sm text-gray-600">নিশ্চিত</p>
                            </div>
                            <div className="text-center p-4 bg-indigo-50 rounded-lg">
                                <p className="text-2xl font-bold text-indigo-600">{statusCounts.Processing}</p>
                                <p className="text-sm text-gray-600">প্রসেসিং</p>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                                <p className="text-2xl font-bold text-purple-600">{statusCounts.Shipped}</p>
                                <p className="text-sm text-gray-600">শিপড</p>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <p className="text-2xl font-bold text-green-600">{statusCounts.Delivered}</p>
                                <p className="text-sm text-gray-600">ডেলিভার্ড</p>
                            </div>
                            <div className="text-center p-4 bg-red-50 rounded-lg">
                                <p className="text-2xl font-bold text-red-600">{statusCounts.Cancelled}</p>
                                <p className="text-sm text-gray-600">বাতিল</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
