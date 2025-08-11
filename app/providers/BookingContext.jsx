'use client';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiFetch } from '@/lib/apiClient';
import { useAuth } from './';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [activeBooking, setActiveBooking] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchActiveBooking();
      fetchRecentBookings();
    } else {
      setActiveBooking(null);
      setRecentBookings([]);
    }
  }, [isAuthenticated, user]);

  const fetchActiveBooking = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/api/bookings/active');
      setActiveBooking(data);
    } catch (error) {
      console.error('Failed to fetch active booking:', error);
      setActiveBooking(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentBookings = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/api/bookings/recent');
      setRecentBookings(data);
    } catch (error) {
      console.error('Failed to fetch recent bookings:', error);
      setRecentBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const createBooking = async (bookingData) => {
    try {
      const response = await apiFetch('/api/bookings', {
        method: 'POST',
        body: bookingData
      });
      
      // Refresh bookings after creating a new one
      fetchActiveBooking();
      fetchRecentBookings();
      
      return { success: true, booking: response };
    } catch (error) {
      console.error('Booking creation error:', error);
      return { success: false, error: error?.error || 'Failed to create booking' };
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      await apiFetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST'
      });
      
      // Refresh bookings after cancellation
      fetchActiveBooking();
      fetchRecentBookings();
      
      return { success: true };
    } catch (error) {
      console.error('Booking cancellation error:', error);
      return { success: false, error: error?.error || 'Failed to cancel booking' };
    }
  };

  return (
    <BookingContext.Provider
      value={{
        activeBooking,
        recentBookings,
        loading,
        createBooking,
        cancelBooking,
        refreshBookings: () => {
          fetchActiveBooking();
          fetchRecentBookings();
        }
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};