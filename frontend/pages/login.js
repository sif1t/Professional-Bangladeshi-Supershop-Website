import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { validateMobile } from '../lib/utils';

export default function LoginPage() {
    const router = useRouter();
    const { login, isAuthenticated } = useAuth();
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { redirect } = router.query;

    if (isAuthenticated) {
        router.push(redirect || '/account/dashboard');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateMobile(mobile)) {
            toast.error('দয়া করে একটি বৈধ বাংলাদেশী মোবাইল নম্বর লিখুন');
            return;
        }

        if (!password || password.length < 6) {
            toast.error('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
            return;
        }

        setLoading(true);
        const result = await login(mobile, password);

        if (result.success) {
            toast.success('সফলভাবে লগইন করেছেন!');
            router.push(redirect || '/account/dashboard');
        } else {
            toast.error(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">স্বাগতম!</h1>
                    <p className="text-gray-600">আপনার অ্যাকাউন্টে লগইন করুন</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="mobile" className="block text-sm font-medium mb-2">
                            মোবাইল নম্বর
                        </label>
                        <input
                            id="mobile"
                            type="tel"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            placeholder="০১XXXXXXXXX"
                            className="input-field"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-2">
                            পাসওয়ার্ড
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="আপনার পাসওয়ার্ড লিখুন"
                            className="input-field"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-3"
                    >
                        {loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        অ্যাকাউন্ট নেই?{' '}
                        <Link
                            href={redirect ? `/register?redirect=${redirect}` : '/register'}
                            className="text-primary-600 font-medium hover:underline"
                        >
                            এখানে নিবন্ধন করুন
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
