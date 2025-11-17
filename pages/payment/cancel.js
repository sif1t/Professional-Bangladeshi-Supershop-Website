import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiAlertCircle } from 'react-icons/fi';

export default function PaymentCancel() {
    const router = useRouter();
    const { orderId, paymentMethod } = router.query;

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12">
            <div className="container-custom max-w-2xl">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Cancel Header */}
                    <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-8 text-white text-center">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiAlertCircle className="text-orange-600" size={56} />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Payment Cancelled</h1>
                        <p className="text-orange-100 text-lg">You cancelled the payment process</p>
                    </div>

                    {/* Info */}
                    <div className="p-8">
                        <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 mb-6 text-center">
                            <p className="text-gray-700 mb-4">
                                Your payment was cancelled and no amount was charged from your account.
                            </p>
                            {orderId && (
                                <p className="text-sm text-gray-600">
                                    Order Reference: <span className="font-mono font-semibold">#{orderId}</span>
                                </p>
                            )}
                            {paymentMethod && (
                                <p className="text-sm text-gray-600 mt-1">
                                    Payment Method: <span className="font-semibold">{paymentMethod}</span>
                                </p>
                            )}
                        </div>

                        {/* Your Items */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                            <h3 className="font-bold text-gray-800 mb-3 text-center">Your Cart Items Are Still Saved!</h3>
                            <p className="text-sm text-gray-700 text-center">
                                Don't worry! Your selected items are safely stored in your cart.
                                You can complete your purchase whenever you're ready.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={() => router.push('/checkout')}
                                className="w-full btn-primary py-4 text-lg"
                            >
                                Complete Your Purchase
                            </button>
                            <Link
                                href="/cart"
                                className="block w-full btn-secondary text-center py-4"
                            >
                                Review Cart
                            </Link>
                            <Link
                                href="/"
                                className="block w-full text-center py-4 text-gray-600 hover:underline"
                            >
                                Continue Shopping
                            </Link>
                        </div>

                        {/* Why Choose Us */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="font-bold text-gray-800 mb-4 text-center">Why Complete Your Order?</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <div className="text-3xl mb-2">🚚</div>
                                    <h4 className="font-semibold text-sm mb-1">Fast Delivery</h4>
                                    <p className="text-xs text-gray-600">Same day delivery available</p>
                                </div>
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <div className="text-3xl mb-2">💯</div>
                                    <h4 className="font-semibold text-sm mb-1">Quality Assured</h4>
                                    <p className="text-xs text-gray-600">100% fresh products</p>
                                </div>
                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                    <div className="text-3xl mb-2">🔒</div>
                                    <h4 className="font-semibold text-sm mb-1">Secure Payment</h4>
                                    <p className="text-xs text-gray-600">Safe & encrypted</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Support Info */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Questions? Call us at <span className="font-semibold">16469</span> or{' '}
                        <Link href="/help" className="text-primary-600 hover:underline">
                            get help
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
