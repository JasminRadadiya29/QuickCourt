import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from 'app/components/AppIcon';

const PeakHoursChart = () => {
  const mockData = [
    { hour: '6 AM', bookings: 2 },
    { hour: '7 AM', bookings: 5 },
    { hour: '8 AM', bookings: 12 },
    { hour: '9 AM', bookings: 18 },
    { hour: '10 AM', bookings: 25 },
    { hour: '11 AM', bookings: 22 },
    { hour: '12 PM', bookings: 28 },
    { hour: '1 PM', bookings: 32 },
    { hour: '2 PM', bookings: 35 },
    { hour: '3 PM', bookings: 38 },
    { hour: '4 PM', bookings: 42 },
    { hour: '5 PM', bookings: 45 },
    { hour: '6 PM', bookings: 48 },
    { hour: '7 PM', bookings: 52 },
    { hour: '8 PM', bookings: 38 },
    { hour: '9 PM', bookings: 28 },
    { hour: '10 PM', bookings: 15 }
  ];

  const peakHour = mockData?.reduce((max, current) => 
    current?.bookings > max?.bookings ? current : max
  );

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Peak Hours Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Peak time: <span className="font-semibold text-primary">{peakHour?.hour}</span> 
            ({peakHour?.bookings} bookings)
          </p>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Clock" size={16} />
          <span>Today's Activity</span>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockData}>
            <defs>
              <linearGradient id="bookingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="hour" 
              stroke="var(--color-muted-foreground)"
              fontSize={11}
              interval={2}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--color-popover)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                color: 'var(--color-popover-foreground)'
              }}
              formatter={(value) => [`${value} bookings`, 'Bookings']}
            />
            <Area
              type="monotone"
              dataKey="bookings"
              stroke="var(--color-primary)"
              strokeWidth={2}
              fill="url(#bookingGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PeakHoursChart;