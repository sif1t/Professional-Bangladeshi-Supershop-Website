import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useSWR from 'swr';
import api from '../../lib/axios';
import ProductGrid from '../../components/products/ProductGrid';
import FilterSidebar from '../../components/shop/FilterSidebar';
import Pagination from '../../components/ui/Pagination';

const fetcher = (url) => api.get(url).then((res) => res.data);

export default function CategoryPage() {
    const router = useRouter();
    const { slug } = router.query;

    const [selectedBrand, setSelectedBrand] = useState(null);
    const [priceRange, setPriceRange] = useState([0, 5000]);
    const [sortBy, setSortBy] = useState('-createdAt');
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch category data
    const { data: categoryData } = useSWR(
        slug ? `/categories/${slug}` : null,
        fetcher
    );

    // Build products query
    const buildProductsQuery = () => {
        const params = new URLSearchParams();
        if (categoryData?.category?._id) params.append('category', categoryData.category._id);
        if (selectedBrand) params.append('brand', selectedBrand);
        params.append('minPrice', priceRange[0]);
        params.append('maxPrice', priceRange[1]);
        params.append('sort', sortBy);
        params.append('page', currentPage);
        params.append('limit', 20);
        return `/products?${params.toString()}`;
    };

    // Fetch products
    const { data: productsData, isLoading } = useSWR(
        categoryData?.category ? buildProductsQuery() : null,
        fetcher
    );

    // Extract unique brands from products
    const brands = productsData?.products
        ? [...new Set(productsData.products.map((p) => p.brand).filter(Boolean))]
        : [];

    const handleClearFilters = () => {
        setSelectedBrand(null);
        setPriceRange([0, 5000]);
        setSortBy('-createdAt');
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!slug) return null;

    if (!categoryData) {
        return (
            <div className="container-custom py-12">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
            </div>
        );
    }

    const category = categoryData.category;

    if (!category) {
        return (
            <div className="container-custom py-12 text-center">
                <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
                <Link href="/" className="text-primary-600 hover:underline">
                    Return to Homepage
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container-custom py-6">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm mb-6">
                    <Link href="/" className="text-gray-600 hover:text-primary-600">
                        Home
                    </Link>
                    <span className="text-gray-400">/</span>
                    {category.parentCategory && (
                        <>
                            <Link
                                href={`/category/${category.parentCategory.slug}`}
                                className="text-gray-600 hover:text-primary-600"
                            >
                                {category.parentCategory.name}
                            </Link>
                            <span className="text-gray-400">/</span>
                        </>
                    )}
                    <span className="text-gray-900 font-medium">{category.name}</span>
                </nav>

                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
                    {category.description && (
                        <p className="text-gray-600">{category.description}</p>
                    )}
                </div>

                {/* Subcategories */}
                {category.subcategories && category.subcategories.length > 0 && (
                    <div className="mb-6 bg-white rounded-lg p-4 border border-gray-200">
                        <h3 className="font-semibold mb-3">Browse by Subcategory</h3>
                        <div className="flex flex-wrap gap-2">
                            {category.subcategories.map((subcat) => (
                                <Link
                                    key={subcat._id}
                                    href={`/category/${subcat.slug}`}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:border-primary-600 hover:text-primary-600 transition-colors"
                                >
                                    {subcat.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Filters */}
                    <div className="lg:col-span-1">
                        <FilterSidebar
                            categories={[]}
                            brands={brands}
                            selectedCategory={null}
                            selectedBrand={selectedBrand}
                            priceRange={priceRange}
                            onCategoryChange={() => { }}
                            onBrandChange={setSelectedBrand}
                            onPriceRangeChange={setPriceRange}
                            onClearFilters={handleClearFilters}
                        />
                    </div>

                    {/* Products */}
                    <div className="lg:col-span-3">
                        {/* Toolbar */}
                        <div className="flex justify-between items-center mb-6 bg-white rounded-lg p-4 border border-gray-200">
                            <div className="text-gray-600">
                                {productsData?.count || 0} Products Found
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-gray-600">Sort by:</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                >
                                    <option value="-createdAt">Newest First</option>
                                    <option value="createdAt">Oldest First</option>
                                    <option value="variants.price">Price: Low to High</option>
                                    <option value="-variants.price">Price: High to Low</option>
                                    <option value="name">Name: A to Z</option>
                                    <option value="-name">Name: Z to A</option>
                                </select>
                            </div>
                        </div>

                        {/* Product Grid */}
                        <ProductGrid
                            products={productsData?.products}
                            loading={isLoading}
                        />

                        {/* Pagination */}
                        {productsData && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={productsData.totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
