'use client';
import React from 'react';
import { AuthProvider } from './AuthContext';
import { BookingProvider } from './BookingContext';
import { NotificationProvider } from './NotificationContext';

export const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <BookingProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </BookingProvider>
    </AuthProvider>
  );
};

export { useAuth } from './AuthContext';
export { useBookings } from './BookingContext';
export { useNotifications } from './NotificationContext';