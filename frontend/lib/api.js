// API Configuration Helper
// This ensures the frontend connects to the correct backend in all environments

/**
 * Get the base API URL based on the environment
 * @returns {string} The API base URL
 */
export const getApiUrl = () => {
    // Check if we're on the client side
    if (typeof window !== 'undefined') {
        // Use environment variable if available
        return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    }
    // Server-side
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
};

/**
 * Create fetch options with authentication
 * @param {string} method - HTTP method
 * @param {object} body - Request body (optional)
 * @returns {object} Fetch options
 */
export const fetchOptions = (method = 'GET', body = null) => {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // Add authorization token if available
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            options.headers.Authorization = `Bearer ${token}`;
        }
    }

    // Add body if provided
    if (body) {
        options.body = JSON.stringify(body);
    }

    return options;
};

/**
 * Make an authenticated API request
 * @param {string} endpoint - API endpoint (e.g., '/orders', '/products/123')
 * @param {object} options - Fetch options
 * @returns {Promise} API response
 */
export const apiRequest = async (endpoint, options = {}) => {
    const baseUrl = getApiUrl();
    const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;

    // Merge default options with provided options
    const defaultOptions = fetchOptions(options.method || 'GET', options.body);
    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, mergedOptions);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
};

// Export the base URL for direct fetch calls
export const API_URL = getApiUrl();
