import React, { useState } from 'react';
import Button from 'app/components/ui/Button';
import Image from 'app/components/AppImage';
import Icon from 'app/components/AppIcon';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, Users, DollarSign } from 'lucide-react';
import { formatINR } from '../../../../src/utils/currency';

const BookingCard = ({ booking, onCancel, onModify, onRebook, onReview }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'confirmed':
        return {
          color: 'text-success',
          bgColor: 'bg-success/10',
          icon: 'CheckCircle',
          label: 'Confirmed'
        };
      case 'completed':
        return {
          color: 'text-primary',
          bgColor: 'bg-primary/10',
          icon: 'Check',
          label: 'Completed'
        };
      case 'cancelled':
        return {
          color: 'text-error',
          bgColor: 'bg-error/10',
          icon: 'XCircle',
          label: 'Cancelled'
        };
      case 'pending':
        return {
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          icon: 'Clock',
          label: 'Pending'
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

  const statusConfig = getStatusConfig(booking?.status);
  const isFutureBooking = new Date(booking.date) > new Date();
  const isPastBooking = new Date(booking.date) < new Date();

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`)?.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-elevated transition-smooth">
      {/* Mobile Card Header */}
      <div className="p-4 sm:p-6">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
            <Image
              src={booking?.venueImage}
              alt={booking?.venueName}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground truncate">
                  {booking?.venueName}
                </h3>
                <p className="text-sm text-muted-foreground">{booking?.sport} • {booking?.courtName}</p>
              </div>
              
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${statusConfig?.bgColor}`}>
                <Icon name={statusConfig?.icon} size={14} className={statusConfig?.color} />
                <span className={`text-xs font-medium ${statusConfig?.color}`}>
                  {statusConfig?.label}
                </span>
              </div>
            </div>

            <div className="mt-2 space-y-1">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Icon name="Calendar" size={14} />
                  <span>{formatDate(booking?.date)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={14} />
                  <span>{formatTime(booking?.startTime)} - {formatTime(booking?.endTime)}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Icon name="DollarSign" size={14} className="text-primary" />
                  <span className="text-sm font-medium text-foreground">{formatINR(booking?.totalAmount)}</span>
                </div>
                
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="sm:hidden flex items-center space-x-1 text-xs text-primary hover:text-primary/80 transition-smooth"
                >
                  <span>{isExpanded ? 'Less' : 'More'}</span>
                  <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Details (Mobile) */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border sm:hidden">
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">Booking Details</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Booking ID: {booking?.id}</p>
                  <p>Duration: {booking?.duration} hour{booking?.duration > 1 ? 's' : ''}</p>
                  <p>Booked on: {formatDate(booking?.bookedDate)}</p>
                </div>
              </div>
              
              {booking?.amenities && booking?.amenities?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-1">Included Amenities</h4>
                  <div className="flex flex-wrap gap-1">
                    {booking?.amenities?.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-muted text-xs text-muted-foreground rounded"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Desktop Details */}
        <div className="hidden sm:block mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Booking ID:</span>
              <p className="font-medium text-foreground">{booking?.id}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Duration:</span>
              <p className="font-medium text-foreground">{booking?.duration} hour{booking?.duration > 1 ? 's' : ''}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Booked on:</span>
              <p className="font-medium text-foreground">{formatDate(booking?.bookedDate)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Payment:</span>
              <p className="font-medium text-foreground">{booking?.paymentStatus}</p>
            </div>
          </div>
          
          {booking?.amenities && booking?.amenities?.length > 0 && (
            <div className="mt-3">
              <span className="text-sm text-muted-foreground">Amenities:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {booking?.amenities?.map((amenity, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-muted text-xs text-muted-foreground rounded"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {isFutureBooking && booking?.status === 'confirmed' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Edit"
                  iconPosition="left"
                  onClick={() => onModify(booking)}
                >
                  Modify
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  iconName="X"
                  iconPosition="left"
                  onClick={() => onCancel(booking)}
                >
                  Cancel
                </Button>
              </>
            )}
            
            {isPastBooking && booking?.status === 'completed' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="RotateCcw"
                  iconPosition="left"
                  onClick={() => onRebook(booking)}
                >
                  Rebook
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  iconName="Star"
                  iconPosition="left"
                  onClick={() => onReview(booking)}
                >
                  Review
                </Button>
              </>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              iconName="ExternalLink"
              iconPosition="left"
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;