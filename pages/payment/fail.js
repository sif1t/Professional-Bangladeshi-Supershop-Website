import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiXCircle, FiRefreshCw } from 'react-icons/fi';

export default function PaymentFail() {
    const router = useRouter();
    const { orderId, reason, paymentMethod } = router.query;

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 py-12">
            <div className="container-custom max-w-2xl">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Fail Header */}
                    <div className="bg-gradient-to-r from-red-500 to-rose-600 p-8 text-white text-center">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiXCircle className="text-red-600" size={56} />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
                        <p className="text-red-100 text-lg">We couldn't process your payment</p>
                    </div>

                    {/* Error Details */}
                    <div className="p-8">
                        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6">
                            <h3 className="font-bold text-red-800 mb-2">Payment Error</h3>
                            <p className="text-gray-700">{reason || 'Transaction was declined or cancelled'}</p>
                            {orderId && (
                                <p className="text-sm text-gray-600 mt-2">
                                    Order Reference: <span className="font-mono font-semibold">#{orderId}</span>
                                </p>
                            )}
                            {paymentMethod && (
                                <p className="text-sm text-gray-600 mt-1">
                                    Payment Method: <span className="font-semibold">{paymentMethod}</span>
                                </p>
                            )}
                        </div>

                        {/* Common Reasons */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
                            <h3 className="font-bold text-gray-800 mb-3">Common Reasons for Payment Failure:</h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start gap-2">
                                    <span>❌</span>
                                    <span>Insufficient balance in your account</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span>❌</span>
                                    <span>Incorrect PIN or password entered</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span>❌</span>
                                    <span>Payment cancelled by user</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span>❌</span>
                                    <span>Network or connectivity issues</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span>❌</span>
                                    <span>Transaction timeout</span>
                                </li>
                            </ul>
                        </div>

                        {/* What to Do */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                            <h3 className="font-bold text-gray-800 mb-3">What You Can Do:</h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-start gap-2">
                                    <span>✅</span>
                                    <span>Check your account balance and try again</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span>✅</span>
                                    <span>Try a different payment method</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span>✅</span>
                                    <span>Ensure you have stable internet connection</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span>✅</span>
                                    <span>Contact your payment provider if issue persists</span>
                                </li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={() => router.push('/checkout')}
                                className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-lg"
                            >
                                <FiRefreshCw size={20} />
                                Try Payment Again
                            </button>
                            <Link
                                href="/cart"
                                className="block w-full btn-secondary text-center py-4"
                            >
                                Go Back to Cart
                            </Link>
                            <Link
                                href="/"
                                className="block w-full text-center py-4 text-gray-600 hover:underline"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Support Info */}
                <div className="mt-6 text-center">
                    <div className="bg-white rounded-lg shadow p-4 inline-block">
                        <p className="text-sm text-gray-600 mb-2">Need Help?</p>
                        <p className="font-semibold text-gray-800">
                            📞 Call us: <span className="text-primary-600">16469</span>
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                            Available 24/7 for assistance
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
