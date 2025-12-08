import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from '../../lib/axios';
import { toast } from 'react-toastify';
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';
import Link from 'next/link';

export default function AdminProducts() {
    const router = useRouter();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterStock, setFilterStock] = useState('all');

    useEffect(() => {
        // Check authentication
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        if (!token || user.role !== 'admin') {
            router.push('/admin-login');
            return;
        }

        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/products?limit=1000');
            console.log('Products API response:', data);

            if (data.success && data.products) {
                setProducts(Array.isArray(data.products) ? data.products : []);
                console.log(`Loaded ${data.products.length} products successfully`);
            } else {
                setProducts([]);
                console.warn('No products found in response');
            }
        } catch (error) {
            console.error('Failed to load products:', error);
            console.error('Error details:', error.response?.data);
            toast.error('Failed to load products. Please check your connection.');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get('/categories?all=true');
            if (data.success && data.categories) {
                setCategories(Array.isArray(data.categories) ? data.categories : []);
                console.log(`Loaded ${data.categories.length} categories`);
            } else {
                setCategories([]);
            }
        } catch (error) {
            console.error('Failed to load categories:', error);
            setCategories([]);
        }
    };

    const handleDelete = async (id, name) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

        try {
            await axios.delete(`/products/${id}`);
            toast.success('Product deleted successfully');
            fetchProducts();
        } catch (error) {
            toast.error('Failed to delete product');
        }
    };

    // Filter products
    const filteredProducts = Array.isArray(products) ? products.filter(product => {
        const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = !filterCategory || product.category?._id === filterCategory;

        const matchesStock = filterStock === 'all' ||
            (filterStock === 'in-stock' && product.stock > 0) ||
            (filterStock === 'low-stock' && product.stock > 0 && product.stock <= 20) ||
            (filterStock === 'out-of-stock' && product.stock === 0);

        return matchesSearch && matchesCategory && matchesStock;
    }) : [];

    const getStockStatus = (stock) => {
        if (stock === 0) return { text: 'Out of Stock', color: 'text-red-600 bg-red-100' };
        if (stock <= 20) return { text: 'Low Stock', color: 'text-orange-600 bg-orange-100' };
        return { text: 'In Stock', color: 'text-green-600 bg-green-100' };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
            <div className="max-w-7xl mx-auto px-3 sm:px-4">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <Link href="/admin" className="flex items-center text-gray-600 hover:text-gray-900 text-sm sm:text-base">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="hidden sm:inline">Back to Dashboard</span>
                            <span className="sm:hidden">Back</span>
                        </Link>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">Product Management</h1>
                            <p className="text-sm sm:text-base text-gray-600">
                                Total: {products.length} products
                            </p>
                        </div>
                        <Link href="/admin/add-product" className="w-full sm:w-auto flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 text-white text-sm sm:text-base rounded-lg hover:bg-green-700 transition-colors">
                            <FiPlus className="mr-2" />
                            Add Product
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                        {/* Search */}
                        <div className="relative sm:col-span-2 md:col-span-1">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>

                        {/* Category Filter */}
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                            <option value="">All Categories</option>
                            {categories.filter(cat => cat.level === 2 || cat.parentCategory).map(cat => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>

                        {/* Stock Filter */}
                        <select
                            value={filterStock}
                            onChange={(e) => setFilterStock(e.target.value)}
                            className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                            <option value="all">All Stock</option>
                            <option value="in-stock">In Stock</option>
                            <option value="low-stock">Low Stock</option>
                            <option value="out-of-stock">Out</option>
                        </select>
                    </div>

                    <div className="mt-4 flex items-center text-sm text-gray-600">
                        <span>Showing {filteredProducts.length} of {products.length} products</span>
                    </div>
                </div>

                {/* Products Table - Desktop */}
                <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                            <p className="text-lg mb-2">No products found</p>
                                            <p className="text-sm">Try adjusting your filters or add a new product</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((product) => {
                                        const stockStatus = getStockStatus(product.stock);
                                        return (
                                            <tr key={product._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <img
                                                            src={product.images?.[0] || '/placeholder.png'}
                                                            alt={product.name}
                                                            className="h-12 w-12 rounded-lg object-cover"
                                                        />
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {product.name}
                                                            </div>
                                                            {product.featured && (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                    Featured
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {product.category?.name || 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-semibold text-gray-900">
                                                        ৳{product.price}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        per {product.unit}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {product.stock} {product.unit}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${stockStatus.color}`}>
                                                        {stockStatus.text}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => router.push(`/admin/edit-product/${product._id}`)}
                                                            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded"
                                                            title="Edit"
                                                        >
                                                            <FiEdit2 />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(product._id, product.name)}
                                                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded"
                                                            title="Delete"
                                                        >
                                                            <FiTrash2 />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Products Cards - Mobile */}
                <div className="md:hidden space-y-3">
                    {filteredProducts.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-6 text-center">
                            <p className="text-gray-500 mb-1">No products found</p>
                            <p className="text-sm text-gray-400">Try adjusting filters</p>
                        </div>
                    ) : (
                        filteredProducts.map((product) => {
                            const stockStatus = getStockStatus(product.stock);
                            return (
                                <div key={product._id} className="bg-white rounded-lg shadow-md p-3">
                                    <div className="flex gap-3">
                                        <img
                                            src={product.images?.[0] || '/placeholder.png'}
                                            alt={product.name}
                                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-sm text-gray-900 truncate">{product.name}</h3>
                                            <p className="text-xs text-gray-500 mt-0.5">{product.category?.name || 'N/A'}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-sm font-bold text-gray-900">৳{product.price}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${stockStatus.color}`}>
                                                    {stockStatus.text}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600 mt-1">Stock: {product.stock} {product.unit}</p>
                                        </div>
                                        <div className="flex flex-col gap-1 flex-shrink-0">
                                            <button
                                                onClick={() => router.push(`/admin/edit-product/${product._id}`)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors touch-manipulation"
                                                title="Edit"
                                            >
                                                <FiEdit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product._id, product.name)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors touch-manipulation"
                                                title="Delete"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6">
                    <div className="bg-white rounded-lg shadow-md p-3 sm:p-6">
                        <div className="text-xs sm:text-sm text-gray-600">Total</div>
                        <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{products.length}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-3 sm:p-6">
                        <div className="text-xs sm:text-sm text-gray-600">In Stock</div>
                        <div className="text-xl sm:text-2xl font-bold text-green-600 mt-1">
                            {products.filter(p => p.stock > 20).length}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-3 sm:p-6">
                        <div className="text-xs sm:text-sm text-gray-600">Low Stock</div>
                        <div className="text-xl sm:text-2xl font-bold text-orange-600 mt-1">
                            {products.filter(p => p.stock > 0 && p.stock <= 20).length}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-3 sm:p-6">
                        <div className="text-xs sm:text-sm text-gray-600">Out</div>
                        <div className="text-xl sm:text-2xl font-bold text-red-600 mt-1">
                            {products.filter(p => p.stock === 0).length}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
