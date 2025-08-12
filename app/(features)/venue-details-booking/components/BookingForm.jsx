'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch, getCurrentUser } from '@/lib/apiClient';
import Button from 'app/components/ui/Button';
import Input from 'app/components/ui/Input';
import { formatINR } from '@/src/utils/currency';

const BookingForm = ({ venueId, onSuccess }) => {
  const [courts, setCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize with today's date
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setSelectedDate(formattedDate);
    
    // Load courts for this venue
    loadCourts();
  }, [venueId]);

  // When date or court changes, check availability
  useEffect(() => {
    if (selectedDate && selectedCourt) {
      checkAvailability();
    }
  }, [selectedDate, selectedCourt]);

  const loadCourts = async () => {
    try {
      setLoading(true);
      const data = await apiFetch(`/api/courts?venue=${venueId}`);
      setCourts(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load courts');
      setLoading(false);
    }
  };

  const checkAvailability = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await apiFetch('/api/bookings/availability', {
        method: 'POST',
        body: JSON.stringify({
          venueId,
          date: selectedDate
        })
      });
      
      // Find the selected court in the response
      const courtData = data.courts.find(c => c.courtId === selectedCourt._id);
      
      if (courtData) {
        // Parse the time slots
        const slots = courtData.availableSlots.map(slot => {
          const [start, end] = slot.split('-');
          return {
            id: `${start}-${end}`,
            start,
            end,
            display: `${formatTime(start)} - ${formatTime(end)}`,
            price: calculatePrice(start, end, selectedCourt.pricePerHour)
          };
        });
        
        setAvailableSlots(slots);
      } else {
        setAvailableSlots([]);
      }
      
      setLoading(false);
    } catch (err) {
      setError('Failed to check availability');
      setAvailableSlots([]);
      setLoading(false);
    }
  };
  
  const calculatePrice = (startTime, endTime, pricePerHour) => {
    // Calculate hours difference
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    
    const durationHours = (endTotalMinutes - startTotalMinutes) / 60;
    
    // Calculate price
    return pricePerHour * durationHours;
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleCourtSelect = (court) => {
    setSelectedCourt(court);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleBooking = async () => {
    if (!selectedCourt || !selectedDate || !selectedSlot) {
      setError('Please select a court, date, and time slot');
      return;
    }

    const user = getCurrentUser();
    if (!user) {
      setError('Please sign in to book a court');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiFetch('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({
          user: user.id,
          venue: venueId,
          court: selectedCourt._id,
          date: selectedDate,
          startHour: selectedSlot.start,
          endHour: selectedSlot.end,
          totalPrice: selectedSlot.price
        })
      });
      
      setLoading(false);
      
      if (onSuccess) {
        onSuccess(response);
      }
    } catch (err) {
      setError(err.error || 'Failed to create booking');
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30); // 30 days from today
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-soft p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Book a Court</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-md text-error text-sm">
          {error}
        </div>
      )}
      
      {/* Court Selection */}
      <div className="space-y-4 mb-6">
        <h4 className="font-medium text-foreground">Select Court</h4>
        <div className="space-y-2">
          {courts.map((court) => (
            <div
              key={court._id}
              className={`p-3 border rounded-lg cursor-pointer transition-smooth ${
                selectedCourt && selectedCourt._id === court._id
                  ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
              onClick={() => handleCourtSelect(court)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-medium text-foreground">{court.name}</h5>
                  <p className="text-sm text-muted-foreground">{court.sport}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {court.openHour} - {court.closeHour}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{formatINR(court.pricePerHour)}/hr</p>
                  <div className={`inline-flex items-center space-x-1 text-xs px-2 py-1 rounded-full ${
                    court.isAvailable 
                      ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      court.isAvailable ? 'bg-success' : 'bg-error'
                    }`} />
                    <span>{court.isAvailable ? 'Available' : 'Unavailable'}</span>
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
          onChange={(e) => setSelectedDate(e.target.value)}
          min={getMinDate()}
          max={getMaxDate()}
          required
        />
      </div>

      {/* Time Slot Selection */}
      {selectedCourt && selectedDate && (
        <div className="mb-6">
          <h4 className="font-medium text-foreground mb-3">Available Time Slots</h4>
          {loading ? (
            <div className="text-center p-4">Loading available slots...</div>
          ) : availableSlots.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {availableSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => handleSlotSelect(slot)}
                  className={`p-2 text-sm rounded-md border transition-smooth ${
                    selectedSlot && selectedSlot.id === slot.id
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border hover:border-primary bg-background text-foreground'
                  }`}
                >
                  <div className="font-medium">{slot.display}</div>
                  <div className="text-xs">{formatINR(slot.price)}</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center p-4 text-muted-foreground">
              No available slots for this date. Please try another date.
            </div>
          )}
        </div>
      )}

      {/* Booking Summary */}
      {selectedCourt && selectedSlot && (
        <div className="bg-muted rounded-lg p-4 mb-6">
          <h4 className="font-medium text-foreground mb-3">Booking Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Court:</span>
              <span className="text-foreground">{selectedCourt.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span className="text-foreground">
                {new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time:</span>
              <span className="text-foreground">{selectedSlot.display}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration:</span>
              <span className="text-foreground">
                {(() => {
                  const [startHour, startMinute] = selectedSlot.start.split(':').map(Number);
                  const [endHour, endMinute] = selectedSlot.end.split(':').map(Number);
                  
                  const startTotalMinutes = startHour * 60 + startMinute;
                  const endTotalMinutes = endHour * 60 + endMinute;
                  
                  const durationHours = (endTotalMinutes - startTotalMinutes) / 60;
                  return `${durationHours} hour${durationHours !== 1 ? 's' : ''}`;
                })()}
              </span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t border-border">
              <span>Total:</span>
              <span>{formatINR(selectedSlot.price)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Book Now Button */}
      <Button
        variant="default"
        fullWidth
        loading={loading}
        disabled={!selectedCourt || !selectedSlot || loading}
        onClick={handleBooking}
        iconName="Calendar"
        iconPosition="left"
      >
        {loading ? 'Processing...' : 'Book Now'}
      </Button>

      <p className="text-xs text-muted-foreground text-center mt-3">
        By booking, you agree to our terms and conditions
      </p>
    </div>
  );
};

export default BookingForm;