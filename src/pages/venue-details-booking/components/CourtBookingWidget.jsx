import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { formatINR, formatINRWithDecimals } from '../../../utils/currency';

const CourtBookingWidget = ({ courts, onBookingSubmit }) => {
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [playerCount, setPlayerCount] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with today's date
  useEffect(() => {
    const today = new Date();
    const formattedDate = today?.toISOString()?.split('T')?.[0];
    setSelectedDate(formattedDate);
  }, []);

  // Generate time slots for the selected date
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 6; // 6 AM
    const endHour = 22; // 10 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      const timeString = `${hour?.toString()?.padStart(2, '0')}:00`;
      const displayTime = hour < 12 ? `${hour}:00 AM` : 
                         hour === 12 ? '12:00 PM' : 
                         `${hour - 12}:00 PM`;
      
      // Mock availability - some slots are booked
      const isAvailable = Math.random() > 0.3;
      const price = selectedCourt ? selectedCourt?.hourlyRate : 0;
      
      slots?.push({
        time: timeString,
        displayTime,
        isAvailable,
        price
      });
    }
    
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const calculateTotal = () => {
    if (!selectedTimeSlot || !selectedCourt) return 0;
    const subtotal = selectedTimeSlot?.price;
    const tax = subtotal * 0.08; // 8% tax
    return subtotal + tax;
  };

  const handleBooking = async () => {
    if (!selectedCourt || !selectedDate || !selectedTimeSlot) {
      alert('Please select a court, date, and time slot');
      return;
    }

    setIsLoading(true);
    
    // Simulate booking process
    setTimeout(() => {
      const bookingData = {
        court: selectedCourt,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        playerCount,
        specialRequests,
        total: calculateTotal()
      };
      
      onBookingSubmit(bookingData);
      setIsLoading(false);
    }, 2000);
  };

  const isDateDisabled = (date) => {
    const today = new Date();
    const selectedDateObj = new Date(date);
    return selectedDateObj < today;
  };

  const getMinDate = () => {
    const today = new Date();
    return today?.toISOString()?.split('T')?.[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate?.setDate(maxDate?.getDate() + 30); // 30 days from today
    return maxDate?.toISOString()?.split('T')?.[0];
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-soft sticky top-20">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Book a Court</h3>
        
        {/* Court Selection */}
        <div className="space-y-4 mb-6">
          <h4 className="font-medium text-foreground">Select Court</h4>
          <div className="space-y-2">
            {courts?.map((court) => (
              <div
                key={court?.id}
                className={`p-3 border rounded-lg cursor-pointer transition-smooth ${
                  selectedCourt?.id === court?.id
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedCourt(court)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium text-foreground">{court?.name}</h5>
                    <p className="text-sm text-muted-foreground">{court?.sport}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Icon name="Clock" size={14} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {court?.operatingHours}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{formatINR(court?.hourlyRate)}/hr</p>
                    <div className={`inline-flex items-center space-x-1 text-xs px-2 py-1 rounded-full ${
                      court?.isAvailable 
                        ? 'bg-success/10 text-success' :'bg-error/10 text-error'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        court?.isAvailable ? 'bg-success' : 'bg-error'
                      }`} />
                      <span>{court?.isAvailable ? 'Available' : 'Busy'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Date Selection */}
        <div className="mb-6">
          <Input
            label="Select Date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e?.target?.value)}
            min={getMinDate()}
            max={getMaxDate()}
            required
          />
        </div>

        {/* Time Slot Selection */}
        {selectedCourt && selectedDate && (
          <div className="mb-6">
            <h4 className="font-medium text-foreground mb-3">Available Time Slots</h4>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {timeSlots?.map((slot, index) => (
                <button
                  key={index}
                  onClick={() => slot?.isAvailable && setSelectedTimeSlot(slot)}
                  disabled={!slot?.isAvailable}
                  className={`p-2 text-sm rounded-md border transition-smooth ${
                    selectedTimeSlot?.time === slot?.time
                      ? 'border-primary bg-primary text-primary-foreground'
                      : slot?.isAvailable
                      ? 'border-border hover:border-primary bg-background text-foreground'
                      : 'border-border bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  <div className="font-medium">{slot?.displayTime}</div>
                  <div className="text-xs">
                    {slot?.isAvailable ? formatINR(slot?.price) : 'Booked'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Player Count */}
        {selectedTimeSlot && (
          <div className="mb-6">
            <Input
              label="Number of Players"
              type="number"
              value={playerCount}
              onChange={(e) => setPlayerCount(parseInt(e?.target?.value))}
              min="1"
              max="10"
              required
            />
          </div>
        )}

        {/* Special Requests */}
        {selectedTimeSlot && (
          <div className="mb-6">
            <Input
              label="Special Requests (Optional)"
              type="text"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e?.target?.value)}
              placeholder="Any special requirements or notes..."
            />
          </div>
        )}

        {/* Booking Summary */}
        {selectedCourt && selectedTimeSlot && (
          <div className="bg-muted rounded-lg p-4 mb-6">
            <h4 className="font-medium text-foreground mb-3">Booking Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Court:</span>
                <span className="text-foreground">{selectedCourt?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="text-foreground">
                  {new Date(selectedDate)?.toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span className="text-foreground">{selectedTimeSlot?.displayTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Players:</span>
                <span className="text-foreground">{playerCount}</span>
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="text-foreground">{formatINRWithDecimals(selectedTimeSlot?.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (8%):</span>
                  <span className="text-foreground">{formatINRWithDecimals(selectedTimeSlot?.price * 0.08)}</span>
                </div>
                <div className="flex justify-between font-semibold text-foreground">
                  <span>Total:</span>
                  <span>{formatINRWithDecimals(calculateTotal())}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Book Now Button */}
        <Button
          variant="default"
          fullWidth
          loading={isLoading}
          disabled={!selectedCourt || !selectedTimeSlot}
          onClick={handleBooking}
          iconName="Calendar"
          iconPosition="left"
        >
          {isLoading ? 'Processing...' : 'Book Now'}
        </Button>

        <p className="text-xs text-muted-foreground text-center mt-3">
          You'll be redirected to payment after clicking Book Now
        </p>
      </div>
    </div>
  );
};

export default CourtBookingWidget;