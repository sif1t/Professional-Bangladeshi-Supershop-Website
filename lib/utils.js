export const formatPrice = (price) => {
    return new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT',
        minimumFractionDigits: 0,
    }).format(price);
};

export const calculateDiscount = (price, salePrice) => {
    if (!salePrice || salePrice >= price) return 0;
    return Math.round(((price - salePrice) / price) * 100);
};

export const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date));
};

export const formatDateTime = (date) => {
    return new Intl.DateTimeFormat('en-BD', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
};

export const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
};

export const validateMobile = (mobile) => {
    const mobileRegex = /^01[0-9]{9}$/;
    return mobileRegex.test(mobile);
};

export const getOrderStatusColor = (status) => {
    const colors = {
        Pending: 'text-yellow-600 bg-yellow-50',
        Confirmed: 'text-blue-600 bg-blue-50',
        Processing: 'text-indigo-600 bg-indigo-50',
        Packed: 'text-purple-600 bg-purple-50',
        Shipped: 'text-orange-600 bg-orange-50',
        Delivered: 'text-green-600 bg-green-50',
        Cancelled: 'text-red-600 bg-red-50',
    };
    return colors[status] || 'text-gray-600 bg-gray-50';
};

export const getPaymentStatusColor = (status) => {
    const colors = {
        Pending: 'text-yellow-600 bg-yellow-50',
        Completed: 'text-green-600 bg-green-50',
        Failed: 'text-red-600 bg-red-50',
    };
    return colors[status] || 'text-gray-600 bg-gray-50';
};

export const deliverySlots = [
    { value: 'today-morning', label: 'Today 9 AM - 12 PM' },
    { value: 'today-afternoon', label: 'Today 12 PM - 3 PM' },
    { value: 'today-evening', label: 'Today 4 PM - 7 PM' },
    { value: 'tomorrow-morning', label: 'Tomorrow 9 AM - 12 PM' },
    { value: 'tomorrow-afternoon', label: 'Tomorrow 12 PM - 3 PM' },
    { value: 'tomorrow-evening', label: 'Tomorrow 4 PM - 7 PM' },
];

export const paymentMethods = [
    { value: 'Cash on Delivery', label: 'Cash on Delivery', icon: '💵' },
    { value: 'bKash', label: 'bKash', icon: '📱' },
    { value: 'Nagad', label: 'Nagad', icon: '📱' },
    { value: 'Rocket', label: 'Rocket', icon: '🚀' },
    { value: 'Credit/Debit Card', label: 'Credit/Debit Card', icon: '💳' },
];

export const areas = [
    'Dhaka',
    'Chittagong',
    'Sylhet',
    'Rajshahi',
    'Khulna',
    'Barisal',
    'Rangpur',
    'Mymensingh',
    'Gazipur',
    'Narayanganj',
    'Cumilla',
];
