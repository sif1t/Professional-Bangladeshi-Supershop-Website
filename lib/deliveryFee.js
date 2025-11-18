// ডেলিভারি ফি ম্যানেজমেন্ট সিস্টেম

// বাংলাদেশের ৮টি বিভাগ
export const divisions = [
    { id: 'dhaka', name: 'ঢাকা বিভাগ', icon: '🏙️' },
    { id: 'chittagong', name: 'চট্টগ্রাম বিভাগ', icon: '🌊' },
    { id: 'rajshahi', name: 'রাজশাহী বিভাগ', icon: '🌾' },
    { id: 'khulna', name: 'খুলনা বিভাগ', icon: '🐟' },
    { id: 'barisal', name: 'বরিশাল বিভাগ', icon: '🌴' },
    { id: 'sylhet', name: 'সিলেট বিভাগ', icon: '🌿' },
    { id: 'rangpur', name: 'রংপুর বিভাগ', icon: '🌱' },
    { id: 'mymensingh', name: 'ময়মনসিংহ বিভাগ', icon: '🌳' },
];

// সকল জেলার তথ্য (৬৪টি জেলা)
export const locationData = [
    // ঢাকা বিভাগ (১৩ জেলা)
    { name: 'ঢাকা', division: 'ঢাকা বিভাগ', divisionId: 'dhaka', icon: '🏙️', popular: true, deliveryTime: '১-২ ঘণ্টা', deliveryFee: 30, freeDeliveryThreshold: 500 },
    { name: 'নারায়ণগঞ্জ', division: 'ঢাকা বিভাগ', divisionId: 'dhaka', icon: '🏘️', popular: true, deliveryTime: '১-২ ঘণ্টা', deliveryFee: 40, freeDeliveryThreshold: 600 },
    { name: 'গাজীপুর', division: 'ঢাকা বিভাগ', divisionId: 'dhaka', icon: '🏭', popular: true, deliveryTime: '১-২ ঘণ্টা', deliveryFee: 40, freeDeliveryThreshold: 600 },
    { name: 'কিশোরগঞ্জ', division: 'ঢাকা বিভাগ', divisionId: 'dhaka', icon: '🌾', popular: false, deliveryTime: '২-৩ ঘণ্টা', deliveryFee: 60, freeDeliveryThreshold: 800 },
    { name: 'নরসিংদী', division: 'ঢাকা বিভাগ', divisionId: 'dhaka', icon: '🌾', popular: false, deliveryTime: '২-৩ ঘণ্টা', deliveryFee: 50, freeDeliveryThreshold: 700 },
    { name: 'টাঙ্গাইল', division: 'ঢাকা বিভাগ', divisionId: 'dhaka', icon: '🌳', popular: false, deliveryTime: '২-৩ ঘণ্টা', deliveryFee: 50, freeDeliveryThreshold: 800 },
    { name: 'মানিকগঞ্জ', division: 'ঢাকা বিভাগ', divisionId: 'dhaka', icon: '🌾', popular: false, deliveryTime: '২-৩ ঘণ্টা', deliveryFee: 50, freeDeliveryThreshold: 700 },
    { name: 'মুন্সিগঞ্জ', division: 'ঢাকা বিভাগ', divisionId: 'dhaka', icon: '🏞️', popular: false, deliveryTime: '১-২ ঘণ্টা', deliveryFee: 45, freeDeliveryThreshold: 650 },
    { name: 'ফরিদপুর', division: 'ঢাকা বিভাগ', divisionId: 'dhaka', icon: '🌾', popular: false, deliveryTime: '৩-৪ ঘণ্টা', deliveryFee: 65, freeDeliveryThreshold: 900 },
    { name: 'গোপালগঞ্জ', division: 'ঢাকা বিভাগ', divisionId: 'dhaka', icon: '🌾', popular: false, deliveryTime: '৩-৪ ঘণ্টা', deliveryFee: 70, freeDeliveryThreshold: 1000 },
    { name: 'রাজবাড়ী', division: 'ঢাকা বিভাগ', divisionId: 'dhaka', icon: '🌾', popular: false, deliveryTime: '৩-৪ ঘণ্টা', deliveryFee: 65, freeDeliveryThreshold: 900 },
    { name: 'মাদারীপুর', division: 'ঢাকা বিভাগ', divisionId: 'dhaka', icon: '🌾', popular: false, deliveryTime: '৩-৪ ঘণ্টা', deliveryFee: 70, freeDeliveryThreshold: 1000 },
    { name: 'শরীয়তপুর', division: 'ঢাকা বিভাগ', divisionId: 'dhaka', icon: '🌾', popular: false, deliveryTime: '৩-৪ ঘণ্টা', deliveryFee: 70, freeDeliveryThreshold: 1000 },

    // চট্টগ্রাম বিভাগ (১১ জেলা)
    { name: 'চট্টগ্রাম', division: 'চট্টগ্রাম বিভাগ', divisionId: 'chittagong', icon: '🌊', popular: true, deliveryTime: '২-৩ ঘণ্টা', deliveryFee: 60, freeDeliveryThreshold: 1000 },
    { name: 'কক্সবাজার', division: 'চট্টগ্রাম বিভাগ', divisionId: 'chittagong', icon: '🏖️', popular: true, deliveryTime: '৪-৫ ঘণ্টা', deliveryFee: 100, freeDeliveryThreshold: 1500 },
    { name: 'ফেনী', division: 'চট্টগ্রাম বিভাগ', divisionId: 'chittagong', icon: '🏞️', popular: false, deliveryTime: '৩-৪ ঘণ্টা', deliveryFee: 70, freeDeliveryThreshold: 1000 },
    { name: 'নোয়াখালী', division: 'চট্টগ্রাম বিভাগ', divisionId: 'chittagong', icon: '🌴', popular: false, deliveryTime: '৩-৪ ঘণ্টা', deliveryFee: 80, freeDeliveryThreshold: 1200 },
    { name: 'লক্ষ্মীপুর', division: 'চট্টগ্রাম বিভাগ', divisionId: 'chittagong', icon: '🌴', popular: false, deliveryTime: '৩-৪ ঘণ্টা', deliveryFee: 80, freeDeliveryThreshold: 1200 },
    { name: 'চাঁদপুর', division: 'চট্টগ্রাম বিভাগ', divisionId: 'chittagong', icon: '🏞️', popular: false, deliveryTime: '৩-৪ ঘণ্টা', deliveryFee: 70, freeDeliveryThreshold: 1000 },
    { name: 'ব্রাহ্মণবাড়িয়া', division: 'চট্টগ্রাম বিভাগ', divisionId: 'chittagong', icon: '🌾', popular: false, deliveryTime: '৩-৪ ঘণ্টা', deliveryFee: 70, freeDeliveryThreshold: 1000 },
    { name: 'কুমিল্লা', division: 'চট্টগ্রাম বিভাগ', divisionId: 'chittagong', icon: '🏞️', popular: false, deliveryTime: '৩-৪ ঘণ্টা', deliveryFee: 70, freeDeliveryThreshold: 1000 },
    { name: 'বান্দরবন', division: 'চট্টগ্রাম বিভাগ', divisionId: 'chittagong', icon: '⛰️', popular: false, deliveryTime: '৫-৬ ঘণ্টা', deliveryFee: 120, freeDeliveryThreshold: 2000 },
    { name: 'রাঙামাটি', division: 'চট্টগ্রাম বিভাগ', divisionId: 'chittagong', icon: '⛰️', popular: false, deliveryTime: '৫-৬ ঘণ্টা', deliveryFee: 120, freeDeliveryThreshold: 2000 },
    { name: 'খাগড়াছড়ি', division: 'চট্টগ্রাম বিভাগ', divisionId: 'chittagong', icon: '⛰️', popular: false, deliveryTime: '৫-৬ ঘণ্টা', deliveryFee: 120, freeDeliveryThreshold: 2000 },

    // রাজশাহী বিভাগ (৮ জেলা)
    { name: 'রাজশাহী', division: 'রাজশাহী বিভাগ', divisionId: 'rajshahi', icon: '🌾', popular: true, deliveryTime: '৩-৪ ঘণ্টা', deliveryFee: 70, freeDeliveryThreshold: 1000 },
    { name: 'নাটোর', division: 'রাজশাহী বিভাগ', divisionId: 'rajshahi', icon: '🌾', popular: false, deliveryTime: '৩-৪ ঘণ্টা', deliveryFee: 75, freeDeliveryThreshold: 1000 },
    { name: 'নওগাঁ', division: 'রাজশাহী বিভাগ', divisionId: 'rajshahi', icon: '🌾', popular: false, deliveryTime: '৪-৫ ঘণ্টা', deliveryFee: 80, freeDeliveryThreshold: 1200 },
    { name: 'চাঁপাইনবাবগঞ্জ', division: 'রাজশাহী বিভাগ', divisionId: 'rajshahi', icon: '🥭', popular: false, deliveryTime: '৪-৫ ঘণ্টা', deliveryFee: 85, freeDeliveryThreshold: 1200 },
    { name: 'পাবনা', division: 'রাজশাহী বিভাগ', divisionId: 'rajshahi', icon: '🌾', popular: false, deliveryTime: '৩-৪ ঘণ্টা', deliveryFee: 70, freeDeliveryThreshold: 1000 },
    { name: 'সিরাজগঞ্জ', division: 'রাজশাহী বিভাগ', divisionId: 'rajshahi', icon: '🌾', popular: false, deliveryTime: '৩-৪ ঘণ্টা', deliveryFee: 70, freeDeliveryThreshold: 1000 },
    { name: 'বগুড়া', division: 'রাজশাহী বিভাগ', divisionId: 'rajshahi', icon: '🌾', popular: false, deliveryTime: '৩-৪ ঘণ্টা', deliveryFee: 75, freeDeliveryThreshold: 1000 },
    { name: 'জয়পুরহাট', division: 'রাজশাহী বিভাগ', divisionId: 'rajshahi', icon: '🌾', popular: false, deliveryTime: '৪-৫ ঘণ্টা', deliveryFee: 80, freeDeliveryThreshold: 1200 },

    // খুলনা বিভাগ (১০ জেলা)
    { name: 'খুলনা', division: 'খুলনা বিভাগ', divisionId: 'khulna', icon: '🐟', popular: false, deliveryTime: '৩-৪ ঘণ্টা', deliveryFee: 75, freeDeliveryThreshold: 1000 },
    { name: 'বাগেরহাট', division: 'খুলনা বিভাগ', divisionId: 'khulna', icon: '🌴', popular: false, deliveryTime: '৪-৫ ঘণ্টা', deliveryFee: 85, freeDeliveryThreshold: 1200 },
    { name: 'সাতক্ষীরা', division: 'খুলনা বিভাগ', divisionId: 'khulna', icon: '🌾', popular: false, deliveryTime: '৪-৫ ঘণ্টা', deliveryFee: 85, freeDeliveryThreshold: 1200 },
    { name: 'যশোর', division: 'খুলনা বিভাগ', divisionId: 'khulna', icon: '🌾', popular: false, deliveryTime: '৩-৪ ঘণ্টা', deliveryFee: 75, freeDeliveryThreshold: 1000 },
    { name: 'ঝিনাইদহ', division: 'খুলনা বিভাগ', divisionId: 'khulna', icon: '🌾', popular: false, deliveryTime: '৩-৪ ঘণ্টা', deliveryFee: 75, freeDeliveryThreshold: 1000 },
    { name: 'মাগুরা', division: 'খুলনা বিভাগ', divisionId: 'khulna', icon: '🌾', popular: false, deliveryTime: '৩-৪ ঘণ্টা', deliveryFee: 75, freeDeliveryThreshold: 1000 },
    { name: 'নড়াইল', division: 'খুলনা বিভাগ', divisionId: 'khulna', icon: '🌾', popular: false, deliveryTime: '৩-৪ ঘণ্টা', deliveryFee: 75, freeDeliveryThreshold: 1000 },
    { name: 'কুষ্টিয়া', division: 'খুলনা বিভাগ', divisionId: 'khulna', icon: '🌾', popular: false, deliveryTime: '৩-৪ ঘণ্টা', deliveryFee: 75, freeDeliveryThreshold: 1000 },
    { name: 'মেহেরপুর', division: 'খুলনা বিভাগ', divisionId: 'khulna', icon: '🌾', popular: false, deliveryTime: '৪-৫ ঘণ্টা', deliveryFee: 80, freeDeliveryThreshold: 1200 },
    { name: 'চুয়াডাঙ্গা', division: 'খুলনা বিভাগ', divisionId: 'khulna', icon: '🌾', popular: false, deliveryTime: '৪-৫ ঘণ্টা', deliveryFee: 80, freeDeliveryThreshold: 1200 },

    // বরিশাল বিভাগ (৬ জেলা)
    { name: 'বরিশাল', division: 'বরিশাল বিভাগ', divisionId: 'barisal', icon: '🌴', popular: false, deliveryTime: '৪-৫ ঘণ্টা', deliveryFee: 90, freeDeliveryThreshold: 1500 },
    { name: 'পটুয়াখালী', division: 'বরিশাল বিভাগ', divisionId: 'barisal', icon: '🌴', popular: false, deliveryTime: '৫-৬ ঘণ্টা', deliveryFee: 100, freeDeliveryThreshold: 1500 },
    { name: 'ভোলা', division: 'বরিশাল বিভাগ', divisionId: 'barisal', icon: '🌴', popular: false, deliveryTime: '৫-৬ ঘণ্টা', deliveryFee: 100, freeDeliveryThreshold: 1500 },
    { name: 'ঝালকাঠি', division: 'বরিশাল বিভাগ', divisionId: 'barisal', icon: '🌴', popular: false, deliveryTime: '৫-৬ ঘণ্টা', deliveryFee: 95, freeDeliveryThreshold: 1500 },
    { name: 'পিরোজপুর', division: 'বরিশাল বিভাগ', divisionId: 'barisal', icon: '🌴', popular: false, deliveryTime: '৫-৬ ঘণ্টা', deliveryFee: 95, freeDeliveryThreshold: 1500 },
    { name: 'বরগুনা', division: 'বরিশাল বিভাগ', divisionId: 'barisal', icon: '🌴', popular: false, deliveryTime: '৫-৬ ঘণ্টা', deliveryFee: 95, freeDeliveryThreshold: 1500 },

    // সিলেট বিভাগ (৪ জেলা)
    { name: 'সিলেট', division: 'সিলেট বিভাগ', divisionId: 'sylhet', icon: '🌿', popular: true, deliveryTime: '৩-৪ ঘণ্টা', deliveryFee: 80, freeDeliveryThreshold: 1200 },
    { name: 'মৌলভীবাজার', division: 'সিলেট বিভাগ', divisionId: 'sylhet', icon: '🍵', popular: false, deliveryTime: '৪-৫ ঘণ্টা', deliveryFee: 90, freeDeliveryThreshold: 1200 },
    { name: 'হবিগঞ্জ', division: 'সিলেট বিভাগ', divisionId: 'sylhet', icon: '🌿', popular: false, deliveryTime: '৪-৫ ঘণ্টা', deliveryFee: 90, freeDeliveryThreshold: 1200 },
    { name: 'সুনামগঞ্জ', division: 'সিলেট বিভাগ', divisionId: 'sylhet', icon: '🌿', popular: false, deliveryTime: '৪-৫ ঘণ্টা', deliveryFee: 90, freeDeliveryThreshold: 1200 },

    // রংপুর বিভাগ (৮ জেলা)
    { name: 'রংপুর', division: 'রংপুর বিভাগ', divisionId: 'rangpur', icon: '🌱', popular: false, deliveryTime: '৪-৫ ঘণ্টা', deliveryFee: 85, freeDeliveryThreshold: 1200 },
    { name: 'দিনাজপুর', division: 'রংপুর বিভাগ', divisionId: 'rangpur', icon: '🌻', popular: false, deliveryTime: '৪-৫ ঘণ্টা', deliveryFee: 90, freeDeliveryThreshold: 1200 },
    { name: 'ঠাকুরগাঁও', division: 'রংপুর বিভাগ', divisionId: 'rangpur', icon: '🌾', popular: false, deliveryTime: '৫-৬ ঘণ্টা', deliveryFee: 95, freeDeliveryThreshold: 1500 },
    { name: 'পঞ্চগড়', division: 'রংপুর বিভাগ', divisionId: 'rangpur', icon: '🌾', popular: false, deliveryTime: '৫-৬ ঘণ্টা', deliveryFee: 95, freeDeliveryThreshold: 1500 },
    { name: 'নীলফামারী', division: 'রংপুর বিভাগ', divisionId: 'rangpur', icon: '🌾', popular: false, deliveryTime: '৫-৬ ঘণ্টা', deliveryFee: 95, freeDeliveryThreshold: 1500 },
    { name: 'লালমনিরহাট', division: 'রংপুর বিভাগ', divisionId: 'rangpur', icon: '🌾', popular: false, deliveryTime: '৫-৬ ঘণ্টা', deliveryFee: 95, freeDeliveryThreshold: 1500 },
    { name: 'কুড়িগ্রাম', division: 'রংপুর বিভাগ', divisionId: 'rangpur', icon: '🌾', popular: false, deliveryTime: '৫-৬ ঘণ্টা', deliveryFee: 95, freeDeliveryThreshold: 1500 },
    { name: 'গাইবান্ধা', division: 'রংপুর বিভাগ', divisionId: 'rangpur', icon: '🌾', popular: false, deliveryTime: '৪-৫ ঘণ্টা', deliveryFee: 90, freeDeliveryThreshold: 1200 },

    // ময়মনসিংহ বিভাগ (৪ জেলা)
    { name: 'ময়মনসিংহ', division: 'ময়মনসিংহ বিভাগ', divisionId: 'mymensingh', icon: '🌳', popular: false, deliveryTime: '২-৩ ঘণ্টা', deliveryFee: 50, freeDeliveryThreshold: 800 },
    { name: 'নেত্রকোণা', division: 'ময়মনসিংহ বিভাগ', divisionId: 'mymensingh', icon: '🌳', popular: false, deliveryTime: '৩-৪ ঘণ্টা', deliveryFee: 70, freeDeliveryThreshold: 1000 },
    { name: 'শেরপুর', division: 'ময়মনসিংহ বিভাগ', divisionId: 'mymensingh', icon: '🌳', popular: false, deliveryTime: '৩-৪ ঘণ্টা', deliveryFee: 70, freeDeliveryThreshold: 1000 },
    { name: 'জামালপুর', division: 'ময়মনসিংহ বিভাগ', divisionId: 'mymensingh', icon: '🌳', popular: false, deliveryTime: '৩-৪ ঘণ্টা', deliveryFee: 70, freeDeliveryThreshold: 1000 },
];

/**
 * বিভাগ অনুযায়ী জেলাসমূহ পেতে
 * @param {string} divisionId - বিভাগের আইডি
 * @returns {array} জেলার তালিকা
 */
export const getDistrictsByDivision = (divisionId) => {
    return locationData.filter(loc => loc.divisionId === divisionId);
};

/**
 * জনপ্রিয় জেলাসমূহ পেতে
 * @returns {array} জনপ্রিয় জেলার তালিকা
 */
export const getPopularDistricts = () => {
    return locationData.filter(loc => loc.popular);
};

/**
 * নাম দিয়ে জেলার তথ্য পেতে
 * @param {string} locationName - জেলার নাম
 * @returns {object} জেলার তথ্য
 */
export const getLocationData = (locationName) => {
    const location = locationData.find(loc => loc.name === locationName);
    return location || locationData[0]; // ডিফল্ট ঢাকা
};

/**
 * Get delivery fee for a location
 * @param {string} locationName - Name of the location
 * @returns {number} Delivery fee in BDT
 */
export const getDeliveryFee = (locationName) => {
    const location = getLocationData(locationName);
    return location.deliveryFee;
};

/**
 * Get free delivery threshold for a location
 * @param {string} locationName - Name of the location
 * @returns {number} Threshold amount in BDT
 */
export const getFreeDeliveryThreshold = (locationName) => {
    const location = getLocationData(locationName);
    return location.freeDeliveryThreshold;
};

/**
 * Calculate delivery fee based on cart total
 * @param {number} cartTotal - Total cart amount
 * @param {string} locationName - Name of the location
 * @returns {object} { deliveryFee, isFreeDelivery, amountForFreeDelivery }
 */
export const calculateDeliveryFee = (cartTotal, locationName) => {
    const location = getLocationData(locationName);
    const isFreeDelivery = cartTotal >= location.freeDeliveryThreshold;
    const deliveryFee = isFreeDelivery ? 0 : location.deliveryFee;
    const amountForFreeDelivery = isFreeDelivery ? 0 : location.freeDeliveryThreshold - cartTotal;

    return {
        deliveryFee,
        isFreeDelivery,
        amountForFreeDelivery,
        location: location.name,
        deliveryTime: location.deliveryTime,
        threshold: location.freeDeliveryThreshold,
    };
};

/**
 * বর্তমান নির্বাচিত এলাকা পেতে
 * @returns {string} এলাকার নাম
 */
export const getCurrentLocation = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('selectedArea') || 'ঢাকা';
    }
    return 'ঢাকা';
};

/**
 * বর্তমান এলাকা সেট করতে
 * @param {string} locationName - এলাকার নাম
 */
export const setCurrentLocation = (locationName) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('selectedArea', locationName);
    }
};

/**
 * Calculate grand total with delivery fee
 * @param {number} subtotal - Subtotal amount
 * @param {string} locationName - Name of the location (optional, uses current location if not provided)
 * @returns {object} { subtotal, deliveryFee, total, isFreeDelivery, location }
 */
export const calculateGrandTotal = (subtotal, locationName = null) => {
    const location = locationName || getCurrentLocation();
    const deliveryInfo = calculateDeliveryFee(subtotal, location);

    return {
        subtotal,
        deliveryFee: deliveryInfo.deliveryFee,
        total: subtotal + deliveryInfo.deliveryFee,
        isFreeDelivery: deliveryInfo.isFreeDelivery,
        amountForFreeDelivery: deliveryInfo.amountForFreeDelivery,
        location: deliveryInfo.location,
        deliveryTime: deliveryInfo.deliveryTime,
        threshold: deliveryInfo.threshold,
    };
};

/**
 * Format currency in BDT
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
    return `৳${amount.toLocaleString('en-BD')}`;
};

/**
 * Get delivery fee message for a location
 * @param {string} locationName - Name of the location
 * @returns {string} Delivery fee message
 */
export const getDeliveryMessage = (locationName) => {
    const location = getLocationData(locationName);
    return `Delivery: ৳${location.deliveryFee} (Free on orders over ৳${location.freeDeliveryThreshold})`;
};

/**
 * Check if free delivery is available for cart total
 * @param {number} cartTotal - Total cart amount
 * @param {string} locationName - Name of the location
 * @returns {boolean} True if free delivery is available
 */
export const isFreeDeliveryAvailable = (cartTotal, locationName) => {
    const location = getLocationData(locationName);
    return cartTotal >= location.freeDeliveryThreshold;
};
