import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { FiUpload, FiX, FiImage, FiArrowLeft } from 'react-icons/fi';
import { API_URL } from '../../../lib/api';
import Link from 'next/link';

export default function EditProduct() {
    const router = useRouter();
    const { id } = router.query;
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
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

    // Check auth
    useEffect(() => {
        if (!user || user.role !== 'admin') {
            router.push('/admin-login');
        }
    }, [user, router]);

    // Fetch product and categories
    useEffect(() => {
        if (id) {
            fetchProduct();
            fetchCategories();
        }
    }, [id]);

    // Load subcategories when mainCategory changes
    useEffect(() => {
        if (formData.mainCategory && categories.length > 0) {
            const subs = categories.filter(cat =>
                cat.parentCategory?._id === formData.mainCategory ||
                cat.parentCategory === formData.mainCategory
            );
            setSubCategories(subs);
        }
    }, [formData.mainCategory, categories]);

    const fetchProduct = async () => {
        try {
            setFetching(true);
            const res = await fetch(`${API_URL}/products/${id}`);

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            }

            const data = await res.json();
            console.log('Product data received:', data);

            // Handle both response formats: { product } or { success, product }
            const product = data.product || data;

            if (!product || !product._id) {
                throw new Error('Invalid product data received');
            }

            // Get category IDs
            const categoryId = product.category?._id || product.category || '';
            let mainCategoryId = '';

            // If category is populated, get parent from it
            if (product.category?.parentCategory) {
                mainCategoryId = product.category.parentCategory._id || product.category.parentCategory;
            } else if (categoryId) {
                // If category is not populated, fetch it to get parent
                try {
                    const catRes = await fetch(`${API_URL}/categories?all=true`);
                    if (catRes.ok) {
                        const catData = await catRes.json();
                        const allCats = catData.categories || [];
                        const currentCat = allCats.find(c => c._id === categoryId);
                        if (currentCat?.parentCategory) {
                            mainCategoryId = currentCat.parentCategory._id || currentCat.parentCategory;
                        }
                    }
                } catch (err) {
                    console.warn('Could not fetch category parent:', err);
                }
            }

            // Set form data
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price || '',
                category: categoryId,
                mainCategory: mainCategoryId,
                stock: product.stock || '',
                unit: product.unit || 'kg',
                featured: product.featured || false,
                images: '',
                tags: product.tags ? product.tags.join(', ') : '',
            });

            // Set existing images with validation
            if (product.images && product.images.length > 0) {
                console.log('Loading product images:', product.images);
                
                // Validate and fix image URLs
                const validatedImages = product.images.map(img => {
                    // If it's already a full URL, use it
                    if (img.startsWith('http://') || img.startsWith('https://')) {
                        return img;
                    }
                    // If it's a relative path, convert to full URL
                    if (img.startsWith('/')) {
                        return `${API_URL.replace('/api', '')}${img}`;
                    }
                    // Otherwise, assume it needs the API URL prepended
                    return `${API_URL.replace('/api', '')}/${img}`;
                });
                
                console.log('Validated images:', validatedImages);
                setUploadedImages(validatedImages);
                setImagePreviews(validatedImages);
            }

            console.log('Product loaded successfully:', product.name);
            console.log('Category ID:', categoryId, 'Main Category ID:', mainCategoryId);
        } catch (error) {
            console.error('Error fetching product:', error);
            toast.error(error.message || 'Failed to load product');
            setTimeout(() => {
                router.push('/admin/products');
            }, 2000);
        } finally {
            setFetching(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_URL}/categories?all=true`);

            if (!res.ok) {
                throw new Error('Failed to fetch categories');
            }

            const data = await res.json();
            const allCategories = data.categories || [];
            setCategories(allCategories);

            // Separate main categories
            const mains = allCategories.filter(cat => cat.level === 1 || !cat.parentCategory);
            setMainCategories(mains);

            console.log(`Loaded ${allCategories.length} categories (${mains.length} main)`);
        } catch (error) {
            console.error('Category fetch error:', error);
            toast.error('Failed to load categories');
        }
    };

    const handleMainCategoryChange = (e) => {
        const mainCatId = e.target.value;
        setFormData({ ...formData, mainCategory: mainCatId, category: '' });

        // Filter subcategories
        const subs = categories.filter(cat =>
            cat.parentCategory?._id === mainCatId ||
            cat.parentCategory === mainCatId
        );
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

        const validFiles = files.filter(file => file.type.startsWith('image/'));
        if (validFiles.length !== files.length) {
            toast.error('Please select only image files');
            return;
        }

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

                const res = await fetch(`${API_URL}/upload`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: formData
                });

                const data = await res.json();
                if (data.success) {
                    return data.url;
                } else {
                    throw new Error(data.message || 'Upload failed');
                }
            });

            const newUrls = await Promise.all(uploadPromises);
            setUploadedImages([...uploadedImages, ...newUrls]);
            setImagePreviews([...imagePreviews, ...newUrls]);
            toast.success(`${newUrls.length} image(s) uploaded successfully`);
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload images');
        } finally {
            setUploading(false);
        }
    };

    const handleImageUrlAdd = () => {
        if (!formData.images.trim()) return;

        const urls = formData.images.split(',').map(url => url.trim()).filter(url => url);
        const validUrls = urls.filter(url => {
            try {
                new URL(url);
                return true;
            } catch {
                return false;
            }
        });

        if (validUrls.length === 0) {
            toast.error('Please enter valid image URLs');
            return;
        }

        console.log('Adding image URLs:', validUrls);
        const newUploadedImages = [...uploadedImages, ...validUrls];
        const newImagePreviews = [...imagePreviews, ...validUrls];
        
        console.log('Updated uploadedImages:', newUploadedImages);
        console.log('Updated imagePreviews:', newImagePreviews);
        
        setUploadedImages(newUploadedImages);
        setImagePreviews(newImagePreviews);
        setFormData({ ...formData, images: '' });
        toast.success(`${validUrls.length} image URL(s) added`);
    };

    const removeImage = (index) => {
        setUploadedImages(uploadedImages.filter((_, i) => i !== index));
        setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Form submission started');
        console.log('Form data:', formData);
        console.log('Uploaded images:', uploadedImages);

        // Validation
        if (!formData.name.trim()) {
            console.log('Validation failed: name missing');
            toast.error('Product name is required');
            return;
        }
        if (!formData.category) {
            console.log('Validation failed: category missing');
            toast.error('Please select a category');
            return;
        }
        if (!formData.price || formData.price <= 0) {
            console.log('Validation failed: price invalid');
            toast.error('Valid price is required');
            return;
        }
        if (formData.stock === '' || formData.stock < 0) {
            console.log('Validation failed: stock invalid');
            toast.error('Valid stock quantity is required');
            return;
        }
        if (uploadedImages.length === 0) {
            console.log('Validation failed: no images');
            toast.error('At least one product image is required');
            return;
        }

        setLoading(true);

        try {
            const productData = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                price: parseFloat(formData.price),
                category: formData.category,
                stock: parseInt(formData.stock),
                unit: formData.unit,
                featured: formData.featured,
                images: uploadedImages,
                tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : []
            };

            console.log('Sending product update:', productData);
            console.log('API URL:', `${API_URL}/products/${id}`);
            console.log('Token present:', !!localStorage.getItem('token'));

            const res = await fetch(`${API_URL}/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(productData)
            });

            console.log('Response status:', res.status);
            console.log('Response ok:', res.ok);

            const data = await res.json();
            console.log('Update response:', data);

            if (!res.ok) {
                console.error('Response not ok:', res.status, data);
                throw new Error(data.message || `HTTP ${res.status}: ${res.statusText}`);
            }

            if (data.success) {
                toast.success('Product updated successfully!');
                setTimeout(() => {
                    router.push('/admin/products');
                }, 1000);
            } else {
                throw new Error(data.message || 'Failed to update product');
            }
        } catch (error) {
            console.error('Update error details:', error);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            toast.error(error.message || 'Failed to update product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading product...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Link href="/admin/products">
                            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                                <FiArrowLeft size={20} />
                                <span className="hidden sm:inline">Back to Products</span>
                                <span className="sm:hidden">Back</span>
                            </button>
                        </Link>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Edit Product</h1>
                    <p className="text-sm sm:text-base text-gray-600">Update product information and details</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                    <div className="space-y-6">
                        {/* Product Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="e.g., Fresh Tomatoes"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Detailed description of the product..."
                            />
                        </div>

                        {/* Category Selection */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                            {/* Sub Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sub Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    disabled={!formData.mainCategory}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
                                >
                                    <option value="">Select Sub Category</option>
                                    {subCategories.map(cat => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Price and Stock */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price (৳) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Stock <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Unit <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="kg">Kilogram (kg)</option>
                                    <option value="piece">Piece (pcs)</option>
                                    <option value="liter">Liter (L)</option>
                                    <option value="dozen">Dozen</option>
                                    <option value="gram">Gram (g)</option>
                                    <option value="packet">Packet</option>
                                </select>
                            </div>
                        </div>

                        {/* Images */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Images
                            </label>

                            {/* Image Previews */}
                            {imagePreviews.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 mb-4">
                                    {imagePreviews.map((url, index) => (
                                        <div key={index} className="relative group bg-gray-50 rounded-lg overflow-hidden border-2 border-gray-200">
                                            <div className="aspect-square">
                                                <img
                                                    src={url}
                                                    alt={`Product ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f3f4f6" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%236b7280" font-family="sans-serif" font-size="14"%3EImage Error%3C/text%3E%3C/svg%3E';
                                                    }}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 p-1.5 bg-red-500 text-white rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 z-10"
                                            >
                                                <FiX size={16} />
                                            </button>
                                            {index === 0 && (
                                                <span className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                                    Primary
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Important Notice */}
                            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex gap-2">
                                    <FiImage className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                                    <div>
                                        <p className="text-sm font-medium text-yellow-800 mb-1">
                                            ⚠️ File uploads are disabled on this server
                                        </p>
                                        <p className="text-xs text-yellow-700">
                                            Please use image URLs from external sources like Unsplash, Imgur, or your own CDN. Uploaded files will be lost on server restart.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Image URL Input */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-2">
                                    Add Image URLs (Recommended)
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="images"
                                        value={formData.images}
                                        onChange={handleChange}
                                        placeholder="https://images.unsplash.com/photo-123... (comma-separated for multiple)"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleImageUrlAdd}
                                        disabled={!formData.images.trim()}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                    >
                                        <FiImage size={16} />
                                        Add
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1.5">
                                    💡 Tip: Right-click any image on <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Unsplash</a> → Copy Image Address
                                </p>
                            </div>
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
                                Mark as Featured Product
                            </label>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 pt-6 border-t mt-6">
                        <button
                            type="button"
                            onClick={() => router.push('/admin/products')}
                            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2 border border-gray-300 rounded-lg text-sm sm:text-base text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2 bg-green-600 text-white text-sm sm:text-base rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? 'Updating...' : 'Update Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
