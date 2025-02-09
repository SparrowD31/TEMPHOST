const BASE_URL = import.meta.env.VITE_API_URL;

// Validate BASE_URL format and log for debugging
if (!BASE_URL) {
    throw new Error('VITE_API_URL is not set in environment variables');
}

if (BASE_URL.includes('temphost-client.onrender.com')) {
    throw new Error('VITE_API_URL is incorrectly set to the client URL instead of the backend API URL');
}

console.log('API Base URL configured as:', BASE_URL);

export const makeRequest = async (endpoint, options = {}) => {
    const url = `${BASE_URL}${endpoint}`;
    
    // Log every request for debugging
    console.log('API Request:', {
        url,
        method: options.method || 'GET',
        endpoint
    });

    try {
        const response = await fetch(url, {
            ...options,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} for URL: ${url}`);
        }

        const text = await response.text();
        
        if (!text) {
            return null;
        }

        try {
            return JSON.parse(text);
        } catch (e) {
            console.error('Failed to parse JSON response:', text);
            throw new Error(`Invalid JSON response from server for URL: ${url}`);
        }
    } catch (error) {
        console.error(`API Request Failed:`, {
            url,
            error: error.message,
            endpoint
        });
        throw error;
    }
};