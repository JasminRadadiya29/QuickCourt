import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from 'app/components/ui/Button';
import Icon from 'app/components/AppIcon';
import Image from 'app/components/AppImage';
import { apiFetch } from 'lib/apiClient';

const RecentBookings = ({ user }) => {
  const router = useRouter();
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentBookings = async () => {
      if (!user || !user._id) return;
      
      try {
        setLoading(true);
        // Fetch recent bookings for the current user
        const response = await apiFetch(`/api/bookings?user=${user._id}&limit=3&sort=-createdAt`);
        
        if (response && response.data) {
          // Process each booking to get venue and court details
          const processedBookings = await Promise.all(response.data.map(async (booking) => {
            try {
              // Get court details
              const courtResponse = await apiFetch(`/api/courts/${booking.court}`);
              const court = courtResponse || {};
              
              // Get facility details
              const facilityResponse = await apiFetch(`/api/facilities/${booking.venue}`);
              const facility = facilityResponse || {};
              
              // Format time
              const startTime = booking.startTime ? new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
              const endTime = booking.endTime ? new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
              const timeRange = startTime && endTime ? `${startTime} - ${endTime}` : 'Time not specified';
              
              // Use the first photo as the image or null if no photos
              const venueImage = facility.photos && facility.photos.length > 0
                ? facility.photos[0]
                : null;
              
              // Extract binary image data if available
              const imageData = venueImage.data ? venueImage.data : null;
              const contentType = venueImage.contentType ? venueImage.contentType : null;
              
              return {
                id: booking._id,
                venueName: facility.name || 'Unknown Venue',
                venueImage: typeof venueImage === 'string' ? venueImage : null,
                imageData: imageData,
                contentType: contentType,
                sport: court.sport || 'Not specified',
                court: court.name || 'Unknown Court',
                date: booking.date || new Date().toISOString().split('T')[0],
                time: timeRange,
                status: booking.status || 'pending',
                price: booking.totalPrice || court.pricePerHour || 0
              };
            } catch (error) {
              console.error('Error processing booking:', error);
              return null;
            }
          }));
          
          // Filter out any null values from failed requests
          setRecentBookings(processedBookings.filter(booking => booking !== null));
        }
      } catch (error) {
        console.error('Error fetching recent bookings:', error);
        setError('Failed to load recent bookings');
        
        // Fallback to empty array if API fails
        setRecentBookings([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentBookings();
  }, [user]);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'confirmed':
        return {
          color: 'text-success',
          bgColor: 'bg-success/10',
          icon: 'CheckCircle',
          label: 'Confirmed'
        };
      case 'cancelled':
        return {
          color: 'text-error',
          bgColor: 'bg-error/10',
          icon: 'XCircle',
          label: 'Cancelled'
        };
      case 'completed':
        return {
          color: 'text-primary',
          bgColor: 'bg-primary/10',
          icon: 'Check',
          label: 'Completed'
        };
      default:
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          icon: 'Calendar',
          label: 'Unknown'
        };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleViewAllBookings = () => {
    router.push('/user-profile-my-bookings');
  };

  const handleBookingClick = (bookingId) => {
    router.push(`/user-profile-my-bookings?booking=${bookingId}`);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="bg-background py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
              Your Recent Bookings
            </h2>
            <p className="text-muted-foreground">
              Manage your upcoming court reservations
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={handleViewAllBookings}
            iconName="Calendar"
            iconPosition="left"
          >
            View All
          </Button>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-10">
            <p className="text-error">{error}</p>
          </div>
        )}

        {!loading && recentBookings.length === 0 && (
          <div className="text-center py-10">
            <p className="text-muted-foreground">You don't have any bookings yet.</p>
            <Button variant="outline" className="mt-4" onClick={() => router.push('/venues-listing-search')}>
              Find Venues to Book
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentBookings?.map((booking) => {
            const statusConfig = getStatusConfig(booking?.status);
            
            return (
              <div
                key={booking?.id}
                onClick={() => handleBookingClick(booking?.id)}
                className="bg-card border border-border rounded-lg overflow-hidden shadow-soft hover:shadow-elevated transition-shadow cursor-pointer"
              >
                <div className="relative h-32 overflow-hidden">
                  <Image
                    src={booking?.venueImage}
                    imageData={booking?.imageData}
                    contentType={booking?.contentType}
                    alt={booking?.venueName}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-full flex items-center space-x-1 ${statusConfig?.bgColor}`}>
                    <Icon name={statusConfig?.icon} size={12} className={statusConfig?.color} />
                    <span className={`text-xs font-medium ${statusConfig?.color}`}>
                      {statusConfig?.label}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground truncate">
                      {booking?.venueName}
                    </h3>
                    <span className="text-sm font-mono text-muted-foreground">
                      {booking?.id}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Icon name="Activity" size={14} />
                      <span>{booking?.sport} • {booking?.court}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Icon name="Calendar" size={14} />
                      <span>{formatDate(booking?.date)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Icon name="Clock" size={14} />
                      <span>{booking?.time}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-foreground">
                      ₹{booking?.price}
                    </span>
                    
                    <div className="flex space-x-2">
                      {booking?.status === 'confirmed' && (
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {recentBookings?.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Icon name="Calendar" size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No Recent Bookings
            </h3>
            <p className="text-muted-foreground mb-6">
              Start exploring venues and make your first booking
            </p>
            <Button onClick={() => router.push('/venues-listing-search')}>
              Find Venues
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentBookings;