import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { validateMobile, validateEmail } from '../lib/utils';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

export default function RegisterPage() {
    const router = useRouter();
    const { register, googleLogin, completeGoogleRegistration, isAuthenticated } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showMobileInput, setShowMobileInput] = useState(false);
    const [googleTempData, setGoogleTempData] = useState(null);
    const [googleMobile, setGoogleMobile] = useState('');

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

        if (!validateEmail(email)) {
            toast.error('দয়া করে একটি বৈধ জিমেইল ঠিকানা লিখুন');
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
        const result = await register(name, email, mobile, password);

        if (result.success) {
            toast.success('নিবন্ধন সফল হয়েছে!');
            router.push(redirect || '/account/dashboard');
        } else {
            toast.error(result.message);
        }
        setLoading(false);
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        const result = await googleLogin(credentialResponse.credential);

        if (result.success) {
            if (result.requireMobile) {
                setGoogleTempData(result.tempData);
                setShowMobileInput(true);
                toast.info('দয়া করে আপনার মোবাইল নম্বর প্রদান করুন');
            } else {
                toast.success('সফলভাবে নিবন্ধন সম্পন্ন হয়েছে!');
                router.push(redirect || '/account/dashboard');
            }
        } else {
            toast.error(result.message);
        }
        setLoading(false);
    };

    const handleGoogleError = () => {
        toast.error('Google sign up failed. Please try again.');
    };

    const handleCompleteMobileSubmit = async (e) => {
        e.preventDefault();

        if (!validateMobile(googleMobile)) {
            toast.error('দয়া করে একটি বৈধ বাংলাদেশী মোবাইল নম্বর লিখুন');
            return;
        }

        setLoading(true);
        const result = await completeGoogleRegistration(googleTempData, googleMobile);

        if (result.success) {
            toast.success('সফলভাবে নিবন্ধন সম্পন্ন হয়েছে!');
            router.push(redirect || '/account/dashboard');
        } else {
            toast.error(result.message);
        }
        setLoading(false);
    };

    if (showMobileInput) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">প্রায় শেষ!</h1>
                        <p className="text-gray-600">আপনার মোবাইল নম্বর প্রদান করুন</p>
                    </div>

                    <form onSubmit={handleCompleteMobileSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="googleMobile" className="block text-sm font-medium mb-2">
                                মোবাইল নম্বর
                            </label>
                            <input
                                id="googleMobile"
                                type="tel"
                                value={googleMobile}
                                onChange={(e) => setGoogleMobile(e.target.value)}
                                placeholder="০১XXXXXXXXX"
                                className="input-field"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-3"
                        >
                            {loading ? 'সম্পন্ন হচ্ছে...' : 'সম্পন্ন করুন'}
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        <button
                            onClick={() => {
                                setShowMobileInput(false);
                                setGoogleTempData(null);
                                setGoogleMobile('');
                            }}
                            className="text-primary-600 font-medium hover:underline"
                        >
                            পিছনে যান
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
            <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">অ্যাকাউন্ট তৈরি করুন</h1>
                        <p className="text-gray-600">আমাদের সাথে যুক্ত হন এবং কেনাকাটা শুরু করুন!</p>
                    </div>

                    {/* Google Sign Up Button */}
                    <div className="mb-6">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            size="large"
                            width="100%"
                            text="signup_with"
                            locale="en"
                        />
                    </div>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">অথবা</span>
                        </div>
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
                            <label htmlFor="email" className="block text-sm font-medium mb-2">
                                জিমেইল ঠিকানা
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@gmail.com"
                                className="input-field"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">শুধুমাত্র Gmail ঠিকানা গ্রহণযোগ্য</p>
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
        </GoogleOAuthProvider>
    );
}
