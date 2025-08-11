import React, { useState } from 'react';
import Icon from '../AppIcon';

const BookingStatusIndicator = () => {
  // Mock booking state - replace with actual booking context
  const [activeBooking, setActiveBooking] = useState({
    id: 'BK-2025-001',
    venueName: 'Downtown Sports Complex',
    date: '2025-08-15',
    time: '14:00',
    status: 'confirmed' // 'pending', 'confirmed', 'cancelled'
  });

  // Don't render if no active booking
  if (!activeBooking) {
    return null;
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return {
          icon: 'Clock',
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          label: 'Pending'
        };
      case 'confirmed':
        return {
          icon: 'CheckCircle',
          color: 'text-success',
          bgColor: 'bg-success/10',
          label: 'Confirmed'
        };
      case 'cancelled':
        return {
          icon: 'XCircle',
          color: 'text-error',
          bgColor: 'bg-error/10',
          label: 'Cancelled'
        };
      default:
        return {
          icon: 'Calendar',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          label: 'Unknown'
        };
    }
  };

  const statusConfig = getStatusConfig(activeBooking?.status);

  return (
    <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-md bg-card border border-border shadow-soft">
      <div className={`flex items-center justify-center w-6 h-6 rounded-full ${statusConfig?.bgColor}`}>
        <Icon name={statusConfig?.icon} size={14} className={statusConfig?.color} />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-muted-foreground">
            {activeBooking?.id}
          </span>
          <span className={`text-xs font-medium ${statusConfig?.color}`}>
            {statusConfig?.label}
          </span>
        </div>
        <span className="text-xs text-muted-foreground truncate max-w-32">
          {activeBooking?.venueName}
        </span>
      </div>
    </div>
  );
};

export default BookingStatusIndicator;