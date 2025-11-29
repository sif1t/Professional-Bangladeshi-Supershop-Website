import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useSWR from 'swr';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import api from '../../lib/axios';
import { formatPrice, formatDate, getOrderStatusColor } from '../../lib/utils';

const fetcher = (url) => api.get(url).then((res) => res.data);

export default function OrdersPage() {
    const router = useRouter();
    const { isAuthenticated, loading } = useAuth();
    const { addToCart } = useCart();
    const [statusFilter, setStatusFilter] = useState('');

    const { data: ordersData, mutate } = useSWR(
        isAuthenticated
            ? `/orders/my-orders?${statusFilter ? `status=${statusFilter}` : ''}`
            : null,
        fetcher
    );

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login?redirect=/account/orders');
        }
    }, [isAuthenticated, loading, router]);

    const handleReorder = async (order) => {
        // Add all items from the order back to cart
        for (const item of order.products) {
            try {
                const { data } = await api.get(`/products/${item.productId}`);
                if (data.success) {
                    const product = data.product;
                    const variant = product.variants.find(v => v.name === item.variant);
                    if (variant) {
                        addToCart(product, variant, item.quantity);
                    }
                }
            } catch (error) {
                console.error('Error adding product to cart:', error);
            }
        }
        router.push('/cart');
    };

    if (loading || !isAuthenticated) {
        return <div className="container-custom py-12">Loading...</div>;
    }

    const orders = ordersData?.orders || [];

    return (
        <div className="bg-gray-50 min-h-screen py-6">
            <div className="container-custom max-w-6xl">
                <h1 className="text-3xl font-bold mb-6">My Orders</h1>

                {/* Filter */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium">Filter by status:</span>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        >
                            <option value="">All Orders</option>
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                {/* Orders List */}
                {orders.length > 0 ? (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-lg border border-gray-200 p-6">
                                {/* Order Header */}
                                <div className="flex flex-wrap justify-between items-start mb-4 pb-4 border-b border-gray-200">
                                    <div>
                                        <div className="font-bold text-lg mb-1">
                                            Order #{order.orderNumber}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            Placed on {formatDate(order.createdAt)}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`badge ${getOrderStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            {order.paymentMethod}
                                        </span>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="space-y-2 mb-4">
                                    {order.products.slice(0, 3).map((item, index) => (
                                        <div key={index} className="flex justify-between text-sm">
                                            <span>
                                                {item.name} ({item.variant}) x {item.quantity}
                                            </span>
                                            <span className="font-medium">
                                                {formatPrice(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    ))}
                                    {order.products.length > 3 && (
                                        <div className="text-sm text-gray-600">
                                            +{order.products.length - 3} more item(s)
                                        </div>
                                    )}
                                </div>

                                {/* Order Footer */}
                                <div className="flex flex-wrap justify-between items-center pt-4 border-t border-gray-200">
                                    <div className="font-bold text-lg">
                                        Total: <span className="text-primary-600">{formatPrice(order.totalAmount)}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <Link
                                            href={`/track-order?orderNumber=${order.orderNumber}`}
                                            className="btn-secondary px-4 py-2 text-sm"
                                        >
                                            🚚 Track Order
                                        </Link>
                                        <Link
                                            href={`/account/orders/${order._id}`}
                                            className="btn-outline px-4 py-2 text-sm"
                                        >
                                            View Details
                                        </Link>
                                        {order.status === 'Delivered' && (
                                            <button
                                                onClick={() => handleReorder(order)}
                                                className="btn-primary px-4 py-2 text-sm"
                                            >
                                                Re-order
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-semibold mb-2">No Orders Found</h3>
                        <p className="text-gray-600 mb-6">
                            {statusFilter
                                ? `You don't have any ${statusFilter.toLowerCase()} orders`
                                : "You haven't placed any orders yet"}
                        </p>
                        <Link href="/" className="btn-primary inline-block">
                            Start Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
