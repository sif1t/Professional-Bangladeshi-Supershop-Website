import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import useSWR from 'swr';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import api from '../../lib/axios';
import { useCart } from '../../context/CartContext';
import { formatPrice, calculateDiscount } from '../../lib/utils';
import QuantityStepper from '../../components/ui/QuantityStepper';
import ProductCard from '../../components/products/ProductCard';
import ProductImageZoom from '../../components/ui/ProductImageZoom';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

const fetcher = (url) => api.get(url).then((res) => res.data);

export default function ProductPage() {
    const router = useRouter();
    const { slug } = router.query;
    const { addToCart } = useCart();

    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [activeTab, setActiveTab] = useState('description');

    // Fetch product data
    const { data: productData } = useSWR(
        slug ? `/products/${slug}` : null,
        fetcher
    );

    // Fetch related products
    const { data: relatedData } = useSWR(
        productData?.product?._id ? `/products/related/${productData.product._id}` : null,
        fetcher
    );

    if (!slug) return null;

    if (!productData) {
        return (
            <div className="container-custom py-12">
                <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="aspect-square bg-gray-200 rounded-lg" />
                    <div className="space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                        <div className="h-12 bg-gray-200 rounded w-1/3" />
                    </div>
                </div>
            </div>
        );
    }

    const product = productData.product;

    if (!product) {
        return (
            <div className="container-custom py-12 text-center">
                <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
                <Link href="/" className="text-primary-600 hover:underline">
                    Return to Homepage
                </Link>
            </div>
        );
    }

    // Handle both old variant-based products and new simple products
    const selectedVariant = product.variants && product.variants.length > 0
        ? product.variants[selectedVariantIndex]
        : {
            price: product.price || 0,
            salePrice: product.salePrice || null,
            stock: product.stock || 0,
            name: product.unit || 'piece'
        };

    const price = selectedVariant.salePrice || selectedVariant.price;
    const originalPrice = selectedVariant.price;
    const discount = calculateDiscount(originalPrice, selectedVariant.salePrice);

    const handleAddToCart = () => {
        addToCart(product, selectedVariant, quantity);
    };

    const relatedProducts = relatedData?.products || [];

    return (
        <div className="bg-gray-50">
            <div className="container-custom py-6">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm mb-6">
                    <Link href="/" className="text-gray-600 hover:text-primary-600">
                        Home
                    </Link>
                    <span className="text-gray-400">/</span>
                    <Link
                        href={`/category/${product.category.slug}`}
                        className="text-gray-600 hover:text-primary-600"
                    >
                        {product.category.name}
                    </Link>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-900 font-medium">{product.name}</span>
                </nav>

                {/* Product Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Images */}
                    <div>
                        {/* Main Image Slider */}
                        <Swiper
                            modules={[Navigation, Thumbs]}
                            navigation
                            thumbs={{ swiper: thumbsSwiper }}
                            className="mb-4 rounded-lg overflow-hidden"
                        >
                            {product.images.map((image, index) => (
                                <SwiperSlide key={index}>
                                    <ProductImageZoom
                                        src={image}
                                        alt={`${product.name} - ${index + 1}`}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Thumbnail Slider */}
                        {product.images.length > 1 && (
                            <Swiper
                                modules={[Thumbs]}
                                onSwiper={setThumbsSwiper}
                                spaceBetween={10}
                                slidesPerView={4}
                                watchSlidesProgress
                                className="thumbs-swiper"
                            >
                                {product.images.map((image, index) => (
                                    <SwiperSlide key={index} className="cursor-pointer group">
                                        <div className="relative aspect-square bg-white rounded-lg overflow-hidden border-2 border-transparent hover:border-primary-600 transition-all duration-300">
                                            <Image
                                                src={image}
                                                alt={`${product.name} thumbnail ${index + 1}`}
                                                fill
                                                className="object-contain group-hover:scale-110 transition-transform duration-300"
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="bg-white rounded-lg p-6">
                        {/* Brand */}
                        {product.brand && (
                            <div className="text-sm text-gray-600 mb-2">{product.brand}</div>
                        )}

                        {/* Title */}
                        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

                        {/* Rating & Reviews */}
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-1">
                                <span className="text-yellow-500">⭐</span>
                                <span className="font-medium">{product.rating.toFixed(1)}</span>
                            </div>
                            <span className="text-gray-600">({product.numReviews} reviews)</span>
                        </div>

                        {/* Price */}
                        <div className="mb-6 pb-6 border-b border-gray-200">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-4xl font-bold text-primary-600">
                                    {formatPrice(price)}
                                </span>
                                {selectedVariant.salePrice && (
                                    <>
                                        <span className="text-xl text-gray-500 line-through">
                                            {formatPrice(originalPrice)}
                                        </span>
                                        <span className="bg-secondary-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                            {discount}% OFF
                                        </span>
                                    </>
                                )}
                            </div>
                            <div className="text-sm text-gray-600">
                                {selectedVariant.stock > 0 ? (
                                    <span className="text-green-600 font-medium">In Stock</span>
                                ) : (
                                    <span className="text-red-600 font-medium">Out of Stock</span>
                                )}
                            </div>
                        </div>

                        {/* Variant Selection */}
                        {product.variants.length > 1 && (
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2">
                                    Select Variant:
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {product.variants.map((variant, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedVariantIndex(index)}
                                            className={`px-4 py-2 border rounded-lg font-medium transition-colors ${selectedVariantIndex === index
                                                ? 'border-primary-600 bg-primary-50 text-primary-600'
                                                : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                        >
                                            {variant.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-2">Quantity:</label>
                            <QuantityStepper
                                quantity={quantity}
                                onQuantityChange={setQuantity}
                                max={selectedVariant.stock}
                            />
                        </div>

                        {/* Add to Cart */}
                        <button
                            onClick={handleAddToCart}
                            disabled={selectedVariant.stock === 0}
                            className="w-full btn-primary py-4 text-lg mb-4"
                        >
                            Add to Cart
                        </button>

                        {/* Buy & Get Free Offer */}
                        {product.isBuyGetFree && product.buyGetFreeDetails && (
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                                <h4 className="font-semibold text-purple-900 mb-1">
                                    🎁 Special Offer!
                                </h4>
                                <p className="text-sm text-purple-700">
                                    Buy {product.buyGetFreeDetails.buy} get{' '}
                                    {product.buyGetFreeDetails.get} {product.buyGetFreeDetails.freeProductName} free!
                                </p>
                            </div>
                        )}

                        {/* Additional Info */}
                        <div className="border-t border-gray-200 pt-6 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">SKU:</span>
                                <span className="font-medium">{selectedVariant.sku || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Category:</span>
                                <Link
                                    href={`/category/${product.category.slug}`}
                                    className="font-medium text-primary-600 hover:underline"
                                >
                                    {product.category.name}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="bg-white rounded-lg p-6 mb-12">
                    {/* Tab Headers */}
                    <div className="flex border-b border-gray-200 mb-6">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`px-6 py-3 font-medium border-b-2 transition-colors ${activeTab === 'description'
                                ? 'border-primary-600 text-primary-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Description
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`px-6 py-3 font-medium border-b-2 transition-colors ${activeTab === 'reviews'
                                ? 'border-primary-600 text-primary-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Reviews ({product.numReviews})
                        </button>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'description' && (
                        <div className="prose max-w-none">
                            <p className="text-gray-700 leading-relaxed">{product.description}</p>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div>
                            <p className="text-gray-600">No reviews yet. Be the first to review!</p>
                        </div>
                    )}
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
                        <Swiper
                            modules={[Navigation]}
                            navigation
                            spaceBetween={16}
                            slidesPerView={2}
                            breakpoints={{
                                640: { slidesPerView: 3 },
                                768: { slidesPerView: 4 },
                                1024: { slidesPerView: 5 },
                                1280: { slidesPerView: 6 },
                            }}
                        >
                            {relatedProducts.map((product) => (
                                <SwiperSlide key={product._id}>
                                    <ProductCard product={product} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </section>
                )}
            </div>
        </div>
    );
}
