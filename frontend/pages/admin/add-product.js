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
    const [uploadingVideo, setUploadingVideo] = useState(false);
    const [categories, setCategories] = useState([]);
    const [mainCategories, setMainCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [uploadedVideos, setUploadedVideos] = useState([]);
    const [videoPreviews, setVideoPreviews] = useState([]);

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
        videos: '',
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
                const uploadFormData = new FormData();
                uploadFormData.append('image', file);

                const { data } = await axios.post('/upload/product', uploadFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                console.log('Upload response:', data);

                // Handle both relative and absolute URLs
                const imageUrl = data.url.startsWith('http')
                    ? data.url
                    : `${window.location.origin}${data.url}`;

                return imageUrl;
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            console.log('Uploaded images to Cloudinary:', uploadedUrls);

            setUploadedImages(prev => [...prev, ...uploadedUrls]);
            setImagePreviews(prev => [...prev, ...uploadedUrls]);

            toast.success(`${uploadedUrls.length} image(s) uploaded successfully to cloud storage!`);
        } catch (error) {
            console.error('Upload error:', error);
            console.error('Error details:', error.response?.data);
            toast.error(error.response?.data?.message || 'Failed to upload images to cloud storage');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        toast.info('Image removed');
    };

    const handleImageUrlAdd = async () => {
        const urlString = formData.images.trim();

        if (!urlString) {
            toast.error('Please enter image URL(s)');
            return;
        }

        const urls = urlString.split(',').map(url => url.trim()).filter(url => url);

        if (urls.length === 0) {
            toast.error('No valid URLs found');
            return;
        }

        // Validate URLs
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

        setUploading(true);
        toast.info('Processing images from URLs...');

        try {
            // Upload each URL to Cloudinary to ensure it works
            const uploadPromises = validUrls.map(async (url) => {
                try {
                    const { data } = await axios.post('/upload/url', { url });
                    return data.url; // Return Cloudinary URL
                } catch (error) {
                    console.error(`Failed to upload ${url}:`, error);
                    // If upload fails, return original URL as fallback
                    return url;
                }
            });

            const cloudinaryUrls = await Promise.all(uploadPromises);

            setUploadedImages(prev => [...prev, ...cloudinaryUrls]);
            setImagePreviews(prev => [...prev, ...cloudinaryUrls]);
            setFormData({ ...formData, images: '' });
            toast.success(`${cloudinaryUrls.length} image(s) uploaded to cloud storage!`);
        } catch (error) {
            console.error('URL processing error:', error);
            toast.error('Some images failed to process');
        } finally {
            setUploading(false);
        }
    };

    const handleVideoUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const validFiles = files.filter(file => file.type.startsWith('video/'));
        if (validFiles.length !== files.length) {
            toast.error('Please select only video files');
            return;
        }

        const oversizedFiles = validFiles.filter(file => file.size > 100 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            toast.error('Each video must be less than 100MB');
            return;
        }

        setUploadingVideo(true);
        toast.info('Uploading videos... This may take a while.');

        try {
            const uploadPromises = validFiles.map(async (file) => {
                const uploadFormData = new FormData();
                uploadFormData.append('video', file);

                const { data } = await axios.post('/upload/video', uploadFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                console.log('Video upload response:', data);
                return data.url;
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            console.log('Uploaded videos to Cloudinary:', uploadedUrls);

            setUploadedVideos(prev => [...prev, ...uploadedUrls]);
            setVideoPreviews(prev => [...prev, ...uploadedUrls]);

            toast.success(`${uploadedUrls.length} video(s) uploaded successfully to cloud storage!`);
        } catch (error) {
            console.error('Video upload error:', error);
            console.error('Error details:', error.response?.data);
            toast.error(error.response?.data?.message || 'Failed to upload videos to cloud storage');
        } finally {
            setUploadingVideo(false);
        }
    };

    const handleVideoUrlAdd = async () => {
        const urlString = formData.videos.trim();

        if (!urlString) {
            toast.error('Please enter video URL(s)');
            return;
        }

        const urls = urlString.split(',').map(url => url.trim()).filter(url => url);

        if (urls.length === 0) {
            toast.error('No valid URLs found');
            return;
        }

        // Validate URLs
        const validUrls = urls.filter(url => {
            try {
                new URL(url);
                return true;
            } catch {
                return false;
            }
        });

        if (validUrls.length === 0) {
            toast.error('Please enter valid video URLs');
            return;
        }

        setUploadingVideo(true);
        toast.info('Processing videos from URLs... This may take a while.');

        try {
            // Upload each URL to Cloudinary
            const uploadPromises = validUrls.map(async (url) => {
                try {
                    console.log('🔗 Uploading video from URL:', url);
                    const { data } = await axios.post('/upload/video-url', { url });
                    console.log('✅ Video URL upload success:', data);
                    return data.url; // Return Cloudinary URL
                } catch (error) {
                    console.error(`❌ Failed to upload ${url}:`, error);
                    console.error('Error response:', error.response?.data);
                    toast.error(`Failed: ${error.response?.data?.message || error.message}`);
                    return null;
                }
            });

            const cloudinaryUrls = (await Promise.all(uploadPromises)).filter(url => url !== null);

            if (cloudinaryUrls.length > 0) {
                setUploadedVideos(prev => [...prev, ...cloudinaryUrls]);
                setVideoPreviews(prev => [...prev, ...cloudinaryUrls]);
                setFormData({ ...formData, videos: '' });
                toast.success(`${cloudinaryUrls.length} video(s) uploaded to cloud storage!`);
            } else {
                toast.error('All video uploads failed');
            }
        } catch (error) {
            console.error('Video URL processing error:', error);
            toast.error('Some videos failed to process');
        } finally {
            setUploadingVideo(false);
        }
    };

    const removeVideo = (index) => {
        setUploadedVideos(prev => prev.filter((_, i) => i !== index));
        setVideoPreviews(prev => prev.filter((_, i) => i !== index));
        toast.info('Video removed');
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

            // Combine uploaded videos and URL videos
            const allVideos = [...uploadedVideos];
            if (formData.videos.trim()) {
                const urlVideos = formData.videos.split(',').map(vid => vid.trim()).filter(vid => vid);
                allVideos.push(...urlVideos);
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
                videos: allVideos,
                tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
            };

            console.log('📦 Submitting product with videos:', productData);
            console.log('📹 Videos being sent:', allVideos);

            const { data } = await axios.post('/products', productData);

            console.log('✅ Server response:', data);

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
                videos: '',
                tags: '',
            });
            setUploadedImages([]);
            setImagePreviews([]);
            setUploadedVideos([]);
            setVideoPreviews([]);

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
                                            <div key={index} className="relative group bg-gray-50 rounded-lg overflow-hidden">
                                                <div className="aspect-square">
                                                    <img
                                                        src={url}
                                                        alt={`Product ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%236b7280" font-family="sans-serif" font-size="14">Invalid Image</text></svg>';
                                                        }}
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full p-1.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 touch-manipulation z-10"
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
                                                <p className="text-xs text-gray-500">PNG, JPG, GIF, WebP up to 10MB</p>
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
                                        placeholder="Paste any image URL (Google Images, Unsplash, etc.) - comma-separated"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        disabled={uploading}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleImageUrlAdd}
                                        disabled={!formData.images.trim() || uploading}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                                    >
                                        {uploading ? 'Processing...' : 'Add URL'}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1.5">
                                    <FiImage className="inline mr-1" />
                                    Works with ANY image URL! Images are automatically re-uploaded to cloud storage for reliability.
                                </p>
                            </div>

                            {/* Product Videos */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Videos (Optional)
                                </label>

                                {/* Video Previews */}
                                {videoPreviews.length > 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                        {videoPreviews.map((url, index) => (
                                            <div key={index} className="relative group bg-gray-900 rounded-lg overflow-hidden">
                                                <video
                                                    src={url}
                                                    controls
                                                    className="w-full h-48 object-contain"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeVideo(index)}
                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 z-10"
                                                >
                                                    <FiX size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Video Upload Button */}
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                                    <div className="flex flex-col items-center justify-center pt-4 pb-5">
                                        {uploadingVideo ? (
                                            <>
                                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3"></div>
                                                <p className="text-sm text-gray-600">Uploading videos...</p>
                                                <p className="text-xs text-gray-500 mt-1">This may take a while</p>
                                            </>
                                        ) : (
                                            <>
                                                <FiUpload className="w-10 h-10 text-gray-400 mb-3" />
                                                <p className="mb-2 text-sm text-gray-600">
                                                    <span className="font-semibold">Click to upload videos</span>
                                                </p>
                                                <p className="text-xs text-gray-500">MP4, MOV, WebM up to 100MB</p>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="video/*"
                                        multiple
                                        onChange={handleVideoUpload}
                                        disabled={uploadingVideo}
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

                                {/* Video URL Input */}
                                <div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            name="videos"
                                            value={formData.videos}
                                            onChange={handleChange}
                                            placeholder="Paste video URL (YouTube, Vimeo, etc.) - comma-separated"
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            disabled={uploadingVideo}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleVideoUrlAdd}
                                            disabled={!formData.videos.trim() || uploadingVideo}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                                        >
                                            {uploadingVideo ? 'Processing...' : 'Add Video'}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1.5">
                                        📹 Paste video URLs from any source - they'll be re-uploaded to cloud storage.
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
