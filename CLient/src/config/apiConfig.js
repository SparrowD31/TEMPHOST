const BASE_URL = import.meta.env.VITE_API_URL; // Using environment variable instead of hardcoded URL

export const makeRequest = async (endpoint, options = {}) => {
    const url = `${BASE_URL}${endpoint}`;
    console.log('Making request to:', url, 'with options:', {
        method: options.method,
        headers: options.headers,
        credentials: options.credentials
    });
    
    try {
        const response = await fetch(url, {
            ...options,
            credentials: 'include', // Ensures cookies are sent with requests
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...options.headers,
            },
        });

        console.log(`Response received:`, {
            status: response.status,
            statusText: response.statusText,
            url: response.url
        });

        if (!response.ok) {
            let errorMessage;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
            } catch {
                errorMessage = `HTTP error! status: ${response.status} - ${response.statusText}`;
            }
            console.error('Request failed:', errorMessage);
            throw new Error(errorMessage);
        }

        const text = await response.text();
        console.log('Response text:', text.substring(0, 200)); // Log first 200 chars of response

        if (!text) {
            console.log('Empty response received');
            return null;
        }

        try {
            return JSON.parse(text);
        } catch (e) {
            console.error('Failed to parse JSON response:', text);
            throw new Error('Invalid JSON response from server');
        }
    } catch (error) {
        console.error(`API Request Error for ${url}:`, error);
        throw error;
    }
}; 