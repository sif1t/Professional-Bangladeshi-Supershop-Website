import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiPackage } from 'react-icons/fi';
import confetti from 'canvas-confetti';

export default function PaymentSuccess() {
    const router = useRouter();
    const { orderId, transactionId, amount, paymentMethod } = router.query;
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        // Trigger confetti animation
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });

        // Countdown timer
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.push(`/account/orders/${orderId}`);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [orderId, router]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-12">
            <div className="container-custom max-w-2xl">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Success Header */}
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white text-center">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                            <FiCheckCircle className="text-green-600" size={56} />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
                        <p className="text-green-100 text-lg">Your order has been placed successfully</p>
                    </div>

                    {/* Order Details */}
                    <div className="p-8">
                        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
                            <div className="flex items-center gap-3 mb-4">
                                <FiPackage className="text-green-600" size={32} />
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">Order Confirmed</h3>
                                    <p className="text-sm text-gray-600">We're preparing your order for delivery</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white rounded-lg p-4 border border-green-100">
                                    <p className="text-xs text-gray-500 mb-1">Order Number</p>
                                    <p className="font-bold text-gray-800 font-mono">#{orderId}</p>
                                </div>
                                <div className="bg-white rounded-lg p-4 border border-green-100">
                                    <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
                                    <p className="font-bold text-gray-800 font-mono text-sm">{transactionId}</p>
                                </div>
                                <div className="bg-white rounded-lg p-4 border border-green-100">
                                    <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                                    <p className="font-bold text-gray-800">{paymentMethod}</p>
                                </div>
                                <div className="bg-white rounded-lg p-4 border border-green-100">
                                    <p className="text-xs text-gray-500 mb-1">Amount Paid</p>
                                    <p className="font-bold text-green-600 text-xl">৳{parseFloat(amount).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* What's Next */}
                        <div className="bg-blue-50 rounded-xl p-6 mb-6">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="text-blue-600">📋</span>
                                What's Next?
                            </h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-600 font-bold">1.</span>
                                    <p className="text-sm text-gray-700">
                                        <span className="font-semibold">Order Confirmation:</span> We've sent a confirmation email with your order details
                                    </p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-600 font-bold">2.</span>
                                    <p className="text-sm text-gray-700">
                                        <span className="font-semibold">Preparation:</span> Our team is picking and packing your items
                                    </p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-600 font-bold">3.</span>
                                    <p className="text-sm text-gray-700">
                                        <span className="font-semibold">Delivery:</span> You'll receive updates via SMS and email about your delivery
                                    </p>
                                </li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <Link
                                href={`/account/orders/${orderId}`}
                                className="block w-full btn-primary text-center py-4 text-lg"
                            >
                                View Order Details
                            </Link>
                            <Link
                                href="/account/orders"
                                className="block w-full btn-secondary text-center py-4"
                            >
                                View All Orders
                            </Link>
                            <Link
                                href="/"
                                className="block w-full text-center py-4 text-primary-600 hover:underline"
                            >
                                Continue Shopping
                            </Link>
                        </div>

                        {/* Auto Redirect Notice */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-500">
                                Redirecting to order details in <span className="font-bold text-primary-600">{countdown}</span> seconds...
                            </p>
                        </div>
                    </div>
                </div>

                {/* Support Info */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Need help? Contact us at <span className="font-semibold">16469</span> or{' '}
                        <Link href="/help" className="text-primary-600 hover:underline">
                            visit our help center
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
