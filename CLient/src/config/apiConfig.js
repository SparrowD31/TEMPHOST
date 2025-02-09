const BASE_URL = import.meta.env.VITE_API_URL; // Using environment variable instead of hardcoded URL

export const makeRequest = async (endpoint, options = {}) => {
    const url = `${BASE_URL}${endpoint}`;
    console.log('Making request to:', url); // Add this for debugging
    
    try {
        const response = await fetch(url, {
            ...options,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        // Log the response status and URL for debugging
        console.log(`Response status: ${response.status} for ${url}`);

        if (!response.ok) {
            // Try to get error message from response if possible
            let errorMessage;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
            } catch {
                errorMessage = `HTTP error! status: ${response.status}`;
            }
            throw new Error(errorMessage);
        }

        // Check if response is empty
        const text = await response.text();
        if (!text) {
            return null;
        }

        // Try to parse JSON
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