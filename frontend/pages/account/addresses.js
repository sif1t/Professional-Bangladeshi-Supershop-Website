import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FiPackage, FiUser, FiMapPin, FiShoppingBag, FiEdit2, FiTrash2, FiPlus, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

export default function MyAddresses() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [addresses, setAddresses] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        label: 'Home',
        addressLine1: '',
        addressLine2: '',
        city: 'Dhaka',
        area: '',
        zipCode: '',
        isDefault: false
    });

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (user) {
            fetchAddresses();
        }
    }, [user]);

    const fetchAddresses = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            if (data.success) {
                setAddresses(data.user?.addresses || []);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    }; const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = editingId
                ? `http://localhost:5000/api/auth/address/${editingId}`
                : 'http://localhost:5000/api/auth/address';

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
                toast.success(editingId ? 'Address updated successfully!' : 'Address added successfully!');
                setAddresses(data.addresses || []);
                resetForm();
            } else {
                toast.error(data.message || 'Failed to save address');
            }
        } catch (error) {
            console.error('Error saving address:', error);
            toast.error('Failed to save address');
        }
    }; const handleEdit = (address) => {
        setFormData({
            label: address.label,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2 || '',
            city: address.city,
            area: address.area,
            zipCode: address.zipCode || '',
            isDefault: address.isDefault || false
        });
        setEditingId(address._id);
        setShowAddForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this address?')) return;

        try {
            const res = await fetch(`http://localhost:5000/api/auth/address/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await res.json();

            if (data.success) {
                toast.success('Address deleted successfully!');
                setAddresses(data.addresses || []);
            } else {
                toast.error(data.message || 'Failed to delete address');
            }
        } catch (error) {
            console.error('Error deleting address:', error);
            toast.error('Failed to delete address');
        }
    }; const resetForm = () => {
        setFormData({
            label: 'Home',
            addressLine1: '',
            addressLine2: '',
            city: 'Dhaka',
            area: '',
            zipCode: '',
            isDefault: false
        });
        setEditingId(null);
        setShowAddForm(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const bangladeshiAreas = [
        'Mirpur', 'Dhanmondi', 'Gulshan', 'Banani', 'Uttara',
        'Mohammadpur', 'Badda', 'Rampura', 'Khilgaon', 'Malibagh',
        'Motijheel', 'Tejgaon', 'Savar', 'Gazipur', 'Narayanganj',
        'Chittagong', 'Sylhet'
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-900">{user.name}</h3>
                                <p className="text-sm text-gray-600">{user.phone}</p>
                            </div>
                            <nav className="space-y-2">
                                <Link href="/account/dashboard">
                                    <span className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
                                        <FiUser className="mr-3" />
                                        Dashboard
                                    </span>
                                </Link>
                                <Link href="/account/orders">
                                    <span className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
                                        <FiShoppingBag className="mr-3" />
                                        My Orders
                                    </span>
                                </Link>
                                <Link href="/account/addresses">
                                    <span className="flex items-center px-4 py-2 bg-green-50 text-green-600 rounded-lg cursor-pointer">
                                        <FiMapPin className="mr-3" />
                                        My Addresses
                                    </span>
                                </Link>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
                                {!showAddForm && (
                                    <button
                                        onClick={() => setShowAddForm(true)}
                                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                    >
                                        <FiPlus className="mr-2" />
                                        Add New Address
                                    </button>
                                )}
                            </div>

                            {/* Add/Edit Form */}
                            {showAddForm && (
                                <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                                    <h2 className="text-lg font-semibold mb-4">
                                        {editingId ? 'Edit Address' : 'Add New Address'}
                                    </h2>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Label
                                            </label>
                                            <select
                                                name="label"
                                                value={formData.label}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                required
                                            >
                                                <option value="Home">Home</option>
                                                <option value="Office">Office</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Address Line 1 *
                                            </label>
                                            <input
                                                type="text"
                                                name="addressLine1"
                                                value={formData.addressLine1}
                                                onChange={handleInputChange}
                                                placeholder="House/Flat No, Street Name"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Address Line 2
                                            </label>
                                            <input
                                                type="text"
                                                name="addressLine2"
                                                value={formData.addressLine2}
                                                onChange={handleInputChange}
                                                placeholder="Landmark, Building Name (Optional)"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    City *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Area *
                                                </label>
                                                <select
                                                    name="area"
                                                    value={formData.area}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    required
                                                >
                                                    <option value="">Select Area</option>
                                                    {bangladeshiAreas.map(area => (
                                                        <option key={area} value={area}>{area}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Zip Code
                                            </label>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleInputChange}
                                                placeholder="e.g., 1216"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="isDefault"
                                                checked={formData.isDefault}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                            />
                                            <label className="ml-2 text-sm text-gray-700">
                                                Set as default address
                                            </label>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                type="submit"
                                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                            >
                                                {editingId ? 'Update Address' : 'Save Address'}
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

                            {/* Addresses List */}
                            <div className="space-y-4">
                                {addresses.length === 0 ? (
                                    <div className="text-center py-12">
                                        <FiMapPin className="mx-auto text-gray-400 text-5xl mb-4" />
                                        <p className="text-gray-600 mb-4">No addresses saved yet</p>
                                        <button
                                            onClick={() => setShowAddForm(true)}
                                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                        >
                                            Add Your First Address
                                        </button>
                                    </div>
                                ) : (
                                    addresses.map(address => (
                                        <div
                                            key={address._id}
                                            className="border border-gray-200 rounded-lg p-4 hover:border-green-500 transition-colors"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                                                            {address.label}
                                                        </span>
                                                        {address.isDefault && (
                                                            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full flex items-center">
                                                                <FiCheck className="mr-1" />
                                                                Default
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-900 font-medium">{address.addressLine1}</p>
                                                    {address.addressLine2 && (
                                                        <p className="text-gray-600">{address.addressLine2}</p>
                                                    )}
                                                    <p className="text-gray-600">
                                                        {address.area}, {address.city}
                                                        {address.zipCode && ` - ${address.zipCode}`}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(address)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                        title="Edit"
                                                    >
                                                        <FiEdit2 />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(address._id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                        title="Delete"
                                                    >
                                                        <FiTrash2 />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
