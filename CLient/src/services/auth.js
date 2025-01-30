import { createAsyncThunk } from '@reduxjs/toolkit';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    // Store user data and token
    sessionStorage.setItem('authToken', data.token);
    sessionStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Add utility functions for authentication
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('userData');
  return userStr ? JSON.parse(userStr) : null;
};

export const getToken = () => {
  return sessionStorage.getItem('authToken');
};

export const logout = () => {
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('user');
};

// Function to check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

// Function to get authenticated user data
export const getAuthenticatedUser = async () => {
  try {
    const response = await fetch(`${baseUrl}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user data');
    }

    return await response.json();
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
}; 