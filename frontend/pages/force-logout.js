import { useEffect, useState } from 'react';

export default function ForceLogout() {
    const [status, setStatus] = useState('Clearing session...');

    useEffect(() => {
        // Clear all authentication data
        localStorage.removeItem('token');
        sessionStorage.clear();

        // Clear cookies by setting them to expire
        document.cookie.split(";").forEach((c) => {
            document.cookie = c
                .replace(/^ +/, "")
                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        setStatus('✅ Session cleared!');

        // Redirect to login after 1 second
        setTimeout(() => {
            window.location.href = '/login?message=Please login again with your admin account';
        }, 1000);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                            {status.includes('✅') ? (
                                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-12 h-12 text-red-600 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
                        Refreshing Your Session
                    </h1>

                    {/* Status */}
                    <div className="text-center mb-6">
                        <p className="text-lg text-gray-600">
                            {status}
                        </p>
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
                        <h3 className="font-semibold text-blue-900 mb-2">What's happening?</h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>✅ Clearing old authentication token</li>
                            <li>✅ Removing cached session data</li>
                            <li>✅ Preparing fresh login</li>
                            <li>✅ Redirecting to login page...</li>
                        </ul>
                    </div>

                    {/* Instructions */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-800">
                            <strong>⚠️ Important:</strong><br />
                            After login, your admin role will be active and you can add products!
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">
                            You'll be redirected to login automatically...
                        </p>
                    </div>
                </div>

                {/* Manual Link */}
                <div className="mt-6 text-center">
                    <a
                        href="/login"
                        className="text-white hover:text-blue-200 underline text-sm"
                    >
                        Or click here to login manually
                    </a>
                </div>
            </div>
        </div>
    );
}
