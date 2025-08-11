import React, { useState } from 'react';
import Button from 'app/components/ui/Button';
import Input from 'app/components/ui/Input';
import Select from 'app/components/ui/Select';
import Icon from 'app/components/AppIcon';

const BookingFilters = ({ onFilterChange, totalResults }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    sport: '',
    dateRange: '',
    sortBy: 'date-desc'
  });

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'pending', label: 'Pending' }
  ];

  const sportOptions = [
    { value: '', label: 'All Sports' },
    { value: 'tennis', label: 'Tennis' },
    { value: 'basketball', label: 'Basketball' },
    { value: 'badminton', label: 'Badminton' },
    { value: 'squash', label: 'Squash' },
    { value: 'volleyball', label: 'Volleyball' },
    { value: 'football', label: 'Football' }
  ];

  const dateRangeOptions = [
    { value: '', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'this-week', label: 'This Week' },
    { value: 'this-month', label: 'This Month' },
    { value: 'last-month', label: 'Last Month' },
    { value: 'last-3-months', label: 'Last 3 Months' }
  ];

  const sortOptions = [
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'venue-asc', label: 'Venue A-Z' },
    { value: 'venue-desc', label: 'Venue Z-A' },
    { value: 'amount-desc', label: 'Highest Amount' },
    { value: 'amount-asc', label: 'Lowest Amount' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      status: '',
      sport: '',
      dateRange: '',
      sortBy: 'date-desc'
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = filters?.search || filters?.status || filters?.sport || filters?.dateRange;

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      {/* Search and Quick Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 w-full sm:max-w-md">
          <Input
            type="search"
            placeholder="Search venues..."
            value={filters?.search}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
            className="w-full"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Filter" size={16} />
            <span>{totalResults} result{totalResults !== 1 ? 's' : ''}</span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            Filters
          </Button>
        </div>
      </div>
      {/* Expanded Filters */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="Status"
              options={statusOptions}
              value={filters?.status}
              onChange={(value) => handleFilterChange('status', value)}
            />

            <Select
              label="Sport"
              options={sportOptions}
              value={filters?.sport}
              onChange={(value) => handleFilterChange('sport', value)}
            />

            <Select
              label="Date Range"
              options={dateRangeOptions}
              value={filters?.dateRange}
              onChange={(value) => handleFilterChange('dateRange', value)}
            />

            <Select
              label="Sort By"
              options={sortOptions}
              value={filters?.sortBy}
              onChange={(value) => handleFilterChange('sortBy', value)}
            />
          </div>

          {hasActiveFilters && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {filters?.status && (
                  <span className="inline-flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    <span>Status: {statusOptions?.find(opt => opt?.value === filters?.status)?.label}</span>
                    <button onClick={() => handleFilterChange('status', '')}>
                      <Icon name="X" size={12} />
                    </button>
                  </span>
                )}
                
                {filters?.sport && (
                  <span className="inline-flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    <span>Sport: {sportOptions?.find(opt => opt?.value === filters?.sport)?.label}</span>
                    <button onClick={() => handleFilterChange('sport', '')}>
                      <Icon name="X" size={12} />
                    </button>
                  </span>
                )}
                
                {filters?.dateRange && (
                  <span className="inline-flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    <span>Date: {dateRangeOptions?.find(opt => opt?.value === filters?.dateRange)?.label}</span>
                    <button onClick={() => handleFilterChange('dateRange', '')}>
                      <Icon name="X" size={12} />
                    </button>
                  </span>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                iconName="X"
                iconPosition="left"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingFilters;