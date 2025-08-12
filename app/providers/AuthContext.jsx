'use client';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAuthToken, getCurrentUser, apiFetch } from '@/lib/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = getAuthToken();
        console.log('Auth token:', token ? 'exists' : 'not found');
        
        if (token) {
          const userData = getCurrentUser();
          console.log('User data from localStorage:', userData);
          
          if (userData) {
            console.log('Setting user from localStorage:', userData);
            console.log('User ID type:', typeof userData.id, 'Value:', userData.id);
            console.log('User _id type:', typeof userData._id, 'Value:', userData._id);
            
            // Ensure user has _id property
            if (userData.id && !userData._id) {
              userData._id = userData.id;
              console.log('Added _id property to user object:', userData);
              localStorage.setItem('user', JSON.stringify(userData));
            }
            
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // Token exists but no user data, try to fetch user data
            try {
              console.log('Fetching user data from API...');
              const userData = await apiFetch('/api/auth/me');
              console.log('User data from API:', userData);
              
              if (userData) {
                // Ensure user has _id property
                if (userData.id && !userData._id) {
                  userData._id = userData.id;
                  console.log('Added _id property to user object:', userData);
                }
                
                setUser(userData);
                setIsAuthenticated(true);
                // Store user data in localStorage
                localStorage.setItem('user', JSON.stringify(userData));
              }
            } catch (error) {
              console.error('Failed to fetch user data:', error);
              logout();
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: { email, password },
        auth: false
      });

      const { token, user } = response;
      console.log('Login response:', { token: token ? 'exists' : 'not found', user });
      
      if (token && user) {
        // Ensure user has _id property
        if (user.id && !user._id) {
          user._id = user.id;
          console.log('Added _id property to user object:', user);
        }
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        setIsAuthenticated(true);
        return { success: true, user };
      }
      
      return { success: false, error: 'Invalid response from server' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error?.error || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: userData,
        auth: false
      });
      
      return { success: true, data: response };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error?.error || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    
    // Redirect to home-dashboard page after logout
    window.location.href = '/home-dashboard';
  };

  const updateUserProfile = async (profileData) => {
    try {
      const updatedUser = await apiFetch('/api/users/profile', {
        method: 'PUT',
        body: profileData
      });
      
      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return { success: true, user: updatedUser };
      }
      
      return { success: false, error: 'Failed to update profile' };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: error?.error || 'Profile update failed' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};