import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function RefreshAdmin() {
    const router = useRouter();
    const { logout, user } = useAuth();

    useEffect(() => {
        // Clear token and redirect to login
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            setTimeout(() => {
                window.location.href = '/login?message=Please login again to activate admin access';
            }, 100);
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
                <div className="mb-6">
                    <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-12 h-12 text-green-600 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        Refreshing Your Session
                    </h1>
                    <p className="text-gray-600">
                        Clearing old session data and activating admin access...
                    </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800">
                        <strong>✅ Your account is now an admin!</strong><br />
                        You'll be redirected to login in a moment...
                    </p>
                </div>

                <div className="text-xs text-gray-500">
                    If you're not redirected, <a href="/login" className="text-green-600 hover:underline">click here to login</a>
                </div>
            </div>
        </div>
    );
}
