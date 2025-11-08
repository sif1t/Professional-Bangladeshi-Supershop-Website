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
                            Your trusted online supershop for fresh groceries, daily essentials, and more. Fast delivery across Bangladesh.
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <FiPhone size={16} />
                                <span className="text-sm">Hotline: 16469</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FiMail size={16} />
                                <span className="text-sm">support@bdsupershop.com</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FiMapPin size={16} />
                                <span className="text-sm">Dhaka, Bangladesh</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/about" className="text-sm hover:text-primary-400 transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-sm hover:text-primary-400 transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/careers" className="text-sm hover:text-primary-400 transition-colors">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-sm hover:text-primary-400 transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="/stores" className="text-sm hover:text-primary-400 transition-colors">
                                    Store Locator
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Customer Service</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/help" className="text-sm hover:text-primary-400 transition-colors">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link href="/track-order" className="text-sm hover:text-primary-400 transition-colors">
                                    Track Your Order
                                </Link>
                            </li>
                            <li>
                                <Link href="/returns" className="text-sm hover:text-primary-400 transition-colors">
                                    Returns & Refunds
                                </Link>
                            </li>
                            <li>
                                <Link href="/shipping" className="text-sm hover:text-primary-400 transition-colors">
                                    Shipping Information
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="text-sm hover:text-primary-400 transition-colors">
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Download App */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Download Our App</h3>
                        <p className="text-sm mb-4">
                            Shop on the go with our mobile app
                        </p>
                        <div className="space-y-3">
                            <a
                                href="#"
                                className="flex items-center gap-3 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
                            >
                                <div className="text-2xl">📱</div>
                                <div>
                                    <div className="text-xs">Download on the</div>
                                    <div className="text-sm font-semibold">Play Store</div>
                                </div>
                            </a>
                            <a
                                href="#"
                                className="flex items-center gap-3 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
                            >
                                <div className="text-2xl">🍎</div>
                                <div>
                                    <div className="text-xs">Download on the</div>
                                    <div className="text-sm font-semibold">App Store</div>
                                </div>
                            </a>
                        </div>

                        {/* Social Media */}
                        <div className="mt-6">
                            <h4 className="text-white font-semibold mb-3">Follow Us</h4>
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
                            © {new Date().getFullYear()} BDSupershop. All rights reserved.
                        </div>
                        <div className="flex flex-wrap justify-center gap-6 text-sm">
                            <Link href="/privacy-policy" className="hover:text-primary-400 transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms-conditions" className="hover:text-primary-400 transition-colors">
                                Terms & Conditions
                            </Link>
                            <Link href="/cookie-policy" className="hover:text-primary-400 transition-colors">
                                Cookie Policy
                            </Link>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="mt-6 pt-6 border-t border-gray-800">
                        <div className="text-sm text-center mb-3">We Accept</div>
                        <div className="flex flex-wrap justify-center items-center gap-4">
                            <div className="px-4 py-2 bg-gray-800 rounded text-sm">💵 Cash on Delivery</div>
                            <div className="px-4 py-2 bg-gray-800 rounded text-sm">📱 bKash</div>
                            <div className="px-4 py-2 bg-gray-800 rounded text-sm">📱 Nagad</div>
                            <div className="px-4 py-2 bg-gray-800 rounded text-sm">🚀 Rocket</div>
                            <div className="px-4 py-2 bg-gray-800 rounded text-sm">💳 Cards</div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
