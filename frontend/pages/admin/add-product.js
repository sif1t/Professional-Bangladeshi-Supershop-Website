import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from '../../lib/axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';

export default function AdminAddProduct() {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [mainCategories, setMainCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

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
            const allCategories = data.categories || [];
            setCategories(allCategories);
            console.log(`Loaded ${allCategories.length} categories for product form`);

            // Separate main categories (level 1)
            const mains = allCategories.filter(cat => cat.level === 1 || !cat.parentCategory);
            setMainCategories(mains);

            if (mains.length === 0) {
                toast.warning('No categories found. Please add categories first.');
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

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);

        if (files.length === 0) return;

        // Validate file types
        const validFiles = files.filter(file => file.type.startsWith('image/'));
        if (validFiles.length !== files.length) {
            toast.error('Please select only image files');
            return;
        }

        // Validate file sizes (max 5MB each)
        const oversizedFiles = validFiles.filter(file => file.size > 5 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            toast.error('Each image must be less than 5MB');
            return;
        }

        setUploading(true);

        try {
            const uploadPromises = validFiles.map(async (file) => {
                const formData = new FormData();
                formData.append('image', file);
                formData.append('type', 'product');

                const { data } = await axios.post('/upload/product', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                return data.url;
            });

            const uploadedUrls = await Promise.all(uploadPromises);

            setUploadedImages(prev => [...prev, ...uploadedUrls]);
            setImagePreviews(prev => [...prev, ...uploadedUrls]);

            toast.success(`${uploadedUrls.length} image(s) uploaded successfully!`);
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload images');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        toast.info('Image removed');
    };

    const handleImageUrlAdd = () => {
        if (formData.images.trim()) {
            const urls = formData.images.split(',').map(url => url.trim()).filter(url => url);
            setUploadedImages(prev => [...prev, ...urls]);
            setImagePreviews(prev => [...prev, ...urls]);
            setFormData({ ...formData, images: '' });
            toast.success('Image URLs added');
        }
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
            // Combine uploaded images and URL images
            const allImages = [...uploadedImages];
            if (formData.images.trim()) {
                const urlImages = formData.images.split(',').map(img => img.trim()).filter(img => img);
                allImages.push(...urlImages);
            }

            if (allImages.length === 0) {
                toast.error('Please add at least one product image');
                setLoading(false);
                return;
            }

            const productData = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                category: formData.category,
                stock: parseInt(formData.stock),
                unit: formData.unit,
                featured: formData.featured,
                images: allImages,
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
            setUploadedImages([]);
            setImagePreviews([]);

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
        <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
            <div className="max-w-4xl mx-auto px-3 sm:px-4">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Add New Product</h1>
                    <p className="text-sm sm:text-base text-gray-600">Fill in the details to add a new product to your store</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                    {/* Basic Information */}
                    <div className="mb-6 sm:mb-8">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
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
                    <div className="mb-6 sm:mb-8">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
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
                    <div className="mb-6 sm:mb-8">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
                            Media & Tags
                        </h2>

                        <div className="space-y-4 sm:space-y-6">
                            {/* Images Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Images
                                </label>

                                {/* Image Previews */}
                                {imagePreviews.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 mb-4">
                                        {imagePreviews.map((url, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={url}
                                                    alt={`Product ${index + 1}`}
                                                    className="w-full h-24 sm:h-32 object-cover rounded-lg border-2 border-gray-200"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full p-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 touch-manipulation"
                                                >
                                                    <FiX className="w-3 h-3 sm:w-4 sm:h-4" />
                                                </button>
                                                {index === 0 && (
                                                    <span className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 bg-green-500 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                                                        Primary
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Upload Button */}
                                <label className="flex flex-col items-center justify-center w-full h-32 sm:h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all">
                                    <div className="flex flex-col items-center justify-center pt-4 pb-5 sm:pt-5 sm:pb-6">
                                        {uploading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-green-600 mb-2 sm:mb-3"></div>
                                                <p className="text-xs sm:text-sm text-gray-600">Uploading images...</p>
                                            </>
                                        ) : (
                                            <>
                                                <FiUpload className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mb-2 sm:mb-3" />
                                                <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-gray-600 px-2 text-center">
                                                    <span className="font-semibold">Click to upload</span> <span className="hidden sm:inline">or drag and drop</span>
                                                </p>
                                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                    />
                                </label>

                                {/* Or Divider */}
                                <div className="relative my-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">OR</span>
                                    </div>
                                </div>

                                {/* Image URL Input */}
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="images"
                                        value={formData.images}
                                        onChange={handleChange}
                                        placeholder="Paste image URLs (comma-separated)"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleImageUrlAdd}
                                        disabled={!formData.images.trim()}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Add URL
                                    </button>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    <FiImage className="inline mr-1" />
                                    Upload from your computer or paste image URLs from Unsplash, etc.
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
