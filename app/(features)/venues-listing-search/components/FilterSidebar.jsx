import React, { useState } from 'react';
import Button from 'app/components/ui/Button';
import { Checkbox } from 'app/components/ui/Checkbox';
import Icon from 'app/components/AppIcon';

const FilterSidebar = ({ filters, onFiltersChange, isOpen, onClose, isMobile = false }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const sportTypes = [
    { id: 'basketball', label: 'Basketball', count: 45 },
    { id: 'tennis', label: 'Tennis', count: 32 },
    { id: 'badminton', label: 'Badminton', count: 28 },
    { id: 'football', label: 'Football', count: 22 },
    { id: 'volleyball', label: 'Volleyball', count: 18 },
    { id: 'swimming', label: 'Swimming', count: 15 },
    { id: 'cricket', label: 'Cricket', count: 12 },
    { id: 'squash', label: 'Squash', count: 8 }
  ];

  const venueTypes = [
    { id: 'indoor', label: 'Indoor', count: 89 },
    { id: 'outdoor', label: 'Outdoor', count: 67 },
    { id: 'mixed', label: 'Mixed', count: 34 }
  ];

  const priceRanges = [
    { id: 'budget', label: 'Under ₹500/hour', min: 0, max: 500 },
    { id: 'moderate', label: '₹500 - ₹1,000/hour', min: 500, max: 1000 },
    { id: 'premium', label: '₹1,000 - ₹2,000/hour', min: 1000, max: 2000 },
    { id: 'luxury', label: 'Over ₹2,000/hour', min: 2000, max: 1000000 }
  ];

  const ratings = [
    { id: '4plus', label: '4+ Stars', value: 4 },
    { id: '3plus', label: '3+ Stars', value: 3 },
    { id: '2plus', label: '2+ Stars', value: 2 }
  ];

  const handleFilterChange = (category, value, checked) => {
    const newFilters = { ...localFilters };
    
    if (!newFilters?.[category]) {
      newFilters[category] = [];
    }

    if (checked) {
      newFilters[category] = [...newFilters?.[category], value];
    } else {
      newFilters[category] = newFilters?.[category]?.filter(item => item !== value);
    }

    setLocalFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    if (isMobile) {
      onClose();
    }
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      sports: [],
      venueTypes: [],
      priceRanges: [],
      ratings: []
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const FilterSection = ({ title, children, defaultOpen = true }) => {
    const [isExpanded, setIsExpanded] = useState(defaultOpen);

    return (
      <div className="border-b border-border pb-6 mb-6 last:border-b-0 last:pb-0 last:mb-0">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left mb-4"
        >
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <Icon 
            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
            size={20} 
            className="text-muted-foreground"
          />
        </button>
        {isExpanded && children}
      </div>
    );
  };

  const content = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Filters</h2>
        {isMobile && (
          <Button variant="ghost" onClick={onClose} iconName="X" size="sm" />
        )}
      </div>

      <FilterSection title="Sport Type">
        <div className="space-y-3">
          {sportTypes?.map((sport) => (
            <div key={sport?.id} className="flex items-center justify-between">
              <Checkbox
                label={sport?.label}
                checked={localFilters?.sports?.includes(sport?.id) || false}
                onChange={(e) => handleFilterChange('sports', sport?.id, e?.target?.checked)}
              />
              <span className="text-sm text-muted-foreground">({sport?.count})</span>
            </div>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Venue Type">
        <div className="space-y-3">
          {venueTypes?.map((type) => (
            <div key={type?.id} className="flex items-center justify-between">
              <Checkbox
                label={type?.label}
                checked={localFilters?.venueTypes?.includes(type?.id) || false}
                onChange={(e) => handleFilterChange('venueTypes', type?.id, e?.target?.checked)}
              />
              <span className="text-sm text-muted-foreground">({type?.count})</span>
            </div>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price Range">
        <div className="space-y-3">
          {priceRanges?.map((range) => (
            <Checkbox
              key={range?.id}
              label={range?.label}
              checked={localFilters?.priceRanges?.includes(range?.id) || false}
              onChange={(e) => handleFilterChange('priceRanges', range?.id, e?.target?.checked)}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Rating">
        <div className="space-y-3">
          {ratings?.map((rating) => (
            <Checkbox
              key={rating?.id}
              label={rating?.label}
              checked={localFilters?.ratings?.includes(rating?.value) || false}
              onChange={(e) => handleFilterChange('ratings', rating?.value, e?.target?.checked)}
            />
          ))}
        </div>
      </FilterSection>

      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={handleClearFilters} fullWidth>
          Clear All
        </Button>
        <Button onClick={handleApplyFilters} fullWidth>
          Apply Filters
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {isOpen && (
          <div className="fixed inset-0 z-50 bg-background">
            <div className="h-full overflow-y-auto p-4">
              {content}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft h-fit sticky top-20">
      {content}
    </div>
  );
};

export default FilterSidebar;