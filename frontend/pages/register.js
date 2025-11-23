import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { validateMobile } from '../lib/utils';

export default function RegisterPage() {
    const router = useRouter();
    const { register, isAuthenticated } = useAuth();
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { redirect } = router.query;

    if (isAuthenticated) {
        router.push(redirect || '/account/dashboard');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || name.length < 2) {
            toast.error('দয়া করে আপনার পূর্ণ নাম লিখুন');
            return;
        }

        if (!validateMobile(mobile)) {
            toast.error('দয়া করে একটি বৈধ বাংলাদেশী মোবাইল নম্বর লিখুন');
            return;
        }

        if (!password || password.length < 6) {
            toast.error('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('পাসওয়ার্ড মিলছে না');
            return;
        }

        setLoading(true);
        const result = await register(name, mobile, password);

        if (result.success) {
            toast.success('নিবন্ধন সফল হয়েছে!');
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">অ্যাকাউন্ট তৈরি করুন</h1>
                    <p className="text-gray-600">আমাদের সাথে যুক্ত হন এবং কেনাকাটা শুরু করুন!</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                            পূর্ণ নাম
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="আপনার পূর্ণ নাম লিখুন"
                            className="input-field"
                            required
                        />
                    </div>

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
                            placeholder="কমপক্ষে ৬ অক্ষর"
                            className="input-field"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                            পাসওয়ার্ড নিশ্চিত করুন
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="পুনরায় পাসওয়ার্ড লিখুন"
                            className="input-field"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-3"
                    >
                        {loading ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'অ্যাকাউন্ট তৈরি করুন'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
                        <Link
                            href={redirect ? `/login?redirect=${redirect}` : '/login'}
                            className="text-primary-600 font-medium hover:underline"
                        >
                            এখানে লগইন করুন
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
