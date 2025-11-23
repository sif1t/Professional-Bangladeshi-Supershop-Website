import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminLogin() {
    const router = useRouter();
    const [status, setStatus] = useState('Setting up admin access...');

    useEffect(() => {
        const setupAdmin = () => {
            // This is your valid admin token
            const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MGY2ODVkODdhOTI4NzA4MzgzM2RjMSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2MjY5MjU5NSwiZXhwIjoxNzY1Mjg0NTk1fQ.eUqV8FzhwXcnyNcfJyXvld7BBfqQOJnn4uY4KSwpbtU';

            // Admin user data
            const adminUser = {
                id: '690f685d87a9287083833dc1',
                name: 'Ariyan',
                mobile: '01775565508',
                role: 'admin'
            };

            // Clear any old data
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Set the admin token and user
            localStorage.setItem('token', adminToken);
            localStorage.setItem('user', JSON.stringify(adminUser));

            setStatus('✅ Admin access activated!');

            // Redirect to admin panel after 1 second
            setTimeout(() => {
                window.location.href = '/admin';
            }, 1000);
        };

        setupAdmin();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                            {status.includes('✅') ? (
                                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <svg className="w-12 h-12 text-green-600 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
                        Admin Access Setup
                    </h1>

                    {/* Status */}
                    <div className="text-center mb-6">
                        <p className="text-lg text-gray-600">
                            {status}
                        </p>
                    </div>

                    {/* Info Box */}
                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6">
                        <h3 className="font-semibold text-green-900 mb-2">What's happening?</h3>
                        <ul className="text-sm text-green-800 space-y-1">
                            <li>✅ Clearing old session token</li>
                            <li>✅ Setting up admin authentication</li>
                            <li>✅ Activating admin privileges</li>
                            <li>✅ Redirecting to admin panel...</li>
                        </ul>
                    </div>

                    {/* Account Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            <strong>Admin Account:</strong><br />
                            Name: Ariyan<br />
                            Mobile: 01775565508<br />
                            Role: Admin ✅
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">
                            You'll be redirected automatically...
                        </p>
                    </div>
                </div>

                {/* Manual Link */}
                <div className="mt-6 text-center">
                    <a
                        href="/admin"
                        className="text-white hover:text-green-200 underline text-sm"
                    >
                        Or click here to go to admin panel manually
                    </a>
                </div>
            </div>
        </div>
    );
}
