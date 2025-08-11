import React, { useState, useMemo } from 'react';
import BookingCard from './BookingCard';
import BookingFilters from './BookingFilters';
import CancellationModal from './CancellationModal';
import Icon from '../../../components/AppIcon';

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

  // Mock bookings data
  const mockBookings = [
    {
      id: 'BK-2025-001',
      venueName: 'Downtown Sports Complex',
      venueImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      sport: 'Tennis',
      courtName: 'Court A',
      date: '2025-08-15',
      startTime: '14:00',
      endTime: '16:00',
      duration: 2,
      totalAmount: 80,
      status: 'confirmed',
      paymentStatus: 'Paid',
      bookedDate: '2025-08-10',
      amenities: ['Lighting', 'Equipment Rental', 'Parking']
    },
    {
      id: 'BK-2025-002',
      venueName: 'City Basketball Arena',
      venueImage: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop',
      sport: 'Basketball',
      courtName: 'Full Court 1',
      date: '2025-08-12',
      startTime: '18:00',
      endTime: '20:00',
      duration: 2,
      totalAmount: 120,
      status: 'completed',
      paymentStatus: 'Paid',
      bookedDate: '2025-08-08',
      amenities: ['Sound System', 'Scoreboard', 'Locker Room']
    },
    {
      id: 'BK-2025-003',
      venueName: 'Elite Badminton Club',
      venueImage: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop',
      sport: 'Badminton',
      courtName: 'Court 3',
      date: '2025-08-20',
      startTime: '10:00',
      endTime: '11:30',
      duration: 1.5,
      totalAmount: 45,
      status: 'confirmed',
      paymentStatus: 'Paid',
      bookedDate: '2025-08-11',
      amenities: ['Shuttlecocks', 'Racket Rental']
    },
    {
      id: 'BK-2025-004',
      venueName: 'Metro Squash Center',
      venueImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      sport: 'Squash',
      courtName: 'Glass Court 2',
      date: '2025-07-28',
      startTime: '16:00',
      endTime: '17:00',
      duration: 1,
      totalAmount: 35,
      status: 'completed',
      paymentStatus: 'Paid',
      bookedDate: '2025-07-25',
      amenities: ['Ball Rental', 'Towel Service']
    },
    {
      id: 'BK-2025-005',
      venueName: 'Riverside Tennis Club',
      venueImage: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400&h=300&fit=crop',
      sport: 'Tennis',
      courtName: 'Clay Court B',
      date: '2025-08-25',
      startTime: '09:00',
      endTime: '10:30',
      duration: 1.5,
      totalAmount: 60,
      status: 'pending',
      paymentStatus: 'Pending',
      bookedDate: '2025-08-11',
      amenities: ['Ball Machine', 'Coaching Available']
    },
    {
      id: 'BK-2025-006',
      venueName: 'Community Volleyball Court',
      venueImage: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=300&fit=crop',
      sport: 'Volleyball',
      courtName: 'Beach Court 1',
      date: '2025-07-15',
      startTime: '19:00',
      endTime: '21:00',
      duration: 2,
      totalAmount: 90,
      status: 'cancelled',
      paymentStatus: 'Refunded',
      bookedDate: '2025-07-10',
      amenities: ['Net Setup', 'Sand Court', 'Lighting']
    }
  ];

  // Filter and sort bookings
  const filteredBookings = useMemo(() => {
    let filtered = mockBookings?.filter(booking => {
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
  }, [filters]);

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
      {/* Bookings List */}
      {filteredBookings?.length > 0 ? (
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
      ) : (
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