import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { FiTrash2, FiShoppingBag, FiMapPin, FiTruck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';
import { calculateGrandTotal, getCurrentLocation, getLocationData } from '../lib/deliveryFee';
import QuantityStepper from '../components/ui/QuantityStepper';

export default function CartPage() {
    const router = useRouter();
    const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
    const [currentLocation, setCurrentLocation] = useState('Dhaka');
    const [deliveryInfo, setDeliveryInfo] = useState(null);

    const subtotal = getCartTotal();

    // Update delivery info when location or subtotal changes
    useEffect(() => {
        const location = getCurrentLocation();
        setCurrentLocation(location);
        const info = calculateGrandTotal(subtotal, location);
        setDeliveryInfo(info);
    }, [subtotal]);

    // Listen for location changes
    useEffect(() => {
        const handleStorageChange = () => {
            const location = getCurrentLocation();
            setCurrentLocation(location);
            const info = calculateGrandTotal(subtotal, location);
            setDeliveryInfo(info);
        };

        window.addEventListener('storage', handleStorageChange);
        // Custom event for same-tab updates
        window.addEventListener('locationChanged', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('locationChanged', handleStorageChange);
        };
    }, [subtotal]);

    const deliveryFee = deliveryInfo?.deliveryFee || 0;
    const total = deliveryInfo?.total || subtotal;
    const locationData = getLocationData(currentLocation);

    const handleCheckout = () => {
        router.push('/checkout-manual');
    };

    if (cart.length === 0) {
        return (
            <div className="container-custom py-12">
                <div className="max-w-md mx-auto text-center">
                    <div className="text-6xl mb-4">🛒</div>
                    <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
                    <p className="text-gray-600 mb-6">
                        Looks like you haven't added anything to your cart yet
                    </p>
                    <Link href="/" className="btn-primary inline-block">
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-6">
            <div className="container-custom">
                <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="font-semibold">
                                    Cart Items ({cart.length})
                                </h2>
                                <button
                                    onClick={clearCart}
                                    className="text-sm text-red-600 hover:underline"
                                >
                                    Clear Cart
                                </button>
                            </div>

                            <div className="space-y-4">
                                {cart.map((item) => (
                                    <div
                                        key={`${item.productId}-${item.variant}`}
                                        className="flex gap-4 pb-4 border-b border-gray-200 last:border-0"
                                    >
                                        {/* Image */}
                                        <Link
                                            href={`/product/${item.slug}`}
                                            className="flex-shrink-0"
                                        >
                                            <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </Link>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                href={`/product/${item.slug}`}
                                                className="font-medium hover:text-primary-600 line-clamp-2"
                                            >
                                                {item.name}
                                            </Link>
                                            <div className="text-sm text-gray-600 mt-1">
                                                Variant: {item.variant}
                                            </div>
                                            <div className="text-lg font-bold text-primary-600 mt-2">
                                                {formatPrice(item.price)}
                                            </div>
                                        </div>

                                        {/* Quantity & Remove */}
                                        <div className="flex flex-col items-end justify-between">
                                            <button
                                                onClick={() => removeFromCart(item.productId, item.variant)}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <FiTrash2 size={20} />
                                            </button>
                                            <QuantityStepper
                                                quantity={item.quantity}
                                                onQuantityChange={(qty) =>
                                                    updateQuantity(item.productId, item.variant, qty)
                                                }
                                            />
                                            <div className="text-sm font-medium mt-2">
                                                Subtotal: {formatPrice(item.price * item.quantity)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Continue Shopping */}
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-primary-600 hover:underline"
                        >
                            ← Continue Shopping
                        </Link>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
                            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                            {/* Delivery Location Info */}
                            <div className="mb-4 p-3 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg border border-primary-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <FiMapPin className="text-primary-600" size={16} />
                                    <span className="text-sm font-semibold text-gray-700">Delivery Location</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">{locationData.icon}</span>
                                        <div>
                                            <p className="font-bold text-gray-800">{currentLocation}</p>
                                            <p className="text-xs text-gray-600">{locationData.division}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-primary-600 font-medium">⚡ {locationData.deliveryTime}</p>
                                    </div>
                                </div>
                                <div className="mt-2 pt-2 border-t border-primary-200">
                                    <p className="text-xs text-gray-600">
                                        💡 Change location from header to see updated delivery fees
                                    </p>
                                </div>
                            </div>

                            {/* Delivery Fee Banner */}
                            {deliveryInfo && !deliveryInfo.isFreeDelivery && deliveryInfo.amountForFreeDelivery > 0 && (
                                <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                                    <div className="flex items-start gap-2">
                                        <FiTruck className="text-green-600 mt-0.5" size={18} />
                                        <div>
                                            <p className="text-sm font-semibold text-green-800">
                                                🎉 Add {formatPrice(deliveryInfo.amountForFreeDelivery)} more for FREE delivery!
                                            </p>
                                            <p className="text-xs text-green-700 mt-1">
                                                Free delivery on orders over {formatPrice(locationData.freeDeliveryThreshold)} to {currentLocation}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {deliveryInfo && deliveryInfo.isFreeDelivery && (
                                <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">🎉</span>
                                        <div>
                                            <p className="text-sm font-bold text-green-800">
                                                Congratulations! You got FREE Delivery
                                            </p>
                                            <p className="text-xs text-green-700 mt-1">
                                                Your order qualifies for free shipping to {currentLocation}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal ({cart.length} items)</span>
                                    <span className="font-medium">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <FiTruck size={16} />
                                        <span>Delivery Fee</span>
                                    </div>
                                    <span className="font-medium">
                                        {deliveryFee === 0 ? (
                                            <span className="text-green-600 font-bold">FREE 🎉</span>
                                        ) : (
                                            <span>{formatPrice(deliveryFee)}</span>
                                        )}
                                    </span>
                                </div>
                                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-primary-600">{formatPrice(total)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full btn-primary py-3 flex items-center justify-center gap-2"
                            >
                                <FiShoppingBag />
                                Proceed to Checkout
                            </button>

                            {/* Payment Icons */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="text-xs text-gray-600 text-center mb-3">
                                    We Accept
                                </div>
                                <div className="flex flex-wrap justify-center gap-2">
                                    <div className="px-2 py-1 bg-gray-100 rounded text-xs">💵 COD</div>
                                    <div className="px-2 py-1 bg-gray-100 rounded text-xs">📱 bKash</div>
                                    <div className="px-2 py-1 bg-gray-100 rounded text-xs">📱 Nagad</div>
                                    <div className="px-2 py-1 bg-gray-100 rounded text-xs">🚀 Rocket</div>
                                    <div className="px-2 py-1 bg-gray-100 rounded text-xs">💳 Cards</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
