import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import Button from 'app/components/ui/Button';

const BookingTrendsChart = () => {
  const [timeRange, setTimeRange] = useState('weekly');
  const [trendsData, setTrendsData] = useState({
    weekly: [],
    monthly: [],
    yearly: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendsData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/owner/analytics/booking-trends');
        setTrendsData(response.data);
      } catch (error) {
        console.error('Failed to fetch booking trends data:', error);
        // Fallback data in case API fails
        setTrendsData({
    weekly: [
      { name: 'Mon', bookings: 12, revenue: 480 },
      { name: 'Tue', bookings: 19, revenue: 760 },
      { name: 'Wed', bookings: 15, revenue: 600 },
      { name: 'Thu', bookings: 22, revenue: 880 },
      { name: 'Fri', bookings: 28, revenue: 1120 },
      { name: 'Sat', bookings: 35, revenue: 1400 },
      { name: 'Sun', bookings: 31, revenue: 1240 }
    ],
    monthly: [
      { name: 'Week 1', bookings: 145, revenue: 5800 },
      { name: 'Week 2', bookings: 162, revenue: 6480 },
      { name: 'Week 3', bookings: 178, revenue: 7120 },
      { name: 'Week 4', bookings: 195, revenue: 7800 }
    ],
    yearly: [
      { name: 'Month 1', bookings: 680, revenue: 27200 },
      { name: 'Month 2', bookings: 745, revenue: 29800 },
      { name: 'Month 3', bookings: 812, revenue: 32480 }
    ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrendsData();
  }, []);

  const timeRangeOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Booking Trends</h3>
          <p className="text-sm text-muted-foreground">Track your booking performance over time</p>
        </div>
        
        <div className="flex items-center space-x-2">
          {timeRangeOptions?.map((option) => (
            <Button
              key={option?.value}
              variant={timeRange === option?.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(option?.value)}
            >
              {option?.label}
            </Button>
          ))}
          
          <Button variant="ghost" size="sm" iconName="Download" iconPosition="left">
            Export
          </Button>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p>Loading booking trends data...</p>
            </div>
          ) : (
            <LineChart data={trendsData?.[timeRange]}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="name" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
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
            />
            <Line 
              type="monotone" 
              dataKey="bookings" 
              stroke="var(--color-primary)" 
              strokeWidth={3}
              dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
            />
          </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BookingTrendsChart;