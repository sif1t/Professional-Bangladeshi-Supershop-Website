import ProductCard from '../products/ProductCard';

export default function ProductGrid({ products, loading }) {
    if (loading) {
        return (
            <div className="product-grid">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
                        <div className="aspect-square bg-gray-200" />
                        <div className="p-3 space-y-2">
                            <div className="h-4 bg-gray-200 rounded" />
                            <div className="h-4 bg-gray-200 rounded w-2/3" />
                            <div className="h-6 bg-gray-200 rounded w-1/2" />
                            <div className="h-10 bg-gray-200 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
            </div>
        );
    }

    return (
        <div className="product-grid">
            {products.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    );
}
