import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import Button from '../../../components/ui/Button';
import { formatINR, formatINRForChart } from '../../../utils/currency';

const EarningsChart = () => {
  const [viewType, setViewType] = useState('monthly');

  const mockData = {
    monthly: [
      { name: 'Jan', earnings: 8500, target: 10000 },
      { name: 'Feb', earnings: 9200, target: 10000 },
      { name: 'Mar', earnings: 11800, target: 10000 },
      { name: 'Apr', earnings: 10500, target: 10000 },
      { name: 'May', earnings: 12300, target: 10000 },
      { name: 'Jun', earnings: 13100, target: 10000 },
      { name: 'Jul', earnings: 14200, target: 10000 },
      { name: 'Aug', earnings: 15800, target: 10000 }
    ],
    quarterly: [
      { name: 'Q1 2024', earnings: 29500, target: 30000 },
      { name: 'Q2 2024', earnings: 35900, target: 30000 },
      { name: 'Q3 2024', earnings: 43100, target: 40000 }
    ]
  };

  const viewOptions = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' }
  ];

  const totalEarnings = mockData?.[viewType]?.reduce((sum, item) => sum + item?.earnings, 0);

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Revenue Analytics</h3>
          <p className="text-sm text-muted-foreground">
            Total: <span className="font-semibold text-success">{formatINR(totalEarnings)}</span>
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {viewOptions?.map((option) => (
            <Button
              key={option?.value}
              variant={viewType === option?.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewType(option?.value)}
            >
              {option?.label}
            </Button>
          ))}
          
          <Button variant="ghost" size="sm" iconName="FileText" iconPosition="left">
            Report
          </Button>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockData?.[viewType]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="name" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={(value) => formatINRForChart(value)}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--color-popover)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                color: 'var(--color-popover-foreground)'
              }}
              formatter={(value, name) => [formatINR(value), name === 'earnings' ? 'Earnings' : 'Target']}
            />
            <Bar 
              dataKey="earnings" 
              fill="var(--color-primary)" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="target" 
              fill="var(--color-muted)" 
              radius={[4, 4, 0, 0]}
              opacity={0.3}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EarningsChart;