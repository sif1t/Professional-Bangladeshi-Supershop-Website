import Link from 'next/link';
import { FiPackage, FiShoppingBag, FiUsers, FiGrid } from 'react-icons/fi';

export default function AdminDashboard() {
    const adminLinks = [
        {
            title: 'Products',
            description: 'Manage your product catalog',
            icon: FiPackage,
            href: '/admin/products',
            color: 'bg-blue-500',
        },
        {
            title: 'Add Product',
            description: 'Add new products to your store',
            icon: FiShoppingBag,
            href: '/admin/add-product',
            color: 'bg-green-500',
        },
        {
            title: 'Categories',
            description: 'Manage product categories',
            icon: FiGrid,
            href: '/admin/categories',
            color: 'bg-purple-500',
        },
        {
            title: 'Orders',
            description: 'View and manage orders',
            icon: FiUsers,
            href: '/admin/orders',
            color: 'bg-orange-500',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
                    <p className="text-gray-600">Manage your Bangladeshi Supershop</p>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {adminLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <Link key={link.href} href={link.href} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group">
                                <div className={`${link.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <Icon className="text-white text-2xl" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    {link.title}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {link.description}
                                </p>
                            </Link>
                        );
                    })}
                </div>

                {/* Quick Guide */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">🚀 Quick Start Guide</h2>
                    <div className="space-y-3 text-gray-700">
                        <div className="flex items-start">
                            <span className="font-semibold mr-2">1.</span>
                            <div>
                                <strong>Add Products:</strong> Click "Add Product" to add items with proper categories
                            </div>
                        </div>
                        <div className="flex items-start">
                            <span className="font-semibold mr-2">2.</span>
                            <div>
                                <strong>Manage Inventory:</strong> View all products and update stock levels
                            </div>
                        </div>
                        <div className="flex items-start">
                            <span className="font-semibold mr-2">3.</span>
                            <div>
                                <strong>Organize Categories:</strong> Keep your products well-organized by subcategories
                            </div>
                        </div>
                        <div className="flex items-start">
                            <span className="font-semibold mr-2">4.</span>
                            <div>
                                <strong>Track Orders:</strong> Monitor customer orders and fulfillment
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tips Section */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">💡 Pro Tips</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>• Use high-quality images (800x800px)</li>
                            <li>• Write clear product descriptions</li>
                            <li>• Set realistic stock levels</li>
                            <li>• Mark bestsellers as featured</li>
                            <li>• Use relevant tags for SEO</li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">📚 Resources</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>• Check PRODUCT_MANAGEMENT_GUIDE.md</li>
                            <li>• Images: unsplash.com (free)</li>
                            <li>• Run seed:pro for demo data</li>
                            <li>• Test on mobile devices</li>
                            <li>• Monitor stock alerts</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
