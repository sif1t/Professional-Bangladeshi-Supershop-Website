import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FiCheck, FiLoader } from 'react-icons/fi';
import api from '../../lib/axios';

export default function PaymentGateway() {
    const router = useRouter();
    const { orderId, paymentMethod, amount, paymentId } = router.query;
    const [processing, setProcessing] = useState(false);
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        if (!orderId || !paymentMethod) {
            router.push('/');
            return;
        }

        // Auto-process payment after 3 seconds (simulating payment processing)
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handlePaymentComplete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [orderId, paymentMethod]);

    const handlePaymentComplete = async () => {
        setProcessing(true);
        try {
            // Call backend to verify and complete payment
            const response = await api.post('/payment/verify', {
                orderId,
                paymentMethod,
                paymentId: paymentId || `${paymentMethod.toLowerCase().replace(/[^a-z]/g, '')}_${orderId}_${Date.now()}`,
                status: 'success',
            });

            if (response.data.success) {
                const transactionId = response.data.transactionId || `TRX${Date.now()}`;
                router.push(`/payment/success?orderId=${orderId}&transactionId=${transactionId}&amount=${amount}&paymentMethod=${paymentMethod}`);
            } else {
                router.push(`/payment/fail?orderId=${orderId}&reason=Payment verification failed`);
            }
        } catch (error) {
            console.error('Payment verification error:', error);
            router.push(`/payment/fail?orderId=${orderId}&reason=${error.message || 'Payment processing failed'}`);
        }
    };

    const handleCancel = () => {
        router.push(`/payment/cancel?orderId=${orderId}`);
    };

    const getPaymentIcon = () => {
        switch (paymentMethod) {
            case 'bKash':
                return '💳';
            case 'Nagad':
                return '📱';
            case 'Rocket':
                return '🚀';
            case 'Credit/Debit Card':
                return '💳';
            default:
                return '💰';
        }
    };

    const getPaymentColor = () => {
        switch (paymentMethod) {
            case 'bKash':
                return 'bg-pink-600';
            case 'Nagad':
                return 'bg-orange-600';
            case 'Rocket':
                return 'bg-purple-600';
            case 'Credit/Debit Card':
                return 'bg-blue-600';
            default:
                return 'bg-gray-600';
        }
    };

    if (!orderId || !paymentMethod) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Payment Gateway Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header with payment method color */}
                    <div className={`${getPaymentColor()} text-white p-6 text-center`}>
                        <div className="text-6xl mb-4">{getPaymentIcon()}</div>
                        <h1 className="text-2xl font-bold mb-2">{paymentMethod}</h1>
                        <p className="text-sm opacity-90">Payment Gateway</p>
                    </div>

                    {/* Payment Details */}
                    <div className="p-6">
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-gray-600">Order ID:</span>
                                <span className="font-mono font-semibold text-sm">{orderId?.slice(-8)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Amount:</span>
                                <span className="text-2xl font-bold text-primary-600">৳{amount}</span>
                            </div>
                        </div>

                        {/* Processing Animation */}
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                                <FiLoader className="w-8 h-8 text-primary-600 animate-spin" />
                            </div>
                            <h2 className="text-xl font-semibold mb-2">Processing Payment</h2>
                            <p className="text-gray-600 mb-4">
                                Please wait while we process your payment securely...
                            </p>
                            <div className="text-3xl font-bold text-primary-600 mb-2">
                                {countdown}
                            </div>
                            <p className="text-sm text-gray-500">seconds remaining</p>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-6">
                            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                    className={`${getPaymentColor()} h-full transition-all duration-1000`}
                                    style={{ width: `${((3 - countdown) / 3) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Security Notice */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                            <div className="flex items-start">
                                <FiCheck className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                                <div className="text-sm text-green-800">
                                    <p className="font-semibold mb-1">Secure Payment</p>
                                    <p className="text-xs">Your payment is processed securely using industry-standard encryption.</p>
                                </div>
                            </div>
                        </div>

                        {/* Demo Notice */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <p className="text-xs text-blue-800 text-center">
                                <span className="font-semibold">Demo Mode:</span> This is a simulated payment gateway for testing purposes.
                            </p>
                        </div>

                        {/* Cancel Button */}
                        <button
                            onClick={handleCancel}
                            disabled={processing}
                            className="w-full py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel Payment
                        </button>
                    </div>
                </div>

                {/* Important Notes */}
                <div className="mt-6 text-center text-xs text-gray-500">
                    <p className="mb-2">🔒 SSL Secured Payment</p>
                    <p>Payment will be automatically processed</p>
                </div>
            </div>
        </div>
    );
}
