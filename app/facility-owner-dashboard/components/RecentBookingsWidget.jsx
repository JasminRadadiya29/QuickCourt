import React, { useState } from 'react';
import Icon from 'app/components/AppIcon';
import Button from 'app/components/ui/Button';
import Image from 'app/components/AppImage';

const RecentBookingsWidget = () => {
  const [selectedTab, setSelectedTab] = useState('upcoming');

  const mockBookings = {
    upcoming: [
      {
        id: 'BK-2025-001',
        user: {
          name: 'Michael Rodriguez',
          email: 'michael.r@email.com',
          phone: '+1 (555) 123-4567',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
        },
        venue: 'Downtown Sports Complex',
        court: 'Court A - Basketball',
        date: '2025-08-15',
        time: '14:00 - 16:00',
        amount: 45.00,
        status: 'confirmed',
        paymentStatus: 'paid'
      },
      {
        id: 'BK-2025-002',
        user: {
          name: 'Sarah Johnson',
          email: 'sarah.j@email.com',
          phone: '+1 (555) 987-6543',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
        },
        venue: 'Downtown Sports Complex',
        court: 'Court B - Tennis',
        date: '2025-08-16',
        time: '10:00 - 12:00',
        amount: 60.00,
        status: 'pending',
        paymentStatus: 'pending'
      },
      {
        id: 'BK-2025-003',
        user: {
          name: 'David Chen',
          email: 'david.c@email.com',
          phone: '+1 (555) 456-7890',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        },
        venue: 'Downtown Sports Complex',
        court: 'Court C - Badminton',
        date: '2025-08-17',
        time: '18:00 - 20:00',
        amount: 35.00,
        status: 'confirmed',
        paymentStatus: 'paid'
      }
    ],
    past: [
      {
        id: 'BK-2025-004',
        user: {
          name: 'Emma Wilson',
          email: 'emma.w@email.com',
          phone: '+1 (555) 321-0987',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
        },
        venue: 'Downtown Sports Complex',
        court: 'Court A - Basketball',
        date: '2025-08-10',
        time: '16:00 - 18:00',
        amount: 45.00,
        status: 'completed',
        paymentStatus: 'paid'
      }
    ]
  };

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
            Upcoming ({mockBookings?.upcoming?.length})
          </button>
          <button
            onClick={() => setSelectedTab('past')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-smooth ${
              selectedTab === 'past' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
            }`}
          >
            Past ({mockBookings?.past?.length})
          </button>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {mockBookings?.[selectedTab]?.length === 0 ? (
          <div className="p-6 text-center">
            <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No {selectedTab} bookings</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {mockBookings?.[selectedTab]?.map((booking) => (
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