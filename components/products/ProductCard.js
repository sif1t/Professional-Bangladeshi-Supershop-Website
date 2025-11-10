import Link from 'next/link';
import Image from 'next/image';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { formatPrice, calculateDiscount } from '../../lib/utils';
import ImageZoom from '../ui/ImageZoom';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();

    // Get the first variant or use product's direct price
    const variant = product.variants && product.variants.length > 0
        ? product.variants[0]
        : {
            price: product.price || 0,
            salePrice: product.salePrice || null,
            stock: product.stock || 0,
            name: product.unit || 'piece'
        };

    const price = variant.salePrice || variant.price;
    const originalPrice = variant.price;
    const discount = calculateDiscount(originalPrice, variant.salePrice);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, variant, 1);
    };

    return (
        <Link href={`/product/${product.slug}`}>
            <div className="bg-white rounded-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-1">
                {/* Image Container */}
                <div className="relative">
                    <ImageZoom
                        src={product.images[0] || '/placeholder-product.jpg'}
                        alt={product.name}
                        className="aspect-square bg-gray-100"
                    />

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1 pointer-events-none z-10">
                        {product.onSale && discount > 0 && (
                            <span className="bg-secondary-500 text-white text-xs font-bold px-2 py-1 rounded">
                                {discount}% OFF
                            </span>
                        )}
                        {product.isFeatured && (
                            <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                                Featured
                            </span>
                        )}
                        {product.isNewArrival && (
                            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                                New
                            </span>
                        )}
                        {product.isBuyGetFree && (
                            <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded">
                                Buy {product.buyGetFreeDetails?.buy} Get {product.buyGetFreeDetails?.get}
                            </span>
                        )}
                    </div>

                    {/* Wishlist Button */}
                    <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary-50 z-10">
                        <FiHeart size={16} className="text-primary-600" />
                    </button>

                    {/* Stock Status */}
                    {variant.stock === 0 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center pointer-events-none z-10">
                            <span className="bg-white text-red-600 font-bold px-4 py-2 rounded">
                                Out of Stock
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-3">
                    {/* Brand */}
                    {product.brand && (
                        <div className="text-xs text-gray-500 mb-1">{product.brand}</div>
                    )}

                    {/* Title */}
                    <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 h-10">
                        {product.name}
                    </h3>

                    {/* Variant */}
                    <div className="text-xs text-gray-600 mb-2">{variant.name}</div>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold text-primary-600">
                            {formatPrice(price)}
                        </span>
                        {variant.salePrice && (
                            <span className="text-sm text-gray-500 line-through">
                                {formatPrice(originalPrice)}
                            </span>
                        )}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        onClick={handleAddToCart}
                        disabled={variant.stock === 0}
                        className="w-full btn-primary py-2 text-sm disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <FiShoppingCart size={16} />
                        Add to Cart
                    </button>
                </div>
            </div>
        </Link>
    );
}
