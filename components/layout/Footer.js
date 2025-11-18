import Link from 'next/link';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            {/* Main Footer */}
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <div className="text-2xl font-bold text-white mb-4">
                            <span className="text-primary-400">BD</span>
                            <span className="text-secondary-400">Supershop</span>
                        </div>
                        <p className="text-sm mb-4">
                            তাজা মুদি সামগ্রী, দৈনন্দিন প্রয়োজনীয় জিনিসের জন্য আপনার বিশ্বস্ত অনলাইন সুপারশপ৷ সম্পূর্ণ বাংলাদেশে দ্রুত ডেলিভারি।
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <FiPhone size={16} />
                                <span className="text-sm">হটলাইন: ১৬৪৬৯</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FiMail size={16} />
                                <span className="text-sm">support@bdsupershop.com</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FiMapPin size={16} />
                                <span className="text-sm">ঢাকা, বাংলাদেশ</span>
                            </div>
                        </div>
                    </div>

                    {/* দ্রুত লিঙ্ক */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">দ্রুত লিঙ্ক</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/about" className="text-sm hover:text-primary-400 transition-colors">
                                    আমাদের সম্পর্কে
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-sm hover:text-primary-400 transition-colors">
                                    যোগাযোগ
                                </Link>
                            </li>
                            <li>
                                <Link href="/careers" className="text-sm hover:text-primary-400 transition-colors">
                                    ক্যারিয়ার
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-sm hover:text-primary-400 transition-colors">
                                    ব্লগ
                                </Link>
                            </li>
                            <li>
                                <Link href="/stores" className="text-sm hover:text-primary-400 transition-colors">
                                    দোকানের অবস্থান
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* গ্রাহক সেবা */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">গ্রাহক সেবা</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/help" className="text-sm hover:text-primary-400 transition-colors">
                                    সাহায্য কেন্দ্র
                                </Link>
                            </li>
                            <li>
                                <Link href="/track-order" className="text-sm hover:text-primary-400 transition-colors">
                                    অর্ডার ট্র্যাক করুন
                                </Link>
                            </li>
                            <li>
                                <Link href="/returns" className="text-sm hover:text-primary-400 transition-colors">
                                    রিটার্ন ও রিফান্ড
                                </Link>
                            </li>
                            <li>
                                <Link href="/shipping" className="text-sm hover:text-primary-400 transition-colors">
                                    ডেলিভারি তথ্য
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="text-sm hover:text-primary-400 transition-colors">
                                    সাধারণ জিজ্ঞাসা
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* অ্যাপ ডাউনলোড */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">আমাদের অ্যাপ ডাউনলোড করুন</h3>
                        <p className="text-sm mb-4">
                            আমাদের মোবাইল অ্যাপে ঘরে বসে কেনাকাটা করুন
                        </p>
                        <div className="space-y-3">
                            <a
                                href="#"
                                className="flex items-center gap-3 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
                            >
                                <div className="text-2xl">📱</div>
                                <div>
                                    <div className="text-xs">ডাউনলোড করুন</div>
                                    <div className="text-sm font-semibold">প্লে স্টোর</div>
                                </div>
                            </a>
                            <a
                                href="#"
                                className="flex items-center gap-3 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
                            >
                                <div className="text-2xl">🍎</div>
                                <div>
                                    <div className="text-xs">ডাউনলোড করুন</div>
                                    <div className="text-sm font-semibold">অ্যাপ স্টোর</div>
                                </div>
                            </a>
                        </div>

                        {/* সোশ্যাল মিডিয়া */}
                        <div className="mt-6">
                            <h4 className="text-white font-semibold mb-3">আমাদের ফলো করুন</h4>
                            <div className="flex gap-3">
                                <a
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors"
                                >
                                    <FiFacebook size={20} />
                                </a>
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors"
                                >
                                    <FiInstagram size={20} />
                                </a>
                                <a
                                    href="https://twitter.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors"
                                >
                                    <FiTwitter size={20} />
                                </a>
                                <a
                                    href="https://youtube.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition-colors"
                                >
                                    <FiYoutube size={20} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="container-custom py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-center md:text-left">
                            © {new Date().getFullYear()} BDSupershop. সর্বস্বত্ব সংরক্ষিত।
                        </div>
                        <div className="flex flex-wrap justify-center gap-6 text-sm">
                            <Link href="/privacy-policy" className="hover:text-primary-400 transition-colors">
                                গোপনীয়তা নীতি
                            </Link>
                            <Link href="/terms-conditions" className="hover:text-primary-400 transition-colors">
                                শর্তাবলী
                            </Link>
                            <Link href="/cookie-policy" className="hover:text-primary-400 transition-colors">
                                কুকি নীতি
                            </Link>
                        </div>
                    </div>

                    {/* পেমেন্ট পদ্ধতি */}
                    <div className="mt-6 pt-6 border-t border-gray-800">
                        <div className="text-sm text-center mb-3">আমরা গ্রহণ করি</div>
                        <div className="flex flex-wrap justify-center items-center gap-4">
                            <div className="px-4 py-2 bg-gray-800 rounded text-sm">💵 ক্যাশ অন ডেলিভারি</div>
                            <div className="px-4 py-2 bg-gray-800 rounded text-sm">📱 বিকাশ</div>
                            <div className="px-4 py-2 bg-gray-800 rounded text-sm">📱 নগদ</div>
                            <div className="px-4 py-2 bg-gray-800 rounded text-sm">🚀 রকেট</div>
                            <div className="px-4 py-2 bg-gray-800 rounded text-sm">💳 কার্ড</div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
