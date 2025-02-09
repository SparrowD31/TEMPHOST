const BASE_URL = import.meta.env.VITE_API_URL;

// Validate BASE_URL format and log for debugging
if (!BASE_URL) {
    throw new Error('VITE_API_URL is not set in environment variables');
}

if (BASE_URL.includes('temphost-client.onrender.com')) {
    throw new Error('VITE_API_URL is incorrectly set to the client URL instead of the backend API URL');
}

console.log('API Base URL configured as:', BASE_URL);

// Helper function to ensure endpoint starts with '/'
const formatEndpoint = (endpoint) => {
    return endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
};

export const makeRequest = async (endpoint, options = {}) => {
    const formattedEndpoint = formatEndpoint(endpoint);
    const url = `${BASE_URL}${formattedEndpoint}`;
    
    // Log every request for debugging
    console.log('Making API Request:', {
        url,
        method: options.method || 'GET',
        endpoint: formattedEndpoint
    });

    // Validate URL format
    try {
        new URL(url);
    } catch (e) {
        throw new Error(`Invalid URL formed: ${url}`);
    }

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

        console.log('Response received:', {
            status: response.status,
            ok: response.ok,
            url: response.url
        });

        const text = await response.text();
        console.log('Raw response:', text);

        let data;
        try {
            data = text ? JSON.parse(text) : null;
        } catch (e) {
            console.error('Failed to parse JSON response:', text);
            throw new Error(`Invalid JSON response from server for URL: ${url}`);
        }

        // Handle authentication errors specifically
        if (response.status === 400 || response.status === 401) {
            if (data && data.message) {
                throw new Error(data.message);
            }
        }

        if (!response.ok) {
            throw new Error(data?.message || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('API Request Failed:', {
            url,
            error: error.message,
            endpoint: formattedEndpoint,
            type: error.name,
            stack: error.stack
        });

        // Rethrow the error with the actual message from the server
        throw error;
    }
};