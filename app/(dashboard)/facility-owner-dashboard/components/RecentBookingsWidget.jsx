import React, { useState } from 'react';
import { useBookings } from 'app/providers';
import Icon from 'app/components/AppIcon';
import Button from 'app/components/ui/Button';
import Image from 'app/components/AppImage';

const RecentBookingsWidget = () => {
  const [selectedTab, setSelectedTab] = useState('upcoming');
  // Get bookings from context
  const { bookings, loading, error } = useBookings();

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-success bg-success/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'completed':
        return 'text-primary bg-primary/10';
      case 'cancelled':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const handleContactUser = (user) => {
    window.location.href = `mailto:${user?.email}`;
  };

  const handleManageBooking = (bookingId, action) => {
    console.log(`${action} booking ${bookingId}`);
    // Implement booking management logic
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-soft">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Recent Bookings</h3>
          <Button variant="ghost" size="sm" iconName="MoreHorizontal" />
        </div>
        
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          <button
            onClick={() => setSelectedTab('upcoming')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-smooth ${
              selectedTab === 'upcoming' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Upcoming ({bookings?.upcoming?.length})
          </button>
          <button
            onClick={() => setSelectedTab('past')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-smooth ${
              selectedTab === 'past' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Past ({bookings?.past?.length})
          </button>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
      <div className="flex items-center justify-center p-6">
        <p>Loading bookings...</p>
      </div>
    ) : bookings?.[selectedTab]?.length === 0 ? (
          <div className="p-6 text-center">
            <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No {selectedTab} bookings</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {bookings?.[selectedTab]?.map((booking) => (
              <div key={booking?.id} className="p-6 hover:bg-muted/50 transition-smooth">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                      <Image 
                        src={booking?.user?.avatar} 
                        alt={booking?.user?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{booking?.user?.name}</h4>
                      <p className="text-sm text-muted-foreground">{booking?.user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking?.status)}`}>
                      {booking?.status}
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      ${booking?.amount?.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Court</p>
                    <p className="font-medium text-foreground">{booking?.court}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date & Time</p>
                    <p className="font-medium text-foreground">
                      {new Date(booking.date)?.toLocaleDateString()} at {booking?.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Icon name="Phone" size={14} />
                    <span>{booking?.user?.phone}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Mail"
                      onClick={() => handleContactUser(booking?.user)}
                    >
                      Contact
                    </Button>
                    
                    {selectedTab === 'upcoming' && booking?.status === 'pending' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          iconName="X"
                          onClick={() => handleManageBooking(booking?.id, 'cancel')}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          iconName="Check"
                          onClick={() => handleManageBooking(booking?.id, 'confirm')}
                        >
                          Confirm
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentBookingsWidget;