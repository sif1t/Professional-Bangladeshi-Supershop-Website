import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiUser, FiShoppingBag, FiMapPin, FiSettings } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import useSWR from 'swr';
import api from '../../lib/axios';

const fetcher = (url) => api.get(url).then((res) => res.data);

export default function AccountDashboard() {
    const router = useRouter();
    const { user, isAuthenticated, loading } = useAuth();

    const { data: ordersData } = useSWR(
        isAuthenticated ? '/orders/my-orders?limit=5' : null,
        fetcher
    );

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login?redirect=/account/dashboard');
        }
    }, [isAuthenticated, loading, router]);

    if (loading || !isAuthenticated) {
        return (
            <div className="container-custom py-12">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const recentOrders = ordersData?.orders || [];

    return (
        <div className="bg-gray-50 min-h-screen py-6">
            <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
                            <div className="text-center mb-6 pb-6 border-b border-gray-200">
                                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <FiUser size={32} className="text-primary-600" />
                                </div>
                                <h2 className="font-bold text-lg">{user.name}</h2>
                                <p className="text-sm text-gray-600">{user.mobile}</p>
                            </div>

                            <nav className="space-y-2">
                                <Link
                                    href="/account/dashboard"
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-50 text-primary-600 font-medium"
                                >
                                    <FiUser size={20} />
                                    Dashboard
                                </Link>
                                <Link
                                    href="/account/orders"
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <FiShoppingBag size={20} />
                                    My Orders
                                </Link>
                                <Link
                                    href="/account/addresses"
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <FiMapPin size={20} />
                                    Addresses
                                </Link>
                                <Link
                                    href="/account/settings"
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <FiSettings size={20} />
                                    Profile Settings
                                </Link>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Welcome Card */}
                        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
                            <h1 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h1>
                            <p>Here's what's happening with your account today.</p>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <FiShoppingBag size={24} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">{ordersData?.count || 0}</div>
                                        <div className="text-sm text-gray-600">Total Orders</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <FiMapPin size={24} className="text-green-600" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">{user.addresses?.length || 0}</div>
                                        <div className="text-sm text-gray-600">Saved Addresses</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">🎁</span>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">0</div>
                                        <div className="text-sm text-gray-600">Reward Points</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">Recent Orders</h2>
                                <Link href="/account/orders" className="text-primary-600 hover:underline">
                                    View All
                                </Link>
                            </div>

                            {recentOrders.length > 0 ? (
                                <div className="space-y-4">
                                    {recentOrders.map((order) => (
                                        <Link
                                            key={order._id}
                                            href={`/account/orders/${order._id}`}
                                            className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <div className="font-semibold">Order #{order.orderNumber}</div>
                                                    <div className="text-sm text-gray-600">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'Delivered'
                                                        ? 'bg-green-100 text-green-700'
                                                        : order.status === 'Cancelled'
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-blue-100 text-blue-700'
                                                        }`}
                                                >
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="text-sm text-gray-600">
                                                    {order.products.length} item(s)
                                                </div>
                                                <div className="font-bold text-primary-600">
                                                    ৳{order.totalAmount.toFixed(2)}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-600">
                                    <div className="text-5xl mb-3">📦</div>
                                    <p>No orders yet</p>
                                    <Link href="/" className="text-primary-600 hover:underline mt-2 inline-block">
                                        Start Shopping
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
