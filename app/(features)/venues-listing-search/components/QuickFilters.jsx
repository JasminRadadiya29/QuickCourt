import React from 'react';
import Button from 'app/components/ui/Button';


const QuickFilters = ({ activeFilters, onQuickFilter }) => {
  const quickFilterOptions = [
    { id: 'basketball', label: 'Basketball', icon: 'Circle', category: 'sports' },
    { id: 'tennis', label: 'Tennis', icon: 'Circle', category: 'sports' },
    { id: 'badminton', label: 'Badminton', icon: 'Circle', category: 'sports' },
    { id: 'indoor', label: 'Indoor', icon: 'Home', category: 'venueTypes' },
    { id: 'outdoor', label: 'Outdoor', icon: 'Trees', category: 'venueTypes' },
    { id: 'budget', label: 'Under ₹500', icon: 'IndianRupee', category: 'priceRanges' },
    { id: '4plus', label: '4+ Stars', icon: 'Star', category: 'ratings', value: 4 }
  ];

  const isActive = (filter) => {
    if (filter?.category === 'ratings') {
      return activeFilters?.ratings?.includes(filter?.value) || false;
    }
    return activeFilters?.[filter?.category]?.includes(filter?.id) || false;
  };

  const handleQuickFilter = (filter) => {
    const value = filter?.category === 'ratings' ? filter?.value : filter?.id;
    onQuickFilter(filter?.category, value);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-soft">
      <h3 className="text-sm font-medium text-foreground mb-3">Quick Filters</h3>
      <div className="flex flex-wrap gap-2">
        {quickFilterOptions?.map((filter) => (
          <Button
            key={filter?.id}
            variant={isActive(filter) ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleQuickFilter(filter)}
            iconName={filter?.icon}
            iconPosition="left"
            className="text-xs"
          >
            {filter?.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickFilters;