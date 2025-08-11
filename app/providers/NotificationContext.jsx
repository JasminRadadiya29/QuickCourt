'use client';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiFetch } from '@/lib/apiClient';
import { useAuth } from './';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    } else {
      setNotifications([]);
    }
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/api/notifications');
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const dismissNotification = async (id) => {
    try {
      await apiFetch(`/api/notifications/${id}/dismiss`, {
        method: 'POST'
      });
      
      // Remove from local state
      setNotifications(prev => prev.filter(notification => notification.id !== id));
      
      return { success: true };
    } catch (error) {
      console.error('Notification dismissal error:', error);
      return { success: false, error: error?.error || 'Failed to dismiss notification' };
    }
  };

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    
    // Auto-dismiss after 5 seconds if autoHide is true
    if (notification.autoHide) {
      setTimeout(() => {
        dismissNotification(notification.id);
      }, 5000);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loading,
        dismissNotification,
        addNotification,
        refreshNotifications: fetchNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};