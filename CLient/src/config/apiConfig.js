const BASE_URL = import.meta.env.VITE_API_URL;

// Add validation to ensure BASE_URL is set correctly
if (!BASE_URL) {
    console.error('VITE_API_URL is not set in environment variables');
}

// Log the base URL during initialization (for debugging)
console.log('API Base URL:', BASE_URL);

export const makeRequest = async (endpoint, options = {}) => {
    if (!BASE_URL) {
        throw new Error('API Base URL is not configured');
    }

    const url = `${BASE_URL}${endpoint}`;
    console.log('Making request to:', url);
    
    // ... rest of the makeRequest function remains the same ...
};