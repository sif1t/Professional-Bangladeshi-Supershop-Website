import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiArrowLeft, FiEdit2, FiTrash2, FiPlus, FiGrid, FiPackage } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { API_URL } from '../../lib/api';

export default function AdminCategories() {
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        parent: '',
        image: ''
    });

    useEffect(() => {
        checkAuth();
        fetchCategories();
    }, []);

    const checkAuth = () => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        if (!token || user.role !== 'admin') {
            router.push('/admin-login');
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_URL}/categories?all=true`);
            const data = await res.json();

            if (data.success && data.categories) {
                setCategories(data.categories);
                console.log(`Loaded ${data.categories.length} categories`);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Auto-generate slug from name
        if (name === 'name') {
            setFormData(prev => ({
                ...prev,
                slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = editingId
                ? `${API_URL}/categories/${editingId}`
                : `${API_URL}/categories`;

            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (data.success) {
                toast.success(editingId ? 'Category updated successfully!' : 'Category created successfully!');
                fetchCategories();
                resetForm();
            } else {
                toast.error(data.message || 'Failed to save category');
            }
        } catch (error) {
            console.error('Error saving category:', error);
            toast.error('Failed to save category');
        }
    };

    const handleEdit = (category) => {
        setFormData({
            name: category.name,
            slug: category.slug,
            description: category.description || '',
            parent: category.parent?._id || '',
            image: category.image || ''
        });
        setEditingId(category._id);
        setShowAddForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
            return;
        }

        try {
            const res = await fetch(`${API_URL}/categories/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await res.json();

            if (data.success) {
                toast.success('Category deleted successfully!');
                fetchCategories();
            } else {
                toast.error(data.message || 'Failed to delete category');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            toast.error('Failed to delete category');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            slug: '',
            description: '',
            parent: '',
            image: ''
        });
        setEditingId(null);
        setShowAddForm(false);
    };

    const parentCategories = categories.filter(cat => !cat.parent);
    const getSubcategories = (parentId) => {
        return categories.filter(cat => cat.parent?._id === parentId);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Link href="/admin">
                                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                        <FiArrowLeft className="text-xl" />
                                    </button>
                                </Link>
                                <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
                            </div>
                            <p className="text-gray-600">Manage product categories</p>
                        </div>
                        {!showAddForm && (
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <FiPlus />
                                Add Category
                            </button>
                        )}
                    </div>
                </div>

                {/* Add/Edit Form */}
                {showAddForm && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">
                            {editingId ? 'Edit Category' : 'Add New Category'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Vegetables, Dairy Products"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Slug *
                                    </label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleInputChange}
                                        placeholder="e.g., vegetables, dairy-products"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Brief description of the category"
                                    rows="3"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Parent Category
                                    </label>
                                    <select
                                        name="parent"
                                        value={formData.parent}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        <option value="">None (Main Category)</option>
                                        {parentCategories.map(cat => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Image URL
                                    </label>
                                    <input
                                        type="url"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleInputChange}
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    {editingId ? 'Update Category' : 'Create Category'}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Categories List */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">All Categories ({categories.length})</h2>

                    {categories.length === 0 ? (
                        <div className="text-center py-12">
                            <FiGrid className="mx-auto text-gray-400 text-5xl mb-4" />
                            <p className="text-gray-600 mb-4">No categories found</p>
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Create First Category
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Parent Categories */}
                            {parentCategories.map(parent => {
                                const subcategories = getSubcategories(parent._id);

                                return (
                                    <div key={parent._id} className="border border-gray-200 rounded-lg p-4">
                                        {/* Parent Category */}
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                {parent.image ? (
                                                    <img
                                                        src={parent.image}
                                                        alt={parent.name}
                                                        className="w-12 h-12 object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                                        <FiGrid className="text-green-600 text-xl" />
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">{parent.name}</h3>
                                                    <p className="text-sm text-gray-500">
                                                        {parent.description || 'No description'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(parent)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                    title="Edit"
                                                >
                                                    <FiEdit2 />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(parent._id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Subcategories */}
                                        {subcategories.length > 0 && (
                                            <div className="ml-12 space-y-2 border-l-2 border-gray-200 pl-4">
                                                {subcategories.map(sub => (
                                                    <div key={sub._id} className="flex items-center justify-between py-2">
                                                        <div className="flex items-center gap-2">
                                                            <FiPackage className="text-gray-400" />
                                                            <span className="text-gray-700">{sub.name}</span>
                                                            <span className="text-xs text-gray-400">({sub.slug})</span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleEdit(sub)}
                                                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                                title="Edit"
                                                            >
                                                                <FiEdit2 size={14} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(sub._id)}
                                                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                                title="Delete"
                                                            >
                                                                <FiTrash2 size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Orphan Categories (no parent) */}
                            {categories.filter(cat => cat.parent && !categories.find(c => c._id === cat.parent._id)).map(cat => (
                                <div key={cat._id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <FiPackage className="text-gray-600 text-xl" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">{cat.name}</h3>
                                                <p className="text-sm text-gray-500">
                                                    {cat.description || 'No description'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(cat)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                title="Edit"
                                            >
                                                <FiEdit2 />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat._id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                title="Delete"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
