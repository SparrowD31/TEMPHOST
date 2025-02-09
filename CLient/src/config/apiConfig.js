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

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`API Request Error for ${url}:`, error);
        throw error;
    }
}; 