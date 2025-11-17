// Delivery Fee Management System

// Location data with delivery fees
export const locationData = [
    { name: 'Dhaka', division: 'Dhaka Division', icon: '🏙️', popular: true, deliveryTime: '1-2 hours', deliveryFee: 30, freeDeliveryThreshold: 500 },
    { name: 'Chittagong', division: 'Chittagong Division', icon: '🌊', popular: true, deliveryTime: '2-3 hours', deliveryFee: 60, freeDeliveryThreshold: 1000 },
    { name: 'Sylhet', division: 'Sylhet Division', icon: '🌿', popular: true, deliveryTime: '3-4 hours', deliveryFee: 80, freeDeliveryThreshold: 1200 },
    { name: 'Rajshahi', division: 'Rajshahi Division', icon: '🌾', popular: true, deliveryTime: '3-4 hours', deliveryFee: 70, freeDeliveryThreshold: 1000 },
    { name: 'Khulna', division: 'Khulna Division', icon: '🐟', popular: false, deliveryTime: '3-4 hours', deliveryFee: 75, freeDeliveryThreshold: 1000 },
    { name: 'Barisal', division: 'Barisal Division', icon: '🌴', popular: false, deliveryTime: '4-5 hours', deliveryFee: 90, freeDeliveryThreshold: 1500 },
    { name: 'Rangpur', division: 'Rangpur Division', icon: '🌱', popular: false, deliveryTime: '4-5 hours', deliveryFee: 85, freeDeliveryThreshold: 1200 },
    { name: 'Mymensingh', division: 'Mymensingh Division', icon: '🌳', popular: false, deliveryTime: '2-3 hours', deliveryFee: 50, freeDeliveryThreshold: 800 },
    { name: 'Gazipur', division: 'Dhaka Division', icon: '🏭', popular: true, deliveryTime: '1-2 hours', deliveryFee: 40, freeDeliveryThreshold: 600 },
    { name: 'Narayanganj', division: 'Dhaka Division', icon: '🏘️', popular: true, deliveryTime: '1-2 hours', deliveryFee: 40, freeDeliveryThreshold: 600 },
    { name: 'Cumilla', division: 'Chittagong Division', icon: '🏞️', popular: false, deliveryTime: '3-4 hours', deliveryFee: 70, freeDeliveryThreshold: 1000 },
    { name: 'Cox\'s Bazar', division: 'Chittagong Division', icon: '🏖️', popular: true, deliveryTime: '4-5 hours', deliveryFee: 100, freeDeliveryThreshold: 1500 },
    { name: 'Jessore', division: 'Khulna Division', icon: '🌾', popular: false, deliveryTime: '3-4 hours', deliveryFee: 75, freeDeliveryThreshold: 1000 },
    { name: 'Bogra', division: 'Rajshahi Division', icon: '🌾', popular: false, deliveryTime: '3-4 hours', deliveryFee: 75, freeDeliveryThreshold: 1000 },
    { name: 'Dinajpur', division: 'Rangpur Division', icon: '🌻', popular: false, deliveryTime: '4-5 hours', deliveryFee: 90, freeDeliveryThreshold: 1200 },
    { name: 'Pabna', division: 'Rajshahi Division', icon: '🌾', popular: false, deliveryTime: '3-4 hours', deliveryFee: 70, freeDeliveryThreshold: 1000 },
    { name: 'Tangail', division: 'Dhaka Division', icon: '🌳', popular: false, deliveryTime: '2-3 hours', deliveryFee: 50, freeDeliveryThreshold: 800 },
];

/**
 * Get location data by name
 * @param {string} locationName - Name of the location
 * @returns {object} Location data object
 */
export const getLocationData = (locationName) => {
    const location = locationData.find(loc => loc.name === locationName);
    return location || locationData[0]; // Default to Dhaka if not found
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
 * Get current selected location from localStorage
 * @returns {string} Location name
 */
export const getCurrentLocation = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('selectedArea') || 'Dhaka';
    }
    return 'Dhaka';
};

/**
 * Set current location to localStorage
 * @param {string} locationName - Name of the location
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
