import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FiCheckCircle, FiLoader, FiAlertCircle } from 'react-icons/fi';
import api from '../../../lib/axios';

export default function BKashCallback() {
    const router = useRouter();
    const { paymentID, status } = router.query;
    const [processing, setProcessing] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (paymentID && status) {
            handlePaymentCallback();
        }
    }, [paymentID, status]);

    const handlePaymentCallback = async () => {
        try {
            // Execute payment with backend
            const response = await api.post('/payment/bkash/execute', {
                paymentID,
                status,
            });

            if (response.data.success) {
                setPaymentStatus('success');
                setTimeout(() => {
                    router.push(`/account/orders/${response.data.orderId}`);
                }, 3000);
            } else {
                setPaymentStatus('failed');
                setError(response.data.message || 'Payment execution failed');
            }
        } catch (err) {
            setPaymentStatus('failed');
            setError(err.response?.data?.message || 'Payment processing error');
        } finally {
            setProcessing(false);
        }
    };

    if (processing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto mb-4"></div>
                    <h2 className="text-2xl font-bold mb-2">Processing bKash Payment...</h2>
                    <p className="text-gray-600">Please wait while we confirm your payment</p>
                    <div className="mt-6 flex justify-center">
                        <FiLoader className="animate-spin text-primary-600" size={24} />
                    </div>
                </div>
            </div>
        );
    }

    if (paymentStatus === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiCheckCircle className="text-green-600" size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
                    <p className="text-gray-600 mb-6">
                        Your bKash payment has been processed successfully.
                    </p>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-700">
                            <span className="font-semibold">Transaction ID:</span> {paymentID}
                        </p>
                    </div>
                    <p className="text-sm text-gray-600">Redirecting to order details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiAlertCircle className="text-red-600" size={48} />
                </div>
                <h2 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h2>
                <p className="text-gray-600 mb-6">{error || 'Something went wrong with your payment.'}</p>
                <button
                    onClick={() => router.push('/checkout')}
                    className="btn-primary w-full"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}
