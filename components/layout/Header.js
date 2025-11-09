import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiSearch, FiUser, FiShoppingCart, FiMapPin, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import useSWR from 'swr';
import api from '../../lib/axios';

const fetcher = (url) => api.get(url).then((res) => res.data);

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [selectedArea, setSelectedArea] = useState('Dhaka');
    const { user, isAuthenticated, logout } = useAuth();
    const { getCartCount } = useCart();
    const router = useRouter();

    const { data: categoriesData } = useSWR('/categories/tree', fetcher);
    const categories = categoriesData?.categories || [];

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            setShowSearchResults(false);
        }
    };

    const handleAreaChange = (area) => {
        setSelectedArea(area);
        // Store in localStorage
        localStorage.setItem('selectedArea', area);
    };

    useEffect(() => {
        const savedArea = localStorage.getItem('selectedArea');
        if (savedArea) setSelectedArea(savedArea);
    }, []);

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            {/* Top Bar */}
            <div className="bg-primary-600 text-white py-2">
                <div className="container-custom">
                    <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center space-x-4">
                            <span className="hidden sm:inline">📞 Hotline: 16469</span>
                            <span className="hidden md:inline">🎉 Free delivery on orders over ৳1000</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href="/track-order" className="hover:underline">
                                Track Order
                            </Link>
                            <Link href="/help" className="hover:underline">
                                Help
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="container-custom py-4">
                <div className="flex items-center justify-between gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0">
                        <div className="text-2xl font-bold text-primary-600">
                            <span className="text-primary-600">BD</span>
                            <span className="text-secondary-600">Supershop</span>
                        </div>
                    </Link>

                    {/* Delivery Location */}
                    <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                        <FiMapPin className="text-primary-600" />
                        <select
                            value={selectedArea}
                            onChange={(e) => handleAreaChange(e.target.value)}
                            className="bg-transparent outline-none text-sm font-medium"
                        >
                            <option value="Dhaka">Dhaka</option>
                            <option value="Chittagong">Chittagong</option>
                            <option value="Sylhet">Sylhet</option>
                            <option value="Rajshahi">Rajshahi</option>
                            <option value="Khulna">Khulna</option>
                            <option value="Barisal">Barisal</option>
                            <option value="Rangpur">Rangpur</option>
                            <option value="Mymensingh">Mymensingh</option>
                        </select>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:block">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search for products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700"
                            >
                                <FiSearch size={20} />
                            </button>
                        </div>
                    </form>

                    {/* User & Cart */}
                    <div className="flex items-center gap-4">
                        {/* Account */}
                        <div className="relative group">
                            <Link
                                href={isAuthenticated ? '/account/dashboard' : '/login'}
                                className="flex items-center gap-2 hover:text-primary-600"
                            >
                                <FiUser size={24} />
                                <div className="hidden lg:block text-sm">
                                    <div className="text-xs text-gray-500">
                                        {isAuthenticated ? 'Account' : 'Sign In'}
                                    </div>
                                    <div className="font-medium">
                                        {isAuthenticated ? user?.name?.split(' ')[0] : 'Register'}
                                    </div>
                                </div>
                            </Link>

                            {/* Dropdown */}
                            {isAuthenticated && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 hidden group-hover:block">
                                    <Link
                                        href="/account/dashboard"
                                        className="block px-4 py-2 hover:bg-gray-50"
                                    >
                                        My Account
                                    </Link>
                                    <Link
                                        href="/account/orders"
                                        className="block px-4 py-2 hover:bg-gray-50"
                                    >
                                        My Orders
                                    </Link>
                                    <Link
                                        href="/admin"
                                        className="block px-4 py-2 hover:bg-gray-50 border-t"
                                    >
                                        🛠️ Admin Panel
                                    </Link>
                                    <Link
                                        href="/account/addresses"
                                        className="block px-4 py-2 hover:bg-gray-50"
                                    >
                                        My Addresses
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Cart */}
                        <Link href="/cart" className="relative">
                            <FiShoppingCart size={24} className="hover:text-primary-600" />
                            {getCartCount() > 0 && (
                                <span className="absolute -top-2 -right-2 bg-secondary-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {getCartCount()}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden"
                        >
                            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="mt-4 md:hidden">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search for products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 text-white p-2 rounded-lg"
                        >
                            <FiSearch size={20} />
                        </button>
                    </div>
                </form>
            </div>

            {/* Navigation */}
            <nav className="border-t border-gray-200 bg-gray-50 relative">
                <div className="container-custom">
                    <div className="hidden lg:flex items-center gap-6 py-3">
                        {categories.slice(0, 8).map((category) => (
                            <div key={category._id} className="group">
                                <Link
                                    href={`/category/${category.slug}`}
                                    className="flex items-center gap-2 text-gray-700 hover:text-primary-600 font-medium whitespace-nowrap"
                                >
                                    {category.icon && <span>{category.icon}</span>}
                                    {category.name}
                                </Link>

                                {/* Mega Menu - Positioned absolutely to overlay content */}
                                {category.children && category.children.length > 0 && (
                                    <div className="absolute left-0 right-0 top-full bg-white shadow-xl border-t border-gray-200 hidden group-hover:block z-50 w-full">
                                        <div className="container-custom py-6">
                                            <div className="grid grid-cols-4 gap-6">
                                                {category.children.map((subcat) => (
                                                    <div key={subcat._id}>
                                                        <Link
                                                            href={`/category/${subcat.slug}`}
                                                            className="font-semibold text-gray-900 hover:text-primary-600 block mb-2"
                                                        >
                                                            {subcat.name}
                                                        </Link>
                                                        {subcat.children && subcat.children.length > 0 && (
                                                            <ul className="space-y-1">
                                                                {subcat.children.map((child) => (
                                                                    <li key={child._id}>
                                                                        <Link
                                                                            href={`/category/${child.slug}`}
                                                                            className="text-sm text-gray-600 hover:text-primary-600"
                                                                        >
                                                                            {child.name}
                                                                        </Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <div className="lg:hidden py-4 space-y-2">
                            {categories.map((category) => (
                                <Link
                                    key={category._id}
                                    href={`/category/${category.slug}`}
                                    className="block px-4 py-2 hover:bg-gray-100 rounded"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {category.icon && <span className="mr-2">{category.icon}</span>}
                                    {category.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}
