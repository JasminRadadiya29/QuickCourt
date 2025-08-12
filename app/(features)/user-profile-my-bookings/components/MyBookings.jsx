'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch, getCurrentUser } from '@/lib/apiClient';
import Button from 'app/components/ui/Button';
import Icon from 'app/components/AppIcon';

const BookingStatus = ({ status }) => {
  const statusConfig = {
    confirmed: { color: 'bg-success/10 text-success', icon: 'CheckCircle' },
    cancelled: { color: 'bg-error/10 text-error', icon: 'XCircle' },
    completed: { color: 'bg-muted-foreground/10 text-muted-foreground', icon: 'CheckSquare' }
  };

  const config = statusConfig[status] || statusConfig.confirmed;

  return (
    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full ${config.color}`}>
      <Icon name={config.icon} size={14} />
      <span className="text-xs capitalize">{status}</span>
    </div>
  );
};

const BookingCard = ({ booking, onCancelBooking }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const isUpcoming = () => {
    const bookingDate = new Date(`${booking.date}T${booking.startHour}`);
    return bookingDate > new Date() && booking.status === 'confirmed';
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-soft">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium text-foreground">{booking.venue.name}</h3>
            <p className="text-sm text-muted-foreground">{booking.court.name}</p>
          </div>
          <BookingStatus status={booking.status} />
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <Icon name="Calendar" size={16} className="text-muted-foreground mr-2" />
            <span>{formatDate(booking.date)}</span>
          </div>
          
          <div className="flex items-center">
            <Icon name="Clock" size={16} className="text-muted-foreground mr-2" />
            <span>{formatTime(booking.startHour)} - {formatTime(booking.endHour)}</span>
          </div>
          
          <div className="flex items-center">
            <Icon name="CreditCard" size={16} className="text-muted-foreground mr-2" />
            <span>{booking.totalPrice}</span>
          </div>
        </div>
      </div>
      
      {isUpcoming() && (
        <div className="px-4 py-3 bg-background border-t border-border">
          <Button 
            variant="outline" 
            size="sm" 
            fullWidth 
            onClick={() => onCancelBooking(booking._id)}
            iconName="X"
            iconPosition="left"
          >
            Cancel Booking
          </Button>
        </div>
      )}
    </div>
  );
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await apiFetch('/api/bookings/my');
      setBookings(data.bookings || []);
    } catch (err) {
      setError('Failed to load bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    
    try {
      setCancellingId(bookingId);
      
      await apiFetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'PATCH'
      });
      
      // Refresh bookings after cancellation
      fetchBookings();
    } catch (err) {
      setError(err.error || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  // Filter bookings into upcoming and past
  const { upcoming, past } = bookings.reduce(
    (acc, booking) => {
      const bookingDate = new Date(`${booking.date}T${booking.startHour}`);
      const isUpcoming = bookingDate > new Date();
      
      if (isUpcoming && booking.status === 'confirmed') {
        acc.upcoming.push(booking);
      } else {
        acc.past.push(booking);
      }
      
      return acc;
    },
    { upcoming: [], past: [] }
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-error/10 border border-error/20 rounded-md text-error">
        {error}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center p-8">
        <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No Bookings Found</h3>
        <p className="text-muted-foreground mb-4">You haven't made any bookings yet.</p>
        <Button href="/venues" variant="default">
          Explore Venues
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {upcoming.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Upcoming Bookings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onCancelBooking={handleCancelBooking}
              />
            ))}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Past Bookings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {past.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onCancelBooking={handleCancelBooking}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;