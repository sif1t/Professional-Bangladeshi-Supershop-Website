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

            if (!res.ok) {
                if (res.status === 404) {
                    throw new Error('Backend routes not deployed yet. Please wait for Render to complete deployment.');
                }
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }

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
                if (error.message.includes('not deployed')) {
                    toast.error('⏳ Backend deploying... Please wait 2-3 minutes and refresh');
                } else {
                    toast.error('ইউজার লোড করতে ব্যর্থ: ' + error.message);
                }
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

            if (!res.ok) {
                console.warn(`Stats endpoint returned ${res.status}`);
                return; // Silently fail for stats
            }

            const data = await res.json();

            if (data.success) {
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
            // Silently fail for stats - not critical
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
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4">
                        <div className="flex items-center gap-2 sm:gap-4">
                            <Link href="/admin">
                                <button className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-gray-900 text-sm sm:text-base">
                                    <FiArrowLeft size={18} className="sm:w-5 sm:h-5" />
                                    <span className="hidden sm:inline">Back to Admin</span>
                                    <span className="sm:hidden">Back</span>
                                </button>
                            </Link>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                            <label className="flex items-center gap-1 sm:gap-2">
                                <input
                                    type="checkbox"
                                    checked={autoRefresh}
                                    onChange={(e) => setAutoRefresh(e.target.checked)}
                                    className="rounded w-4 h-4"
                                />
                                <span className="whitespace-nowrap">Auto-refresh</span>
                            </label>
                            <span className="text-gray-500 hidden sm:inline">
                                Last: {lastRefresh.toLocaleTimeString()}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <FiUsers className="text-green-600 text-2xl sm:text-3xl flex-shrink-0" />
                        <div>
                            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">User Management</h1>
                            <p className="text-xs sm:text-base text-gray-600">ইউজার ম্যানেজমেন্ট - Manage users</p>
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                {stats && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 mb-4 sm:mb-6">
                        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                            <div className="flex items-center justify-between mb-1 sm:mb-2">
                                <FiUsers className="text-blue-600 text-xl sm:text-2xl" />
                            </div>
                            <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</div>
                            <div className="text-xs sm:text-sm text-gray-600">Total Users</div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                            <div className="flex items-center justify-between mb-1 sm:mb-2">
                                <FiShield className="text-purple-600 text-xl sm:text-2xl" />
                            </div>
                            <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.admins}</div>
                            <div className="text-xs sm:text-sm text-gray-600">Admins</div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                            <div className="flex items-center justify-between mb-1 sm:mb-2">
                                <FiUser className="text-blue-600 text-xl sm:text-2xl" />
                            </div>
                            <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.normalUsers}</div>
                            <div className="text-xs sm:text-sm text-gray-600">Normal Users</div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                            <div className="flex items-center justify-between mb-1 sm:mb-2">
                                <FiUserCheck className="text-green-600 text-xl sm:text-2xl" />
                            </div>
                            <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.verified}</div>
                            <div className="text-xs sm:text-sm text-gray-600">Verified</div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                            <div className="flex items-center justify-between mb-1 sm:mb-2">
                                <FiUserX className="text-orange-600 text-xl sm:text-2xl" />
                            </div>
                            <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.unverified}</div>
                            <div className="text-xs sm:text-sm text-gray-600">Unverified</div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
                            <div className="flex items-center justify-between mb-1 sm:mb-2">
                                <FiCalendar className="text-indigo-600 text-xl sm:text-2xl" />
                            </div>
                            <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.newInLast7Days}</div>
                            <div className="text-xs sm:text-sm text-gray-600">New (7 days)</div>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {/* Search */}
                        <div className="relative sm:col-span-2 lg:col-span-1">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                            <input
                                type="text"
                                placeholder="Search name, email, mobile..."
                                value={filter.search}
                                onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>

                        {/* Role Filter */}
                        <select
                            value={filter.role}
                            onChange={(e) => setFilter({ ...filter, role: e.target.value })}
                            className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admin Only</option>
                            <option value="user">Normal Users</option>
                        </select>

                        {/* Verification Filter */}
                        <select
                            value={filter.verified}
                            onChange={(e) => setFilter({ ...filter, verified: e.target.value })}
                            className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                        >
                            <option value="all">All Status</option>
                            <option value="true">Verified Only</option>
                            <option value="false">Unverified Only</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 mt-3 sm:mt-4">
                        <button
                            onClick={() => fetchUsers()}
                            className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        >
                            <FiRefreshCw size={14} className="sm:w-4 sm:h-4" />
                            <span>Refresh</span>
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
                            <div key={user._id} className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition">
                                {/* User Header */}
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 pb-4 border-b gap-3">
                                    <div className="flex items-start gap-3 sm:gap-4 flex-1">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-lg sm:text-xl font-bold flex-shrink-0">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 truncate">
                                                {user.name}
                                            </h3>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                                                    {user.role === 'admin' ? 'Admin' : 'User'}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 self-end sm:self-start">
                                        {/* Role Toggle */}
                                        <button
                                            onClick={() => updateUserRole(user._id, user.role === 'admin' ? 'user' : 'admin')}
                                            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap ${user.role === 'admin'
                                                ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                                }`}
                                        >
                                            {user.role === 'admin' ? 'Make User' : 'Make Admin'}
                                        </button>

                                        {/* Delete */}
                                        <button
                                            onClick={() => deleteUser(user._id)}
                                            className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                        >
                                            <FiTrash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                                        </button>
                                    </div>
                                </div>

                                {/* User Details */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Contact Info */}
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                                            Contact Information
                                        </h4>
                                        <div className="space-y-2 text-xs sm:text-sm">
                                            <div className="flex items-start gap-2">
                                                <FiMail className={`${getVerificationColor(user.emailVerified)} flex-shrink-0 mt-0.5`} size={16} />
                                                <span className="text-gray-700 break-all flex-1">{user.email}</span>
                                                {user.emailVerified ? (
                                                    <span className="text-xs text-green-600 font-medium whitespace-nowrap">✓</span>
                                                ) : (
                                                    <button
                                                        onClick={() => updateVerification(user._id, 'emailVerified', true)}
                                                        className="text-xs text-blue-600 hover:underline whitespace-nowrap"
                                                    >
                                                        Verify
                                                    </button>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FiPhone className={`${getVerificationColor(user.mobileVerified)} flex-shrink-0`} size={16} />
                                                <span className="text-gray-700">{user.mobile}</span>
                                                {user.mobileVerified ? (
                                                    <span className="text-xs text-green-600 font-medium">✓</span>
                                                ) : (
                                                    <button
                                                        onClick={() => updateVerification(user._id, 'mobileVerified', true)}
                                                        className="text-xs text-blue-600 hover:underline whitespace-nowrap"
                                                    >
                                                        Verify
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Account Status */}
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Account Status</h4>
                                        <div className="space-y-2 text-xs sm:text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-600 min-w-[50px]">Email:</span>
                                                <span className={user.emailVerified ? 'text-green-600 font-medium' : 'text-orange-600'}>
                                                    {user.emailVerified ? 'Verified ✓' : 'Not Verified'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-600 min-w-[50px]">Mobile:</span>
                                                <span className={user.mobileVerified ? 'text-green-600 font-medium' : 'text-orange-600'}>
                                                    {user.mobileVerified ? 'Verified ✓' : 'Not Verified'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-600 min-w-[50px]">Role:</span>
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
