import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from '../../lib/axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

export default function AdminAddProduct() {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [mainCategories, setMainCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        mainCategory: '',
        stock: '',
        unit: 'kg',
        featured: false,
        images: '',
        tags: '',
    });

    // Fetch categories on mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get('/categories?all=true');
            const allCategories = data.categories || data.data || [];
            setCategories(allCategories);

            // Separate main categories (level 1)
            const mains = allCategories.filter(cat => cat.level === 1 || !cat.parentCategory);
            setMainCategories(mains);

            if (mains.length === 0) {
                toast.warning('No categories found. Please run: npm run seed:pro');
            }
        } catch (error) {
            console.error('Category fetch error:', error);
            toast.error('Failed to load categories. Is the backend running?');
        }
    };

    // Handle main category change to load subcategories
    const handleMainCategoryChange = (e) => {
        const mainCatId = e.target.value;
        setFormData({ ...formData, mainCategory: mainCatId, category: '' });

        // Filter subcategories
        const subs = categories.filter(cat => cat.parentCategory?._id === mainCatId || cat.parentCategory === mainCatId);
        setSubCategories(subs);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.price || !formData.category || !formData.stock) {
            toast.error('Please fill all required fields');
            return;
        }

        setLoading(true);

        try {
            const productData = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                category: formData.category,
                stock: parseInt(formData.stock),
                unit: formData.unit,
                featured: formData.featured,
                images: formData.images ? formData.images.split(',').map(img => img.trim()) : [],
                tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
            };

            const { data } = await axios.post('/products', productData);

            toast.success('Product added successfully!');

            // Reset form
            setFormData({
                name: '',
                description: '',
                price: '',
                category: '',
                mainCategory: '',
                stock: '',
                unit: 'kg',
                featured: false,
                images: '',
                tags: '',
            });

            // Redirect to product page
            setTimeout(() => {
                router.push(`/product/${data.data.slug}`);
            }, 1500);

        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Add New Product</h1>
                    <p className="text-gray-600">Fill in the details to add a new product to your store</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                    {/* Basic Information */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
                            Basic Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Product Name */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g., Fresh Tomatoes"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Describe your product..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Inventory */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
                            Pricing & Inventory
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price (৳) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>

                            {/* Stock */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Stock <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    placeholder="0"
                                    min="0"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>

                            {/* Unit */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Unit <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="kg">Kilogram (kg)</option>
                                    <option value="gm">Gram (gm)</option>
                                    <option value="liter">Liter</option>
                                    <option value="ml">Milliliter (ml)</option>
                                    <option value="piece">Piece</option>
                                    <option value="dozen">Dozen</option>
                                    <option value="packet">Packet</option>
                                    <option value="bottle">Bottle</option>
                                    <option value="box">Box</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Category Selection */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
                            Category
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Main Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Main Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="mainCategory"
                                    value={formData.mainCategory}
                                    onChange={handleMainCategoryChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="">Select Main Category</option>
                                    {mainCategories.map(cat => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Subcategory */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subcategory <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    disabled={!formData.mainCategory}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                                >
                                    <option value="">Select Subcategory</option>
                                    {subCategories.map(cat => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                {!formData.mainCategory && (
                                    <p className="text-sm text-gray-500 mt-1">Select a main category first</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Media & Tags */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
                            Media & Tags
                        </h2>

                        <div className="space-y-6">
                            {/* Images */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Image URLs (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    name="images"
                                    value={formData.images}
                                    onChange={handleChange}
                                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Use Unsplash or other image URLs. Separate multiple URLs with commas.
                                </p>
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tags (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleChange}
                                    placeholder="fresh, organic, vegetables"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Add relevant keywords for better search results
                                </p>
                            </div>

                            {/* Featured */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="featured"
                                    id="featured"
                                    checked={formData.featured}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                />
                                <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-700">
                                    Mark as Featured Product (Show on homepage)
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                        >
                            {loading ? 'Adding Product...' : 'Add Product'}
                        </button>
                    </div>
                </form>

                {/* Quick Tips */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">💡 Quick Tips:</h3>
                    <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                        <li>Use clear, descriptive product names</li>
                        <li>Add high-quality images (800x800px recommended)</li>
                        <li>Set realistic stock levels</li>
                        <li>Use relevant tags for better search results</li>
                        <li>Mark bestsellers as featured to showcase them</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
