import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';
import QuantityStepper from '../components/ui/QuantityStepper';

export default function CartPage() {
    const router = useRouter();
    const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();

    const subtotal = getCartTotal();
    const deliveryFee = subtotal >= 1000 ? 0 : 50;
    const total = subtotal + deliveryFee;

    const handleCheckout = () => {
        router.push('/checkout');
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

                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Fee</span>
                                    <span className="font-medium">
                                        {deliveryFee === 0 ? (
                                            <span className="text-green-600">FREE</span>
                                        ) : (
                                            formatPrice(deliveryFee)
                                        )}
                                    </span>
                                </div>
                                {subtotal < 1000 && (
                                    <div className="text-xs text-gray-500">
                                        Add {formatPrice(1000 - subtotal)} more for free delivery!
                                    </div>
                                )}
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
