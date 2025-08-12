'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/apiClient';
import Button from 'app/components/ui/Button';
import Icon from 'app/components/AppIcon';

const BookingStatus = ({ status, onStatusChange, bookingId }) => {
  const statusConfig = {
    confirmed: { color: 'bg-success/10 text-success', icon: 'CheckCircle' },
    cancelled: { color: 'bg-error/10 text-error', icon: 'XCircle' },
    completed: { color: 'bg-muted-foreground/10 text-muted-foreground', icon: 'CheckSquare' },
    pending: { color: 'bg-warning/10 text-warning', icon: 'Clock' }
  };

  const config = statusConfig[status] || statusConfig.pending;

  const handleStatusChange = (e) => {
    if (onStatusChange) {
      onStatusChange(bookingId, e.target.value);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full ${config.color}`}>
        <Icon name={config.icon} size={14} />
        <span className="text-xs capitalize">{status}</span>
      </div>
      <select 
        className="text-xs border border-border rounded-md p-1 bg-background"
        value={status}
        onChange={handleStatusChange}
      >
        <option value="confirmed">Confirm</option>
        <option value="cancelled">Cancel</option>
        <option value="completed">Complete</option>
      </select>
    </div>
  );
};

const BookingCard = ({ booking, onStatusChange }) => {
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

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-soft">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium text-foreground">{booking.venue.name}</h3>
            <p className="text-sm text-muted-foreground">{booking.court.name}</p>
          </div>
          <BookingStatus 
            status={booking.status} 
            onStatusChange={onStatusChange}
            bookingId={booking._id}
          />
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <Icon name="User" size={16} className="text-muted-foreground mr-2" />
            <span>{booking.user.name || booking.user.email}</span>
          </div>
          
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
            <span>₹{booking.totalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, upcoming, past
  const [statusFilter, setStatusFilter] = useState('all'); // all, confirmed, cancelled, completed
  const [venueFilter, setVenueFilter] = useState('all');
  const [venues, setVenues] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchVenues();
    fetchBookings();
  }, [page, statusFilter, venueFilter]);

  const fetchVenues = async () => {
    try {
      const response = await apiFetch('/api/facilities');
      setVenues(response.data || []);
    } catch (err) {
      console.error('Failed to load venues:', err);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let url = `/api/admin/bookings?page=${page}`;
      if (statusFilter !== 'all') url += `&status=${statusFilter}`;
      if (venueFilter !== 'all') url += `&venue=${venueFilter}`;
      
      const data = await apiFetch(url);
      setBookings(data.bookings || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError('Failed to load bookings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setUpdatingStatus(true);
      
      // Use the dedicated status endpoint instead of the deprecated one
      await apiFetch(`/api/admin/bookings/${bookingId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: newStatus
        })
      });
      
      // Update local state
      setBookings(bookings.map(booking => 
        booking._id === bookingId ? { ...booking, status: newStatus } : booking
      ));
    } catch (err) {
      setError('Failed to update booking status');
      console.error(err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Filter bookings based on time (upcoming/past)
  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    
    const bookingDate = new Date(`${booking.date}T${booking.startHour}`);
    const isPast = bookingDate < new Date();
    
    return (filter === 'upcoming' && !isPast) || (filter === 'past' && isPast);
  });

  if (loading && page === 1) {
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

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Time</label>
          <div className="flex bg-muted rounded-md p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm rounded-md ${filter === 'all' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-3 py-1 text-sm rounded-md ${filter === 'upcoming' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`px-3 py-1 text-sm rounded-md ${filter === 'past' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}
            >
              Past
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bg-muted border border-border rounded-md px-3 py-1 text-sm"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Venue</label>
          <select
            value={venueFilter}
            onChange={(e) => {
              setVenueFilter(e.target.value);
              setPage(1);
            }}
            className="bg-muted border border-border rounded-md px-3 py-1 text-sm"
          >
            <option value="all">All Venues</option>
            {venues.map(venue => (
              <option key={venue._id} value={venue._id}>{venue.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1 || loading}
                >
                  <Icon name="ChevronLeft" size={16} />
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                  <Button
                    key={pageNum}
                    variant={pageNum === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPage(pageNum)}
                    disabled={loading}
                  >
                    {pageNum}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages || loading}
                >
                  <Icon name="ChevronRight" size={16} />
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center p-8">
          <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Bookings Found</h3>
          <p className="text-muted-foreground mb-4">
            {filter === 'all' && statusFilter === 'all' && venueFilter === 'all'
              ? 'There are no bookings in the system yet.'
              : 'No bookings match your current filters.'}
          </p>
          {(filter !== 'all' || statusFilter !== 'all' || venueFilter !== 'all') && (
            <Button 
              variant="outline" 
              onClick={() => {
                setFilter('all');
                setStatusFilter('all');
                setVenueFilter('all');
                setPage(1);
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminBookings;