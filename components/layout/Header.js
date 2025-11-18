import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { FiSearch, FiUser, FiShoppingCart, FiMapPin, FiMenu, FiX, FiTrendingUp } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import useSWR from 'swr';
import api from '../../lib/axios';
import { locationData, divisions, getDistrictsByDivision, getPopularDistricts } from '../../lib/deliveryFee';

const fetcher = (url) => api.get(url).then((res) => res.data);

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedArea, setSelectedArea] = useState('ঢাকা');
    const [showAccountDropdown, setShowAccountDropdown] = useState(false);
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [locationSearchQuery, setLocationSearchQuery] = useState('');
    const { user, isAuthenticated, logout } = useAuth();
    const { getCartCount } = useCart();
    const router = useRouter();
    const searchRef = useRef(null);
    const mobileSearchRef = useRef(null);
    const locationRef = useRef(null);

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

    const handleSuggestionClick = (productSlug) => {
        setShowSearchResults(false);
        setSearchQuery('');
        router.push(`/product/${productSlug}`);
    };

    // ব্যবহার করুন আমদানিকৃত locationData, divisions থেকে

    const handleAreaChange = (area) => {
        const location = locationData.find(loc => loc.name === area);
        setSelectedArea(area);
        setShowLocationDropdown(false);
        setLocationSearchQuery('');
        // লোকালস্টোরেজে সংরক্ষণ
        localStorage.setItem('selectedArea', area);

        // লোকেশন পরিবর্তনের জন্য কাস্টম ইভেন্ট
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('locationChanged'));
        }

        // টোস্ট নোটিফিকেশন দেখান
        if (typeof window !== 'undefined' && window.toast) {
            window.toast.success(
                `📍 এলাকা নির্বাচিত: ${area}\n🚚 ডেলিভারি: ৳${location.deliveryFee} (৳${location.freeDeliveryThreshold} এর উপরে ফ্রি)`,
                { autoClose: 5000 }
            );
        }
    };

    useEffect(() => {
        const savedArea = localStorage.getItem('selectedArea');
        if (savedArea) setSelectedArea(savedArea);
    }, []);

    // সার্চ অনুযায়ী এলাকা ফিল্টার
    const filteredLocations = locationData.filter(location =>
        location.name.toLowerCase().includes(locationSearchQuery.toLowerCase()) ||
        location.division.toLowerCase().includes(locationSearchQuery.toLowerCase())
    );

    const popularLocations = getPopularDistricts().filter(loc =>
        loc.name.toLowerCase().includes(locationSearchQuery.toLowerCase()) ||
        loc.division.toLowerCase().includes(locationSearchQuery.toLowerCase())
    );
    const otherLocations = filteredLocations.filter(loc => !loc.popular);

    // Close location dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (locationRef.current && !locationRef.current.contains(event.target)) {
                setShowLocationDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
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
                            <span className="hidden md:inline">
                                🎉 Free delivery on orders over ৳{locations.find(loc => loc.name === selectedArea)?.freeDeliveryThreshold || 1000} to {selectedArea}
                            </span>
                            <span className="hidden lg:inline text-primary-100">
                                • ৳{locations.find(loc => loc.name === selectedArea)?.deliveryFee || 50} delivery fee
                            </span>
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

                    {/* Enhanced Delivery Location */}
                    <div className="hidden lg:block relative" ref={locationRef}>
                        <button
                            onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-lg hover:shadow-md transition-all group"
                        >
                            <FiMapPin className="text-primary-600 group-hover:scale-110 transition-transform" size={18} />
                            <div className="flex flex-col items-start">
                                <span className="text-xs text-gray-500">Deliver to</span>
                                <span className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                                    {locations.find(loc => loc.name === selectedArea)?.icon} {selectedArea}
                                    <svg className={`w-4 h-4 transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </div>
                        </button>

                        {/* Enhanced Location Dropdown */}
                        {showLocationDropdown && (
                            <div className="absolute top-full mt-2 left-0 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-[500px] overflow-hidden z-50 animate-fadeIn">
                                {/* Header */}
                                <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4">
                                    <h3 className="font-bold text-lg mb-1">📍 Select Your Location</h3>
                                    <p className="text-sm text-primary-100">Choose your delivery area for accurate estimates</p>
                                </div>

                                {/* Search Box */}
                                <div className="p-3 border-b border-gray-100 bg-gray-50">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search for your area..."
                                            value={locationSearchQuery}
                                            onChange={(e) => setLocationSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
                                            autoFocus
                                        />
                                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    </div>
                                </div>

                                {/* Current Location */}
                                <div className="p-3 bg-primary-50 border-b border-primary-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white">
                                            {locations.find(loc => loc.name === selectedArea)?.icon}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500">Current Location</p>
                                            <p className="font-semibold text-gray-800">{selectedArea}</p>
                                            <p className="text-xs text-primary-600">
                                                ⚡ Est. delivery: {locations.find(loc => loc.name === selectedArea)?.deliveryTime}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="overflow-y-auto max-h-[300px]">
                                    {/* Popular Locations */}
                                    {popularLocations.length > 0 && (
                                        <div className="p-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FiTrendingUp className="text-orange-500" size={16} />
                                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Popular Areas</h4>
                                            </div>
                                            <div className="space-y-1">
                                                {popularLocations.map((location) => (
                                                    <button
                                                        key={location.name}
                                                        onClick={() => handleAreaChange(location.name)}
                                                        className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-primary-50 transition-colors text-left group ${selectedArea === location.name ? 'bg-primary-100 border border-primary-300' : 'border border-transparent'
                                                            }`}
                                                    >
                                                        <span className="text-2xl group-hover:scale-110 transition-transform">{location.icon}</span>
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-800">{location.name}</p>
                                                            <p className="text-xs text-gray-500">{location.division}</p>
                                                            <p className="text-xs text-blue-600 mt-1">
                                                                💰 ৳{location.deliveryFee} • Free on ৳{location.freeDeliveryThreshold}+
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs text-primary-600 font-medium">⚡ {location.deliveryTime}</p>
                                                            {selectedArea === location.name && (
                                                                <span className="text-green-600 text-xs font-semibold">✓ Selected</span>
                                                            )}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Other Locations */}
                                    {otherLocations.length > 0 && (
                                        <div className="p-3 border-t border-gray-100">
                                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Other Areas</h4>
                                            <div className="space-y-1">
                                                {otherLocations.map((location) => (
                                                    <button
                                                        key={location.name}
                                                        onClick={() => handleAreaChange(location.name)}
                                                        className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left group ${selectedArea === location.name ? 'bg-primary-100 border border-primary-300' : 'border border-transparent'
                                                            }`}
                                                    >
                                                        <span className="text-2xl group-hover:scale-110 transition-transform">{location.icon}</span>
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-800">{location.name}</p>
                                                            <p className="text-xs text-gray-500">{location.division}</p>
                                                            <p className="text-xs text-blue-600 mt-1">
                                                                💰 ৳{location.deliveryFee} • Free on ৳{location.freeDeliveryThreshold}+
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs text-gray-600">⚡ {location.deliveryTime}</p>
                                                            {selectedArea === location.name && (
                                                                <span className="text-green-600 text-xs font-semibold">✓ Selected</span>
                                                            )}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* No Results */}
                                    {filteredLocations.length === 0 && (
                                        <div className="p-8 text-center">
                                            <div className="text-5xl mb-3">📍</div>
                                            <p className="text-gray-600 font-medium">No locations found</p>
                                            <p className="text-sm text-gray-500 mt-1">Try searching with a different term</p>
                                        </div>
                                    )}
                                </div>

                                {/* Footer Info */}
                                <div className="p-3 bg-gray-50 border-t border-gray-200">
                                    <div className="flex items-start gap-2 text-xs text-gray-600">
                                        <span className="text-blue-500 mt-0.5">ℹ️</span>
                                        <p>
                                            <span className="font-semibold">Note:</span> Delivery times are estimates and may vary based on traffic and order volume.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
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
                                                        onClick={() => handleSuggestionClick(product.slug)}
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
                                                    onClick={() => handleSuggestionClick(product.slug)}
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

                {/* Mobile Location Selector */}
                <div className="mt-3 lg:hidden">
                    <button
                        onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                        className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-lg hover:shadow-md transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <FiMapPin className="text-primary-600" size={20} />
                            <div className="flex flex-col items-start">
                                <span className="text-xs text-gray-500">Deliver to</span>
                                <span className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                                    {locations.find(loc => loc.name === selectedArea)?.icon} {selectedArea}
                                </span>
                            </div>
                        </div>
                        <svg className={`w-5 h-5 text-gray-600 transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Mobile Location Dropdown - Full Width */}
                    {showLocationDropdown && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden" onClick={() => setShowLocationDropdown(false)}>
                            <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-2xl max-h-[85vh] overflow-hidden animate-slideUp" onClick={(e) => e.stopPropagation()}>
                                {/* Header */}
                                <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-lg">📍 Select Your Location</h3>
                                        <p className="text-sm text-primary-100">Choose delivery area</p>
                                    </div>
                                    <button
                                        onClick={() => setShowLocationDropdown(false)}
                                        className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30"
                                    >
                                        <FiX size={20} />
                                    </button>
                                </div>

                                {/* Search Box */}
                                <div className="p-4 border-b border-gray-100 bg-gray-50">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search for your area..."
                                            value={locationSearchQuery}
                                            onChange={(e) => setLocationSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                        />
                                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    </div>
                                </div>

                                {/* Current Location */}
                                <div className="p-4 bg-primary-50 border-b border-primary-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-2xl">
                                            {locations.find(loc => loc.name === selectedArea)?.icon}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500">Current Location</p>
                                            <p className="font-bold text-gray-800 text-lg">{selectedArea}</p>
                                            <p className="text-xs text-primary-600">
                                                ⚡ Est. delivery: {locations.find(loc => loc.name === selectedArea)?.deliveryTime}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="overflow-y-auto" style={{ maxHeight: 'calc(85vh - 280px)' }}>
                                    {/* Popular Locations */}
                                    {popularLocations.length > 0 && (
                                        <div className="p-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <FiTrendingUp className="text-orange-500" size={18} />
                                                <h4 className="text-sm font-semibold text-gray-700">Popular Areas</h4>
                                            </div>
                                            <div className="space-y-2">
                                                {popularLocations.map((location) => (
                                                    <button
                                                        key={location.name}
                                                        onClick={() => handleAreaChange(location.name)}
                                                        className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${selectedArea === location.name
                                                            ? 'bg-primary-100 border-2 border-primary-400 shadow-md'
                                                            : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                                                            }`}
                                                    >
                                                        <span className="text-3xl">{location.icon}</span>
                                                        <div className="flex-1 text-left">
                                                            <p className="font-semibold text-gray-800">{location.name}</p>
                                                            <p className="text-xs text-gray-500">{location.division}</p>
                                                            <p className="text-xs text-blue-600 font-medium mt-1">
                                                                💰 ৳{location.deliveryFee} • Free on ৳{location.freeDeliveryThreshold}+
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs text-primary-600 font-medium">⚡ {location.deliveryTime}</p>
                                                            {selectedArea === location.name && (
                                                                <span className="text-green-600 text-xs font-semibold">✓ Selected</span>
                                                            )}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Other Locations */}
                                    {otherLocations.length > 0 && (
                                        <div className="p-4 border-t border-gray-100">
                                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Other Areas</h4>
                                            <div className="space-y-2">
                                                {otherLocations.map((location) => (
                                                    <button
                                                        key={location.name}
                                                        onClick={() => handleAreaChange(location.name)}
                                                        className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${selectedArea === location.name
                                                            ? 'bg-primary-100 border-2 border-primary-400 shadow-md'
                                                            : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                                                            }`}
                                                    >
                                                        <span className="text-3xl">{location.icon}</span>
                                                        <div className="flex-1 text-left">
                                                            <p className="font-semibold text-gray-800">{location.name}</p>
                                                            <p className="text-xs text-gray-500">{location.division}</p>
                                                            <p className="text-xs text-blue-600 font-medium mt-1">
                                                                💰 ৳{location.deliveryFee} • Free on ৳{location.freeDeliveryThreshold}+
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs text-gray-600">⚡ {location.deliveryTime}</p>
                                                            {selectedArea === location.name && (
                                                                <span className="text-green-600 text-xs font-semibold">✓ Selected</span>
                                                            )}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* No Results */}
                                    {filteredLocations.length === 0 && (
                                        <div className="p-8 text-center">
                                            <div className="text-6xl mb-3">📍</div>
                                            <p className="text-gray-700 font-semibold text-lg">No locations found</p>
                                            <p className="text-sm text-gray-500 mt-1">Try searching with a different term</p>
                                        </div>
                                    )}
                                </div>

                                {/* Footer Info */}
                                <div className="p-4 bg-gray-50 border-t border-gray-200">
                                    <div className="flex items-start gap-2 text-xs text-gray-600">
                                        <span className="text-blue-500 text-base">ℹ️</span>
                                        <p className="leading-relaxed">
                                            <span className="font-semibold">Note:</span> Delivery times are estimates and may vary based on traffic and order volume.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
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
