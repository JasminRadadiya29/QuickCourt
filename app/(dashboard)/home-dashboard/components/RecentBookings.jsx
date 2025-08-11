import React from 'react';
import { useRouter } from 'next/navigation';
import Button from 'app/components/ui/Button';
import Icon from 'app/components/AppIcon';
import Image from 'app/components/AppImage';

const RecentBookings = ({ user }) => {
  const router = useRouter();

  const recentBookings = [
    {
      id: "BK-2025-001",
      venueName: "Downtown Sports Complex",
      venueImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      sport: "Basketball",
      court: "Court A",
      date: "2025-08-15",
      time: "14:00 - 16:00",
      status: "confirmed",
      price: 45
    },
    {
      id: "BK-2025-002",
      venueName: "Elite Tennis Academy",
      venueImage: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400&h=300&fit=crop",
      sport: "Tennis",
      court: "Court 3",
      date: "2025-08-18",
      time: "10:00 - 11:30",
      status: "pending",
      price: 60
    },
    {
      id: "BK-2025-003",
      venueName: "Community Recreation Center",
      venueImage: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=400&h=300&fit=crop",
      sport: "Badminton",
      court: "Court B2",
      date: "2025-08-20",
      time: "18:00 - 19:00",
      status: "confirmed",
      price: 25
    }
  ];

  const getStatusConfig = (status) => {
    switch (status) {
      case 'confirmed':
        return {
          color: 'text-success',
          bgColor: 'bg-success/10',
          icon: 'CheckCircle',
          label: 'Confirmed'
        };
      case 'pending':
        return {
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          icon: 'Clock',
          label: 'Pending'
        };
      case 'cancelled':
        return {
          color: 'text-error',
          bgColor: 'bg-error/10',
          icon: 'XCircle',
          label: 'Cancelled'
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
                      ${booking?.price}
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