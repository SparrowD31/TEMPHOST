const API_URL = import.meta.env.VITE_API_URL;

export const makeRequest = async (endpoint, options = {}) => {
  try {
    const token = sessionStorage.getItem('authToken');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Example usage in your components:
export const userApi = {
  getUser: (userId) => makeRequest(`/api/users/${userId}`),
  updateUser: (userId, data) => makeRequest(`/api/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
};

export const orderApi = {
  getOrders: (userId) => makeRequest(`/api/orders?userId=${userId}`),
  createOrder: (orderData) => makeRequest('/api/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  }),
};

export const returnApi = {
  createReturn: (returnData) => makeRequest('/api/returns', {
    method: 'POST',
    body: JSON.stringify(returnData)
  }),
  getReturns: () => makeRequest('/api/admin/returns'),
};
