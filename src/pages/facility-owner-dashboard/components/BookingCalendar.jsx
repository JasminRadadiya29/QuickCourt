import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BookingCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 7, 11)); // August 2025
  const [selectedDate, setSelectedDate] = useState(null);

  const mockBookings = {
    '2025-08-11': [
      { time: '09:00', court: 'Court A', user: 'John Doe', status: 'confirmed' },
      { time: '14:00', court: 'Court B', user: 'Jane Smith', status: 'pending' }
    ],
    '2025-08-12': [
      { time: '10:00', court: 'Court A', user: 'Mike Johnson', status: 'confirmed' },
      { time: '16:00', court: 'Court C', user: 'Sarah Wilson', status: 'confirmed' }
    ],
    '2025-08-15': [
      { time: '14:00', court: 'Court A', user: 'Michael Rodriguez', status: 'confirmed' },
      { time: '18:00', court: 'Court B', user: 'Emma Davis', status: 'pending' }
    ],
    '2025-08-16': [
      { time: '10:00', court: 'Court B', user: 'Sarah Johnson', status: 'pending' }
    ],
    '2025-08-17': [
      { time: '18:00', court: 'Court C', user: 'David Chen', status: 'confirmed' }
    ]
  };

  const getDaysInMonth = (date) => {
    const year = date?.getFullYear();
    const month = date?.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay?.getDate();
    const startingDayOfWeek = firstDay?.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days?.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days?.push(day);
    }
    
    return days;
  };

  const formatDateKey = (year, month, day) => {
    return `${year}-${String(month + 1)?.padStart(2, '0')}-${String(day)?.padStart(2, '0')}`;
  };

  const getBookingsForDate = (day) => {
    if (!day) return [];
    const dateKey = formatDateKey(currentDate?.getFullYear(), currentDate?.getMonth(), day);
    return mockBookings?.[dateKey] || [];
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate?.setMonth(prev?.getMonth() + direction);
      return newDate;
    });
    setSelectedDate(null);
  };

  const handleDateClick = (day) => {
    if (!day) return;
    const dateKey = formatDateKey(currentDate?.getFullYear(), currentDate?.getMonth(), day);
    setSelectedDate(selectedDate === dateKey ? null : dateKey);
  };

  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return (day === today?.getDate() &&
    currentDate?.getMonth() === today?.getMonth() && currentDate?.getFullYear() === today?.getFullYear());
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Booking Calendar</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="ChevronLeft"
            onClick={() => navigateMonth(-1)}
          />
          <span className="text-sm font-medium text-foreground min-w-32 text-center">
            {monthNames?.[currentDate?.getMonth()]} {currentDate?.getFullYear()}
          </span>
          <Button
            variant="ghost"
            size="sm"
            iconName="ChevronRight"
            onClick={() => navigateMonth(1)}
          />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames?.map(day => (
          <div key={day} className="p-2 text-center text-xs font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 mb-4">
        {days?.map((day, index) => {
          const bookings = getBookingsForDate(day);
          const dateKey = day ? formatDateKey(currentDate?.getFullYear(), currentDate?.getMonth(), day) : null;
          const isSelected = selectedDate === dateKey;
          
          return (
            <div
              key={index}
              onClick={() => handleDateClick(day)}
              className={`
                relative p-2 h-12 text-center text-sm cursor-pointer rounded-md transition-smooth
                ${day ? 'hover:bg-accent' : ''}
                ${isToday(day) ? 'bg-primary text-primary-foreground' : ''}
                ${isSelected ? 'bg-accent border border-primary' : ''}
                ${!day ? 'cursor-default' : ''}
              `}
            >
              {day && (
                <>
                  <span className={isToday(day) ? 'font-bold' : 'font-medium'}>
                    {day}
                  </span>
                  {bookings?.length > 0 && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
                      {bookings?.slice(0, 3)?.map((booking, idx) => (
                        <div
                          key={idx}
                          className={`w-1.5 h-1.5 rounded-full ${
                            booking?.status === 'confirmed' ? 'bg-success' : 'bg-warning'
                          }`}
                        />
                      ))}
                      {bookings?.length > 3 && (
                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
      {selectedDate && (
        <div className="border-t border-border pt-4">
          <h4 className="font-medium text-foreground mb-3">
            Bookings for {new Date(selectedDate)?.toLocaleDateString()}
          </h4>
          <div className="space-y-2">
            {getBookingsForDate(parseInt(selectedDate?.split('-')?.[2]))?.map((booking, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {booking?.time} - {booking?.court}
                    </p>
                    <p className="text-xs text-muted-foreground">{booking?.user}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  booking?.status === 'confirmed' ?'bg-success/10 text-success' :'bg-warning/10 text-warning'
                }`}>
                  {booking?.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;