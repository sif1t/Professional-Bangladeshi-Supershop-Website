import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { FiSearch, FiUser, FiShoppingCart, FiMapPin, FiMenu, FiX, FiTrendingUp } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import useSWR from 'swr';
import api from '../../lib/axios';

const fetcher = (url) => api.get(url).then((res) => res.data);

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedArea, setSelectedArea] = useState('Dhaka');
    const [showAccountDropdown, setShowAccountDropdown] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();
    const { getCartCount } = useCart();
    const router = useRouter();
    const searchRef = useRef(null);
    const mobileSearchRef = useRef(null);

    const { data: categoriesData } = useSWR('/categories/tree', fetcher);
    const categories = categoriesData?.categories || [];

    // Fetch search suggestions
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.trim().length < 2) {
                setSearchSuggestions([]);
                setShowSearchResults(false);
                return;
            }

            setIsSearching(true);
            try {
                const response = await api.get(`/products/search?q=${encodeURIComponent(searchQuery)}&limit=8`);
                if (response.data.success) {
                    setSearchSuggestions(response.data.products || []);
                    setShowSearchResults(true);
                }
            } catch (error) {
                console.error('Search error:', error);
                setSearchSuggestions([]);
            } finally {
                setIsSearching(false);
            }
        };

        const debounceTimer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target) &&
                mobileSearchRef.current && !mobileSearchRef.current.contains(event.target)) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            setShowSearchResults(false);
        }
    };

    const handleSuggestionClick = (productId) => {
        setShowSearchResults(false);
        setSearchQuery('');
        router.push(`/product/${productId}`);
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

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showAccountDropdown && !event.target.closest('.account-dropdown-container')) {
                setShowAccountDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showAccountDropdown]);

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
                        <div className="relative" ref={searchRef}>
                            <input
                                type="text"
                                placeholder="Search for products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
                                className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                autoComplete="off"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700"
                            >
                                <FiSearch size={20} />
                            </button>

                            {/* Search Suggestions Dropdown */}
                            {showSearchResults && searchQuery.length >= 2 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[500px] overflow-y-auto">
                                    {isSearching ? (
                                        <div className="p-4 text-center text-gray-500">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                                            <p className="mt-2">Searching...</p>
                                        </div>
                                    ) : searchSuggestions.length > 0 ? (
                                        <>
                                            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                                                <FiTrendingUp className="text-primary-600" />
                                                <span className="text-sm font-medium text-gray-700">
                                                    {searchSuggestions.length} Products Found
                                                </span>
                                            </div>
                                            <div className="divide-y divide-gray-100">
                                                {searchSuggestions.map((product) => (
                                                    <button
                                                        key={product._id}
                                                        onClick={() => handleSuggestionClick(product._id)}
                                                        className="w-full px-4 py-3 hover:bg-gray-50 flex items-center gap-4 text-left transition-colors"
                                                    >
                                                        <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden relative">
                                                            {product.images && product.images[0] ? (
                                                                <Image
                                                                    src={product.images[0]}
                                                                    alt={product.name}
                                                                    fill
                                                                    className="object-cover"
                                                                    sizes="64px"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                    <FiSearch size={24} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-medium text-gray-900 truncate">
                                                                {product.name}
                                                            </h4>
                                                            <p className="text-sm text-gray-500 truncate">
                                                                {product.category?.name || 'Product'}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-primary-600 font-semibold">
                                                                    ৳{product.price}
                                                                </span>
                                                                {product.originalPrice && product.originalPrice > product.price && (
                                                                    <span className="text-sm text-gray-400 line-through">
                                                                        ৳{product.originalPrice}
                                                                    </span>
                                                                )}
                                                                {product.stock <= 0 && (
                                                                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
                                                                        Out of Stock
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleSearch(e);
                                                }}
                                                className="w-full px-4 py-3 bg-gray-50 text-primary-600 font-medium hover:bg-gray-100 transition-colors border-t border-gray-200"
                                            >
                                                View all results for "{searchQuery}"
                                            </button>
                                        </>
                                    ) : (
                                        <div className="p-8 text-center">
                                            <FiSearch className="mx-auto text-gray-300 mb-3" size={48} />
                                            <p className="text-gray-500 font-medium">No products found</p>
                                            <p className="text-sm text-gray-400 mt-1">
                                                Try searching with different keywords
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </form>

                    {/* User & Cart */}
                    <div className="flex items-center gap-4">
                        {/* Account */}
                        <div className="relative account-dropdown-container">
                            <button
                                onClick={() => {
                                    if (isAuthenticated) {
                                        setShowAccountDropdown(!showAccountDropdown);
                                    } else {
                                        router.push('/login');
                                    }
                                }}
                                className="flex items-center gap-2 hover:text-primary-600 cursor-pointer"
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
                            </button>

                            {/* Dropdown */}
                            {isAuthenticated && showAccountDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                                    <Link
                                        href="/account/dashboard"
                                        className="block px-4 py-2 hover:bg-gray-50 rounded-t-lg"
                                        onClick={() => setShowAccountDropdown(false)}
                                    >
                                        My Account
                                    </Link>
                                    <Link
                                        href="/account/orders"
                                        className="block px-4 py-2 hover:bg-gray-50"
                                        onClick={() => setShowAccountDropdown(false)}
                                    >
                                        My Orders
                                    </Link>
                                    {user?.role === 'admin' && (
                                        <Link
                                            href="/admin"
                                            className="block px-4 py-2 hover:bg-gray-50 border-t"
                                            onClick={() => setShowAccountDropdown(false)}
                                        >
                                            🛠️ Admin Panel
                                        </Link>
                                    )}
                                    <Link
                                        href="/account/addresses"
                                        className="block px-4 py-2 hover:bg-gray-50"
                                        onClick={() => setShowAccountDropdown(false)}
                                    >
                                        My Addresses
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setShowAccountDropdown(false);
                                            logout();
                                        }}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 border-t rounded-b-lg"
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
                    <div className="relative" ref={mobileSearchRef}>
                        <input
                            type="text"
                            placeholder="Search for products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
                            className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                            autoComplete="off"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 text-white p-2 rounded-lg"
                        >
                            <FiSearch size={20} />
                        </button>

                        {/* Mobile Search Suggestions Dropdown */}
                        {showSearchResults && searchQuery.length >= 2 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[400px] overflow-y-auto">
                                {isSearching ? (
                                    <div className="p-4 text-center text-gray-500">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                                        <p className="mt-2 text-sm">Searching...</p>
                                    </div>
                                ) : searchSuggestions.length > 0 ? (
                                    <>
                                        <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                                            <FiTrendingUp className="text-primary-600" size={16} />
                                            <span className="text-xs font-medium text-gray-700">
                                                {searchSuggestions.length} Products
                                            </span>
                                        </div>
                                        <div className="divide-y divide-gray-100">
                                            {searchSuggestions.map((product) => (
                                                <button
                                                    key={product._id}
                                                    onClick={() => handleSuggestionClick(product._id)}
                                                    className="w-full px-3 py-2 hover:bg-gray-50 flex items-center gap-3 text-left"
                                                >
                                                    <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded overflow-hidden relative">
                                                        {product.images && product.images[0] ? (
                                                            <Image
                                                                src={product.images[0]}
                                                                alt={product.name}
                                                                fill
                                                                className="object-cover"
                                                                sizes="48px"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                <FiSearch size={16} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-medium text-gray-900 truncate">
                                                            {product.name}
                                                        </h4>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="text-sm text-primary-600 font-semibold">
                                                                ৳{product.price}
                                                            </span>
                                                            {product.stock <= 0 && (
                                                                <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                                                                    Out of Stock
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleSearch(e);
                                            }}
                                            className="w-full px-3 py-2.5 bg-gray-50 text-primary-600 text-sm font-medium hover:bg-gray-100 border-t border-gray-200"
                                        >
                                            View all results
                                        </button>
                                    </>
                                ) : (
                                    <div className="p-6 text-center">
                                        <FiSearch className="mx-auto text-gray-300 mb-2" size={32} />
                                        <p className="text-sm text-gray-500 font-medium">No products found</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Try different keywords
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
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
