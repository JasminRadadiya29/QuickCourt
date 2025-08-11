import React, { useState } from 'react';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';


const SortAndView = ({ 
  sortBy, 
  onSortChange, 
  viewMode, 
  onViewModeChange, 
  resultsCount, 
  onFilterToggle,
  isMobile = false 
}) => {
  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'distance', label: 'Nearest First' },
    { value: 'newest', label: 'Newest First' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-soft">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {isMobile && (
            <Button
              variant="outline"
              size="sm"
              onClick={onFilterToggle}
              iconName="Filter"
              iconPosition="left"
            >
              Filters
            </Button>
          )}
          
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{resultsCount}</span> venues found
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
            <div className="w-48">
              <Select
                options={sortOptions}
                value={sortBy}
                onChange={onSortChange}
                placeholder="Select sort option"
              />
            </div>
          </div>

          <div className="flex items-center border border-border rounded-md">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              iconName="List"
              className="rounded-r-none border-r"
            />
            <Button
              variant={viewMode === 'map' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('map')}
              iconName="Map"
              className="rounded-l-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortAndView;