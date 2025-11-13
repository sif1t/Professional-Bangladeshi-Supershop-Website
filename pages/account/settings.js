import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import {
    FiUser,
    FiMail,
    FiPhone,
    FiLock,
    FiMapPin,
    FiSave,
    FiEdit2,
    FiCamera,
    FiShield,
    FiBell,
    FiGlobe,
    FiCreditCard,
    FiHeart,
    FiTrash2,
    FiEye,
    FiEyeOff,
    FiAlertCircle,
    FiCheckCircle,
    FiRefreshCw,
    FiLogOut,
    FiSettings,
    FiArrowLeft,
    FiDownload,
    FiUpload
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';

export default function ProfileSettings() {
    const router = useRouter();
    const { user, isAuthenticated, loading: authLoading, logout } = useAuth();

    // Profile Information
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [profileImage, setProfileImage] = useState('');

    // Password Change
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Account Settings
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(true);
    const [orderUpdates, setOrderUpdates] = useState(true);
    const [promotionalEmails, setPromotionalEmails] = useState(true);
    const [newsletter, setNewsletter] = useState(false);

    // Privacy Settings
    const [profileVisibility, setProfileVisibility] = useState('private');
    const [showOrderHistory, setShowOrderHistory] = useState(false);
    const [dataSharing, setDataSharing] = useState(false);

    // UI States
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [accountStats, setAccountStats] = useState({
        totalOrders: 0,
        totalSpent: 0,
        savedAddresses: 0,
        wishlistItems: 0
    });

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login?redirect=/account/settings');
        }
    }, [isAuthenticated, authLoading, router]);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setMobile(user.mobile || '');
            setEmail(user.email || '');
            setProfileImage(user.profileImage || '');
            fetchAccountStats();
        }
    }, [user]);

    const fetchAccountStats = async () => {
        try {
            // Fetch orders count
            const ordersRes = await api.get('/orders/my-orders?limit=1');
            setAccountStats(prev => ({
                ...prev,
                totalOrders: ordersRes.data.count || 0
            }));

            // Fetch user data for addresses
            const userRes = await api.get('/auth/me');
            if (userRes.data.success) {
                setAccountStats(prev => ({
                    ...prev,
                    savedAddresses: userRes.data.user.addresses?.length || 0
                }));
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error('Name is required');
            return;
        }

        if (!mobile.trim()) {
            toast.error('Mobile number is required');
            return;
        }

        if (!/^01[0-9]{9}$/.test(mobile)) {
            toast.error('Please enter a valid Bangladeshi mobile number');
            return;
        }

        setLoading(true);

        try {
            const response = await api.put('/auth/profile', {
                name,
                mobile,
                email
            });

            if (response.data.success) {
                toast.success('Profile updated successfully!');
                setIsEditing(false);
                // Update user in context/localStorage
                const updatedUser = { ...user, name, mobile, email };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                window.location.reload(); // Refresh to update context
            }
        } catch (error) {
            console.error('Update error:', error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error('All password fields are required');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('New password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const response = await api.put('/auth/change-password', {
                currentPassword,
                newPassword
            });

            if (response.data.success) {
                toast.success('Password changed successfully!');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            }
        } catch (error) {
            console.error('Password change error:', error);
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
                toast.success('Profile image updated! Click Save to confirm.');
                setIsEditing(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            return;
        }

        const confirmText = prompt('Please type "DELETE" to confirm account deletion:');
        if (confirmText !== 'DELETE') {
            toast.error('Account deletion cancelled');
            return;
        }

        setLoading(true);

        try {
            const response = await api.delete('/auth/account');
            if (response.data.success) {
                toast.success('Account deleted successfully');
                logout();
                router.push('/');
            }
        } catch (error) {
            console.error('Delete account error:', error);
            toast.error(error.response?.data?.message || 'Failed to delete account');
        } finally {
            setLoading(false);
        }
    };

    const handleExportData = async () => {
        try {
            const response = await api.get('/auth/export-data');
            const dataStr = JSON.stringify(response.data, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `my-data-${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            toast.success('Data exported successfully!');
        } catch (error) {
            console.error('Export error:', error);
            toast.error('Failed to export data');
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile Info', icon: FiUser },
        { id: 'security', label: 'Security', icon: FiShield },
        { id: 'notifications', label: 'Notifications', icon: FiBell },
        { id: 'privacy', label: 'Privacy', icon: FiLock },
        { id: 'preferences', label: 'Preferences', icon: FiSettings }
    ];

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

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container-custom max-w-7xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/account/dashboard"
                            className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
                        >
                            <FiArrowLeft size={20} />
                            <span className="font-medium">Back to Dashboard</span>
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 hidden md:block">Profile Settings</h1>
                </div>

                {/* Account Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-4 shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Total Orders</p>
                                <p className="text-3xl font-bold">{accountStats.totalOrders}</p>
                            </div>
                            <FiShield size={32} className="opacity-80" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-4 shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Addresses</p>
                                <p className="text-3xl font-bold">{accountStats.savedAddresses}</p>
                            </div>
                            <FiMapPin size={32} className="opacity-80" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-4 shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Wishlist</p>
                                <p className="text-3xl font-bold">{accountStats.wishlistItems}</p>
                            </div>
                            <FiHeart size={32} className="opacity-80" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-4 shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Member Since</p>
                                <p className="text-xl font-bold">
                                    {user?.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear()}
                                </p>
                            </div>
                            <FiUser size={32} className="opacity-80" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Tabs */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <div className="space-y-2">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === tab.id
                                                    ? 'bg-primary-600 text-white'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            <Icon size={20} />
                                            <span className="font-medium">{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Profile Info Tab */}
                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                        <FiUser className="text-primary-600" />
                                        Profile Information
                                    </h2>
                                    {!isEditing && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="btn-outline px-4 py-2 flex items-center gap-2"
                                        >
                                            <FiEdit2 size={16} />
                                            Edit Profile
                                        </button>
                                    )}
                                </div>

                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    {/* Profile Image */}
                                    <div className="flex flex-col items-center mb-6">
                                        <div className="relative">
                                            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
                                                {profileImage ? (
                                                    <Image
                                                        src={profileImage}
                                                        alt="Profile"
                                                        width={128}
                                                        height={128}
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-primary-100">
                                                        <FiUser className="text-primary-600" size={48} />
                                                    </div>
                                                )}
                                            </div>
                                            <label
                                                htmlFor="profile-image"
                                                className="absolute bottom-0 right-0 bg-primary-600 text-white p-3 rounded-full cursor-pointer hover:bg-primary-700 transition-colors shadow-lg"
                                            >
                                                <FiCamera size={20} />
                                                <input
                                                    type="file"
                                                    id="profile-image"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                    disabled={!isEditing}
                                                />
                                            </label>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-3">
                                            Click camera icon to upload photo (Max 5MB)
                                        </p>
                                    </div>

                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <div className="relative">
                                            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                disabled={!isEditing}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                    </div>

                                    {/* Mobile */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Mobile Number *
                                        </label>
                                        <div className="relative">
                                            <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="tel"
                                                value={mobile}
                                                onChange={(e) => setMobile(e.target.value)}
                                                disabled={!isEditing}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
                                                placeholder="01XXXXXXXXX"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Used for login and order notifications
                                        </p>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address (Optional)
                                        </label>
                                        <div className="relative">
                                            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                disabled={!isEditing}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
                                                placeholder="your.email@example.com"
                                            />
                                        </div>
                                    </div>

                                    {/* Account Info */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                            <FiInfo size={18} />
                                            Account Information
                                        </h3>
                                        <div className="space-y-2 text-sm text-blue-800">
                                            <p>
                                                <span className="font-medium">Account Status:</span>{' '}
                                                <span className="text-green-600 font-semibold">Active</span>
                                            </p>
                                            <p>
                                                <span className="font-medium">Member Since:</span>{' '}
                                                {user?.createdAt
                                                    ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })
                                                    : 'N/A'}
                                            </p>
                                            <p>
                                                <span className="font-medium">User ID:</span>{' '}
                                                <span className="font-mono">{user?._id?.slice(-8).toUpperCase()}</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {isEditing && (
                                        <div className="flex gap-3">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="flex-1 btn-primary py-3 flex items-center justify-center gap-2 disabled:bg-gray-400"
                                            >
                                                {loading ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiSave size={18} />
                                                        Save Changes
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setName(user?.name || '');
                                                    setMobile(user?.mobile || '');
                                                    setEmail(user?.email || '');
                                                }}
                                                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <FiShield className="text-primary-600" />
                                    Security Settings
                                </h2>

                                {/* Change Password */}
                                <form onSubmit={handleChangePassword} className="space-y-6 mb-8">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <FiLock size={20} />
                                        Change Password
                                    </h3>

                                    {/* Current Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Current Password *
                                        </label>
                                        <div className="relative">
                                            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type={showCurrentPassword ? 'text' : 'password'}
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                                placeholder="Enter current password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showCurrentPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* New Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            New Password *
                                        </label>
                                        <div className="relative">
                                            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type={showNewPassword ? 'text' : 'password'}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                                placeholder="Enter new password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showNewPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Minimum 6 characters
                                        </p>
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirm New Password *
                                        </label>
                                        <div className="relative">
                                            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                                placeholder="Confirm new password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-primary py-3 px-6 flex items-center gap-2 disabled:bg-gray-400"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                Changing...
                                            </>
                                        ) : (
                                            <>
                                                <FiShield size={18} />
                                                Change Password
                                            </>
                                        )}
                                    </button>
                                </form>

                                {/* Security Info */}
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Tips</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                                            <FiCheckCircle className="text-green-600 flex-shrink-0 mt-0.5" />
                                            <p className="text-sm text-gray-700">
                                                Use a strong password with letters, numbers, and symbols
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                                            <FiCheckCircle className="text-green-600 flex-shrink-0 mt-0.5" />
                                            <p className="text-sm text-gray-700">
                                                Never share your password with anyone
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                                            <FiCheckCircle className="text-green-600 flex-shrink-0 mt-0.5" />
                                            <p className="text-sm text-gray-700">
                                                Change your password regularly (every 3-6 months)
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <FiBell className="text-primary-600" />
                                    Notification Preferences
                                </h2>

                                <div className="space-y-6">
                                    {/* Email Notifications */}
                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-start gap-3">
                                            <FiMail className="text-gray-400 mt-1" size={20} />
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Email Notifications</h4>
                                                <p className="text-sm text-gray-600">Receive notifications via email</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={emailNotifications}
                                                onChange={(e) => setEmailNotifications(e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                        </label>
                                    </div>

                                    {/* SMS Notifications */}
                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-start gap-3">
                                            <FiPhone className="text-gray-400 mt-1" size={20} />
                                            <div>
                                                <h4 className="font-semibold text-gray-900">SMS Notifications</h4>
                                                <p className="text-sm text-gray-600">Receive order updates via SMS</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={smsNotifications}
                                                onChange={(e) => setSmsNotifications(e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                        </label>
                                    </div>

                                    {/* Order Updates */}
                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-start gap-3">
                                            <FiPackage className="text-gray-400 mt-1" size={20} />
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Order Updates</h4>
                                                <p className="text-sm text-gray-600">Get notified about order status changes</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={orderUpdates}
                                                onChange={(e) => setOrderUpdates(e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                        </label>
                                    </div>

                                    {/* Promotional Emails */}
                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-start gap-3">
                                            <FiTag className="text-gray-400 mt-1" size={20} />
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Promotional Emails</h4>
                                                <p className="text-sm text-gray-600">Receive special offers and discounts</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={promotionalEmails}
                                                onChange={(e) => setPromotionalEmails(e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                        </label>
                                    </div>

                                    {/* Newsletter */}
                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-start gap-3">
                                            <FiMail className="text-gray-400 mt-1" size={20} />
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Newsletter</h4>
                                                <p className="text-sm text-gray-600">Weekly newsletter with tips and deals</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={newsletter}
                                                onChange={(e) => setNewsletter(e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                        </label>
                                    </div>

                                    <button
                                        onClick={() => toast.success('Notification preferences saved!')}
                                        className="w-full btn-primary py-3 flex items-center justify-center gap-2"
                                    >
                                        <FiSave size={18} />
                                        Save Preferences
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Privacy Tab */}
                        {activeTab === 'privacy' && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <FiLock className="text-primary-600" />
                                    Privacy & Data
                                </h2>

                                <div className="space-y-6">
                                    {/* Export Data */}
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-start gap-3">
                                                <FiDownload className="text-primary-600 mt-1" size={20} />
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">Export Your Data</h4>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        Download a copy of your personal data
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleExportData}
                                            className="btn-outline px-4 py-2 flex items-center gap-2"
                                        >
                                            <FiDownload size={16} />
                                            Export Data
                                        </button>
                                    </div>

                                    {/* Profile Visibility */}
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-start gap-3 mb-3">
                                            <FiEye className="text-gray-400 mt-1" size={20} />
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900">Profile Visibility</h4>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Control who can see your profile
                                                </p>
                                                <select
                                                    value={profileVisibility}
                                                    onChange={(e) => setProfileVisibility(e.target.value)}
                                                    className="mt-3 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                                >
                                                    <option value="public">Public</option>
                                                    <option value="private">Private</option>
                                                    <option value="friends">Friends Only</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Delete Account */}
                                    <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
                                        <div className="flex items-start gap-3 mb-3">
                                            <FiTrash2 className="text-red-600 mt-1" size={20} />
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-red-900">Delete Account</h4>
                                                <p className="text-sm text-red-700 mt-1">
                                                    Permanently delete your account and all associated data. This action cannot be undone.
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleDeleteAccount}
                                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                                        >
                                            <FiTrash2 size={16} />
                                            Delete My Account
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => toast.success('Privacy settings saved!')}
                                        className="w-full btn-primary py-3 flex items-center justify-center gap-2"
                                    >
                                        <FiSave size={18} />
                                        Save Privacy Settings
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Preferences Tab */}
                        {activeTab === 'preferences' && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <FiSettings className="text-primary-600" />
                                    Preferences
                                </h2>

                                <div className="space-y-6">
                                    {/* Language */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <div className="flex items-center gap-2">
                                                <FiGlobe size={18} />
                                                Language
                                            </div>
                                        </label>
                                        <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none">
                                            <option value="en">English</option>
                                            <option value="bn">বাংলা (Bangla)</option>
                                        </select>
                                    </div>

                                    {/* Currency */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <div className="flex items-center gap-2">
                                                <FiDollarSign size={18} />
                                                Currency
                                            </div>
                                        </label>
                                        <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none">
                                            <option value="BDT">BDT (৳)</option>
                                            <option value="USD">USD ($)</option>
                                        </select>
                                    </div>

                                    {/* Quick Links */}
                                    <div className="border-t pt-6 mt-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <Link
                                                href="/account/orders"
                                                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                                            >
                                                <FiPackage className="text-primary-600" size={20} />
                                                <span className="font-medium">My Orders</span>
                                            </Link>
                                            <Link
                                                href="/account/addresses"
                                                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                                            >
                                                <FiMapPin className="text-primary-600" size={20} />
                                                <span className="font-medium">Addresses</span>
                                            </Link>
                                            <Link
                                                href="/track-order"
                                                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                                            >
                                                <FiTruck className="text-primary-600" size={20} />
                                                <span className="font-medium">Track Order</span>
                                            </Link>
                                            <Link
                                                href="/help"
                                                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                                            >
                                                <FiAlertCircle className="text-primary-600" size={20} />
                                                <span className="font-medium">Help & Support</span>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Logout Button */}
                                    <button
                                        onClick={() => {
                                            if (confirm('Are you sure you want to logout?')) {
                                                logout();
                                                router.push('/');
                                                toast.success('Logged out successfully');
                                            }
                                        }}
                                        className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
                                    >
                                        <FiLogOut size={18} />
                                        Logout from Account
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
