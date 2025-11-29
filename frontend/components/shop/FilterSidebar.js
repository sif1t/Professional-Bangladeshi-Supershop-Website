import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function FilterSidebar({
    categories,
    brands,
    selectedCategory,
    selectedBrand,
    priceRange,
    onCategoryChange,
    onBrandChange,
    onPriceRangeChange,
    onClearFilters
}) {
    const [isCategoryOpen, setIsCategoryOpen] = useState(true);
    const [isBrandOpen, setIsBrandOpen] = useState(true);
    const [isPriceOpen, setIsPriceOpen] = useState(true);

    const handlePriceChange = (e) => {
        const value = parseInt(e.target.value);
        onPriceRangeChange([priceRange[0], value]);
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-24">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Filters</h3>
                <button
                    onClick={onClearFilters}
                    className="text-sm text-primary-600 hover:underline"
                >
                    Clear All
                </button>
            </div>

            {/* Category Filter */}
            <div className="border-b border-gray-200 pb-4 mb-4">
                <button
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className="flex justify-between items-center w-full mb-3"
                >
                    <span className="font-medium">Category</span>
                    {isCategoryOpen ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {isCategoryOpen && (
                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="category"
                                checked={!selectedCategory}
                                onChange={() => onCategoryChange(null)}
                                className="mr-2 accent-primary-600"
                            />
                            <span className="text-sm">All Categories</span>
                        </label>
                        {categories.map((category) => (
                            <label key={category._id} className="flex items-center">
                                <input
                                    type="radio"
                                    name="category"
                                    checked={selectedCategory === category._id}
                                    onChange={() => onCategoryChange(category._id)}
                                    className="mr-2 accent-primary-600"
                                />
                                <span className="text-sm">{category.name}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Brand Filter */}
            {brands && brands.length > 0 && (
                <div className="border-b border-gray-200 pb-4 mb-4">
                    <button
                        onClick={() => setIsBrandOpen(!isBrandOpen)}
                        className="flex justify-between items-center w-full mb-3"
                    >
                        <span className="font-medium">Brand</span>
                        {isBrandOpen ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                    {isBrandOpen && (
                        <div className="space-y-2">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="brand"
                                    checked={!selectedBrand}
                                    onChange={() => onBrandChange(null)}
                                    className="mr-2 accent-primary-600"
                                />
                                <span className="text-sm">All Brands</span>
                            </label>
                            {brands.map((brand, index) => (
                                <label key={index} className="flex items-center">
                                    <input
                                        type="radio"
                                        name="brand"
                                        checked={selectedBrand === brand}
                                        onChange={() => onBrandChange(brand)}
                                        className="mr-2 accent-primary-600"
                                    />
                                    <span className="text-sm">{brand}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Price Range Filter */}
            <div className="pb-4">
                <button
                    onClick={() => setIsPriceOpen(!isPriceOpen)}
                    className="flex justify-between items-center w-full mb-3"
                >
                    <span className="font-medium">Price Range</span>
                    {isPriceOpen ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {isPriceOpen && (
                    <div>
                        <input
                            type="range"
                            min="0"
                            max="5000"
                            step="100"
                            value={priceRange[1]}
                            onChange={handlePriceChange}
                            className="w-full accent-primary-600"
                        />
                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                            <span>৳{priceRange[0]}</span>
                            <span>৳{priceRange[1]}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
