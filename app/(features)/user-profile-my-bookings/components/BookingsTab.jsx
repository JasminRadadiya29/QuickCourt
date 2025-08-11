import React, { useEffect, useMemo, useState } from 'react';
import BookingCard from './BookingCard';
import BookingFilters from './BookingFilters';
import CancellationModal from './CancellationModal';
import Icon from 'app/components/AppIcon';
import Button from 'app/components/ui/Button';
import { apiFetch, getCurrentUser } from '@/lib/apiClient';

const BookingsTab = () => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    sport: '',
    dateRange: '',
    sortBy: 'date-desc'
  });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCancellationModal, setShowCancellationModal] = useState(false);

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      setLoading(false);
      setError('User not logged in');
      return;
    }
    
    let cancelled = false;
    
    async function load() {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching bookings for user ID:', user.id);
        
        const res = await apiFetch(`/api/bookings?userId=${user.id}`);
        console.log('Bookings API response:', res);
        
        if (!cancelled) {
          if (Array.isArray(res)) {
            setBookings(res.map((b) => ({
              id: b._id,
              venueName: b.venue?.name || 'Unknown Venue',
              venueImage: '/assets/images/no_image.png',
              sport: b.venue?.sport || '',
              courtName: b.court?.name || 'Unknown Court',
              date: b.date,
              startTime: b.startHour,
              endTime: b.endHour,
              duration: 1,
              totalAmount: b.totalPrice,
              status: b.status,
              paymentStatus: b.status === 'cancelled' ? 'Refunded' : 'Paid',
              bookedDate: b.createdAt,
              amenities: []
            })));
          } else {
            console.error('Invalid bookings response format:', res);
            setError('Failed to load bookings data');
            setBookings([]);
          }
        }
      } catch (err) {
        console.error('Error loading bookings:', err);
        if (!cancelled) {
          setError('Failed to load bookings');
          setBookings([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    
    load();
    return () => { cancelled = true; };
  }, []);

  // Filter and sort bookings
  const filteredBookings = useMemo(() => {
    let filtered = bookings?.filter(booking => {
      // Search filter
      if (filters?.search && !booking?.venueName?.toLowerCase()?.includes(filters?.search?.toLowerCase())) {
        return false;
      }
      
      // Status filter
      if (filters?.status && booking?.status !== filters?.status) {
        return false;
      }
      
      // Sport filter
      if (filters?.sport && booking?.sport?.toLowerCase() !== filters?.sport?.toLowerCase()) {
        return false;
      }
      
      // Date range filter
      if (filters?.dateRange) {
        const bookingDate = new Date(booking.date);
        const now = new Date();
        
        switch (filters?.dateRange) {
          case 'today':
            if (bookingDate?.toDateString() !== now?.toDateString()) return false;
            break;
          case 'this-week':
            const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
            const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6));
            if (bookingDate < weekStart || bookingDate > weekEnd) return false;
            break;
          case 'this-month':
            if (bookingDate?.getMonth() !== now?.getMonth() || bookingDate?.getFullYear() !== now?.getFullYear()) return false;
            break;
          case 'last-month':
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
            if (bookingDate?.getMonth() !== lastMonth?.getMonth() || bookingDate?.getFullYear() !== lastMonth?.getFullYear()) return false;
            break;
          case 'last-3-months':
            const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3);
            if (bookingDate < threeMonthsAgo) return false;
            break;
        }
      }
      
      return true;
    });

    // Sort bookings
    filtered?.sort((a, b) => {
      switch (filters?.sortBy) {
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'date-desc':
          return new Date(b.date) - new Date(a.date);
        case 'venue-asc':
          return a?.venueName?.localeCompare(b?.venueName);
        case 'venue-desc':
          return b?.venueName?.localeCompare(a?.venueName);
        case 'amount-asc':
          return a?.totalAmount - b?.totalAmount;
        case 'amount-desc':
          return b?.totalAmount - a?.totalAmount;
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

    return filtered;
  }, [filters, bookings]);

  const handleCancel = (booking) => {
    setSelectedBooking(booking);
    setShowCancellationModal(true);
  };

  const handleConfirmCancellation = (bookingId, reason) => {
    console.log('Cancelling booking:', bookingId, 'Reason:', reason);
    // Update booking status in real app
    setShowCancellationModal(false);
    setSelectedBooking(null);
  };

  const handleModify = (booking) => {
    console.log('Modifying booking:', booking?.id);
    // Navigate to modification page
  };

  const handleRebook = (booking) => {
    console.log('Rebooking:', booking?.id);
    // Navigate to booking page with pre-filled data
  };

  const handleReview = (booking) => {
    console.log('Reviewing:', booking?.id);
    // Open review modal or navigate to review page
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <BookingFilters
        onFilterChange={setFilters}
        totalResults={filteredBookings?.length}
      />
      
      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Icon name="Loader" size={32} className="text-muted-foreground animate-spin" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">Loading your bookings...</h3>
        </div>
      )}
      
      {/* Error State */}
      {!loading && error && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="AlertTriangle" size={32} className="text-error" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">Something went wrong</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline" size="sm">
            <Icon name="RefreshCw" size={16} className="mr-2" />
            Try Again
          </Button>
        </div>
      )}
      
      {/* Bookings List */}
      {!loading && !error && filteredBookings?.length > 0 && (
        <div className="space-y-4">
          {filteredBookings?.map(booking => (
            <BookingCard
              key={booking?.id}
              booking={booking}
              onCancel={handleCancel}
              onModify={handleModify}
              onRebook={handleRebook}
              onReview={handleReview}
            />
          ))}
        </div>
      )}
      
      {/* Empty State */}
      {!loading && !error && filteredBookings?.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Calendar" size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No bookings found</h3>
          <p className="text-muted-foreground mb-4">
            {filters?.search || filters?.status || filters?.sport || filters?.dateRange
              ? 'Try adjusting your filters to see more results.' :'You haven\'t made any bookings yet. Start by exploring our venues!'
            }
          </p>
        </div>
      )}
      {/* Cancellation Modal */}
      <CancellationModal
        booking={selectedBooking}
        isOpen={showCancellationModal}
        onClose={() => {
          setShowCancellationModal(false);
          setSelectedBooking(null);
        }}
        onConfirm={handleConfirmCancellation}
      />
    </div>
  );
};

export default BookingsTab;