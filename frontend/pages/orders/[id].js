import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function OrderRedirect() {
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (id) {
            // Redirect to the correct account orders page
            router.replace(`/account/orders/${id}`);
        }
    }, [id, router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Redirecting to order details...</p>
            </div>
        </div>
    );
}
