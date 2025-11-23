import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import useSWR from 'swr';
import api from '../lib/axios';
import ProductCard from '../components/products/ProductCard';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const fetcher = (url) => api.get(url).then((res) => res.data);

export default function Home() {
    const { data: categoriesData } = useSWR('/categories?level=1', fetcher);
    const { data: featuredData } = useSWR('/products?isFeatured=true&limit=24', fetcher);
    const { data: bestSavingData } = useSWR('/products?isBestSaving=true&limit=20', fetcher);
    const { data: newArrivalsData } = useSWR('/products?isNewArrival=true&limit=20', fetcher);
    const { data: buyGetFreeData } = useSWR('/products?isBuyGetFree=true&limit=20', fetcher);
    const { data: onSaleData } = useSWR('/products?onSale=true&limit=20', fetcher);

    const categories = categoriesData?.categories || [];
    const featuredProducts = featuredData?.products || [];
    const bestSavingProducts = bestSavingData?.products || [];
    const newArrivals = newArrivalsData?.products || [];
    const buyGetFreeProducts = buyGetFreeData?.products || [];
    const onSaleProducts = onSaleData?.products || [];

    // হিরো স্লাইডার ডেটা
    const heroSlides = [
        {
            id: 1,
            title: 'তাজা মুদি সামগ্রী ডেলিভারি',
            subtitle: 'আপনার দৈনন্দিন প্রয়োজনীয় জিনিস বাড়িতে পৌঁছে দিন',
            image: 'https://images.unsplash.com/photo-1542838132-92c53300491e',
            cta: 'এখনই কিনুন',
            link: '#featured-products',
            isScroll: true,
        },
        {
            id: 2,
            title: 'সেরা অফারে বড় সাশ্রয়',
            subtitle: 'নির্বাচিত পণ্যে ৫০% পর্যন্ত ছাড়',
            image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a',
            cta: 'অফার দেখুন',
            link: '#best-savings',
            isScroll: true,
        },
        {
            id: 3,
            title: 'তাজা শাকসবজি ও ফলমূল',
            subtitle: 'প্রতিদিন খামার থেকে সরাসরি তাজা পণ্য',
            image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03',
            cta: 'অর্ডার করুন',
            link: '#categories',
            isScroll: true,
        },
    ];

    const handleSlideClick = (slide) => {
        if (slide.isScroll) {
            const element = document.querySelector(slide.link);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    return (
        <div className="bg-gray-50">
            {/* Hero Carousel */}
            <section className="mb-8">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000 }}
                    loop
                    className="h-[300px] sm:h-[400px] lg:h-[500px]"
                >
                    {heroSlides.map((slide) => (
                        <SwiperSlide key={slide.id}>
                            <div className="relative w-full h-full">
                                <Image
                                    src={slide.image}
                                    alt={slide.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent">
                                    <div className="container-custom h-full flex items-center">
                                        <div className="max-w-xl text-white">
                                            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4">
                                                {slide.title}
                                            </h1>
                                            <p className="text-lg sm:text-xl mb-6">{slide.subtitle}</p>
                                            <button
                                                onClick={() => handleSlideClick(slide)}
                                                className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors cursor-pointer"
                                            >
                                                {slide.cta}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>

            {/* দ্রুত ক্যাটাগরি নেভিগেশন */}
            <section id="categories" className="container-custom mb-12">
                <h2 className="text-2xl font-bold mb-6">ক্যাটাগরি অনুযায়ী কেনাকাটা করুন</h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                    {categories.slice(0, 8).map((category) => (
                        <Link
                            key={category._id}
                            href={`/category/${category.slug}`}
                            className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-lg hover:border-primary-300 transition-all"
                        >
                            {category.icon ? (
                                <div className="text-4xl mb-2">{category.icon}</div>
                            ) : (
                                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-2">
                                    <span className="text-2xl text-primary-600">📦</span>
                                </div>
                            )}
                            <span className="text-xs sm:text-sm text-center font-medium">
                                {category.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* সেরা সাশ্রয় সেকশন */}
            {bestSavingProducts.length > 0 && (
                <section id="best-savings" className="container-custom mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">💰 সেরা সাশ্রয়</h2>
                        <Link href="/best-savings" className="text-primary-600 hover:underline">
                            সব দেখুন
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {bestSavingProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </section>
            )}

            {/* কিনুন ও ফ্রি পান সেকশন */}
            {buyGetFreeProducts.length > 0 && (
                <section className="container-custom mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">🎁 কিনুন ও ফ্রি পান</h2>
                        <Link href="/buy-get-free" className="text-primary-600 hover:underline">
                            সব দেখুন
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {buyGetFreeProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </section>
            )}

            {/* ফ্ল্যাশ সেইল সেকশন */}
            {onSaleProducts.length > 0 && (
                <section className="bg-gradient-to-r from-red-500 to-pink-500 py-12 mb-12">
                    <div className="container-custom">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">⚡ ফ্ল্যাশ সেইল</h2>
                            <Link href="/sale" className="text-white hover:underline">
                                সব দেখুন
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {onSaleProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* নতুন পণ্য সেকশন */}
            {newArrivals.length > 0 && (
                <section className="container-custom mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">✨ নতুন পণ্য</h2>
                        <Link href="/new-arrivals" className="text-primary-600 hover:underline">
                            সব দেখুন
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {newArrivals.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </section>
            )}

            {/* ফিচার্ড প্রডাক্ট সেকশন */}
            {featuredProducts.length > 0 && (
                <section id="featured-products" className="container-custom mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">⭐ বিশেষ পণ্যসমূহ</h2>
                        <Link href="/featured" className="text-primary-600 hover:underline">
                            সব দেখুন
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </section>
            )}

            {/* কেন আমাদের থেকে কিনবেন */}
            <section className="bg-white py-12 mb-12">
                <div className="container-custom">
                    <h2 className="text-2xl font-bold text-center mb-8">কেন আমাদের থেকে কিনবেন?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="text-5xl mb-4">🚚</div>
                            <h3 className="font-semibold mb-2">দ্রুত ডেলিভারি</h3>
                            <p className="text-sm text-gray-600">একই দিনে ডেলিভারি সুবিধা উপলব্ধ</p>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl mb-4">💯</div>
                            <h3 className="font-semibold mb-2">১০০% তাজা</h3>
                            <p className="text-sm text-gray-600">মানসম্মত পণ্যের গ্যারান্টি</p>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl mb-4">💰</div>
                            <h3 className="font-semibold mb-2">সেরা দাম</h3>
                            <p className="text-sm text-gray-600">সবসময় প্রতিযোগিতামূলুক দাম</p>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl mb-4">📞</div>
                            <h3 className="font-semibold mb-2">২৪/৭ সাপোর্ট</h3>
                            <p className="text-sm text-gray-600">যেকোনো সময় সাহায্যের জন্য প্রস্তুত</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
