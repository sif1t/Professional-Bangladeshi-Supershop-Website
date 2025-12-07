import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiArrowLeft, FiUsers, FiSearch, FiFilter, FiRefreshCw, FiUserCheck, FiUserX, FiShield, FiUser, FiTrash2, FiEdit2, FiMail, FiPhone, FiCalendar, FiPackage } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { API_URL } from '../../lib/api';

export default function AdminUsers() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [filter, setFilter] = useState({
        role: 'all',
        verified: 'all',
        search: ''
    });
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [lastRefresh, setLastRefresh] = useState(new Date());

    const checkAuth = useCallback(() => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        if (!token || user.role !== 'admin') {
            router.push('/admin-login');
        }
    }, [router]);

    const fetchUsers = useCallback(async (silent = false) => {
        try {
            if (!silent) setLoading(true);

            const params = new URLSearchParams();
            if (filter.role !== 'all') params.append('role', filter.role);
            if (filter.verified !== 'all') params.append('verified', filter.verified);
            if (filter.search) params.append('search', filter.search);

            const res = await fetch(`${API_URL}/admin/users?${params.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await res.json();

            if (data.success) {
                setUsers(data.users || []);
                setLastRefresh(new Date());
                if (!silent) {
                    toast.success(`${data.users?.length || 0} টি ইউজার লোড হয়েছে`);
                }
            } else {
                toast.error(data.message || 'ইউজার লোড করতে ব্যর্থ');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            if (!silent) {
                toast.error('ইউজার লোড করতে ব্যর্থ');
            }
        } finally {
            if (!silent) setLoading(false);
        }
    }, [filter]);

    const fetchStats = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/admin/users/stats/overview`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await res.json();

            if (data.success) {
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    }, []);

    // Initial load and auth check
    useEffect(() => {
        checkAuth();
        fetchUsers();
        fetchStats();
    }, [checkAuth, fetchUsers, fetchStats]);

    // Fetch users when filter changes
    useEffect(() => {
        fetchUsers();
    }, [filter, fetchUsers]);

    // Auto-refresh interval
    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(() => {
            fetchUsers(true);
            fetchStats();
        }, 30000); // 30 seconds for faster updates

        return () => clearInterval(interval);
    }, [autoRefresh, fetchUsers, fetchStats]);

    const updateUserRole = async (userId, newRole) => {
        if (!confirm(`আপনি কি নিশ্চিত যে এই ইউজারকে ${newRole === 'admin' ? 'অ্যাডমিন' : 'সাধারণ ইউজার'} করতে চান?`)) {
            return;
        }

        try {
            const res = await fetch(`${API_URL}/admin/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ role: newRole })
            });

            const data = await res.json();

            if (data.success) {
                toast.success(data.message || 'ইউজার রোল আপডেট হয়েছে');
                fetchUsers(true);
            } else {
                toast.error(data.message || 'রোল আপডেট করতে ব্যর্থ');
            }
        } catch (error) {
            console.error('Error updating role:', error);
            toast.error('রোল আপডেট করতে ব্যর্থ');
        }
    };

    const updateVerification = async (userId, field, value) => {
        try {
            const res = await fetch(`${API_URL}/admin/users/${userId}/verification`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ [field]: value })
            });

            const data = await res.json();

            if (data.success) {
                toast.success('ভেরিফিকেশন স্ট্যাটাস আপডেট হয়েছে');
                fetchUsers(true);
            } else {
                toast.error(data.message || 'আপডেট করতে ব্যর্থ');
            }
        } catch (error) {
            console.error('Error updating verification:', error);
            toast.error('ভেরিফিকেশন আপডেট করতে ব্যর্থ');
        }
    };

    const deleteUser = async (userId) => {
        if (!confirm('আপনি কি নিশ্চিত যে এই ইউজারকে ডিলিট করতে চান? এই কাজটি ফিরিয়ে আনা যাবে না।')) {
            return;
        }

        try {
            const res = await fetch(`${API_URL}/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await res.json();

            if (data.success) {
                toast.success('ইউজার ডিলিট হয়েছে');
                fetchUsers(true);
                fetchStats();
            } else {
                toast.error(data.message || 'ডিলিট করতে ব্যর্থ');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('ইউজার ডিলিট করতে ব্যর্থ');
        }
    };

    const getRoleBadgeColor = (role) => {
        return role === 'admin'
            ? 'bg-purple-100 text-purple-800'
            : 'bg-blue-100 text-blue-800';
    };

    const getVerificationColor = (verified) => {
        return verified
            ? 'text-green-600'
            : 'text-gray-400';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">ইউজার লোড হচ্ছে...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <Link href="/admin">
                                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                                    <FiArrowLeft size={20} />
                                    <span>Back to Admin</span>
                                </button>
                            </Link>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={autoRefresh}
                                    onChange={(e) => setAutoRefresh(e.target.checked)}
                                    className="rounded"
                                />
                                <span>Auto-refresh</span>
                            </label>
                            <span className="text-xs text-gray-500">
                                Last: {lastRefresh.toLocaleTimeString()}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <FiUsers className="text-green-600 text-3xl" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                            <p className="text-gray-600">ইউজার ম্যানেজমেন্ট - Manage all users and their roles</p>
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <div className="flex items-center justify-between mb-2">
                                <FiUsers className="text-blue-600 text-2xl" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                            <div className="text-sm text-gray-600">Total Users</div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-4">
                            <div className="flex items-center justify-between mb-2">
                                <FiShield className="text-purple-600 text-2xl" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{stats.admins}</div>
                            <div className="text-sm text-gray-600">Admins</div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-4">
                            <div className="flex items-center justify-between mb-2">
                                <FiUser className="text-blue-600 text-2xl" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{stats.normalUsers}</div>
                            <div className="text-sm text-gray-600">Normal Users</div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-4">
                            <div className="flex items-center justify-between mb-2">
                                <FiUserCheck className="text-green-600 text-2xl" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{stats.verified}</div>
                            <div className="text-sm text-gray-600">Verified</div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-4">
                            <div className="flex items-center justify-between mb-2">
                                <FiUserX className="text-orange-600 text-2xl" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{stats.unverified}</div>
                            <div className="text-sm text-gray-600">Unverified</div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-4">
                            <div className="flex items-center justify-between mb-2">
                                <FiCalendar className="text-indigo-600 text-2xl" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{stats.newInLast7Days}</div>
                            <div className="text-sm text-gray-600">New (7 days)</div>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email, mobile..."
                                value={filter.search}
                                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>

                        {/* Role Filter */}
                        <select
                            value={filter.role}
                            onChange={(e) => setFilter({ ...filter, role: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admin Only</option>
                            <option value="user">Normal Users</option>
                        </select>

                        {/* Verification Filter */}
                        <select
                            value={filter.verified}
                            onChange={(e) => setFilter({ ...filter, verified: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                        >
                            <option value="all">All Verification Status</option>
                            <option value="true">Verified Only</option>
                            <option value="false">Unverified Only</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                        <button
                            onClick={() => fetchUsers()}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                            <FiRefreshCw size={16} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Users List */}
                <div className="space-y-4">
                    {users.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-12 text-center">
                            <FiUsers className="mx-auto text-gray-400 text-5xl mb-4" />
                            <p className="text-gray-600 text-lg">কোনো ইউজার পাওয়া যায়নি</p>
                        </div>
                    ) : (
                        users.map(user => (
                            <div key={user._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                                {/* User Header */}
                                <div className="flex flex-wrap items-start justify-between mb-4 pb-4 border-b">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-xl font-bold">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                {user.name}
                                            </h3>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                                                    {user.role === 'admin' ? 'Admin' : 'User'}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mt-2 md:mt-0">
                                        {/* Role Toggle */}
                                        <button
                                            onClick={() => updateUserRole(user._id, user.role === 'admin' ? 'user' : 'admin')}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${user.role === 'admin'
                                                    ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                                }`}
                                        >
                                            {user.role === 'admin' ? 'Make User' : 'Make Admin'}
                                        </button>

                                        {/* Delete */}
                                        <button
                                            onClick={() => deleteUser(user._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                        >
                                            <FiTrash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* User Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Contact Info */}
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                            Contact Information
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2">
                                                <FiMail className={getVerificationColor(user.emailVerified)} />
                                                <span className="text-gray-700">{user.email}</span>
                                                {user.emailVerified ? (
                                                    <span className="text-xs text-green-600 font-medium">✓ Verified</span>
                                                ) : (
                                                    <button
                                                        onClick={() => updateVerification(user._id, 'emailVerified', true)}
                                                        className="text-xs text-blue-600 hover:underline"
                                                    >
                                                        Verify
                                                    </button>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FiPhone className={getVerificationColor(user.mobileVerified)} />
                                                <span className="text-gray-700">{user.mobile}</span>
                                                {user.mobileVerified ? (
                                                    <span className="text-xs text-green-600 font-medium">✓ Verified</span>
                                                ) : (
                                                    <button
                                                        onClick={() => updateVerification(user._id, 'mobileVerified', true)}
                                                        className="text-xs text-blue-600 hover:underline"
                                                    >
                                                        Verify
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Account Status */}
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Account Status</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-600">Email:</span>
                                                <span className={user.emailVerified ? 'text-green-600 font-medium' : 'text-orange-600'}>
                                                    {user.emailVerified ? 'Verified ✓' : 'Not Verified'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-600">Mobile:</span>
                                                <span className={user.mobileVerified ? 'text-green-600 font-medium' : 'text-orange-600'}>
                                                    {user.mobileVerified ? 'Verified ✓' : 'Not Verified'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-600">Role:</span>
                                                <span className="font-medium">
                                                    {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
