import { useRouter } from 'next/router';
import { useState } from 'react';
import useSWR from 'swr';
import api from '../lib/axios';
import ProductGrid from '../components/products/ProductGrid';
import Pagination from '../components/ui/Pagination';

const fetcher = (url) => api.get(url).then((res) => res.data);

export default function SearchPage() {
    const router = useRouter();
    const { q } = router.query;
    const [currentPage, setCurrentPage] = useState(1);

    const { data, isLoading } = useSWR(
        q ? `/products/search?q=${encodeURIComponent(q)}&page=${currentPage}&limit=20` : null,
        fetcher
    );

    if (!q) {
        return (
            <div className="container-custom py-12 text-center">
                <h1 className="text-2xl font-bold">Enter a search query</h1>
            </div>
        );
    }

    const products = data?.products || [];

    return (
        <div className="bg-gray-50 min-h-screen py-6">
            <div className="container-custom">
                <h1 className="text-3xl font-bold mb-2">
                    Search Results for "{q}"
                </h1>
                <p className="text-gray-600 mb-6">
                    {isLoading ? 'Searching...' : `${data?.count || 0} products found`}
                </p>

                <ProductGrid products={products} loading={isLoading} />

                {data && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={data.totalPages || 1}
                        onPageChange={(page) => {
                            setCurrentPage(page);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                    />
                )}
            </div>
        </div>
    );
}
