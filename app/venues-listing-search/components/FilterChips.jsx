import React from 'react';
import Button from 'app/components/ui/Button';
import Icon from 'app/components/AppIcon';

const FilterChips = ({ activeFilters, onRemoveFilter, onClearAll }) => {
  const getFilterChips = () => {
    const chips = [];

    // Sport filters
    if (activeFilters?.sports?.length > 0) {
      activeFilters?.sports?.forEach(sport => {
        chips?.push({
          id: `sport-${sport}`,
          label: sport?.charAt(0)?.toUpperCase() + sport?.slice(1),
          category: 'sports',
          value: sport
        });
      });
    }

    // Venue type filters
    if (activeFilters?.venueTypes?.length > 0) {
      activeFilters?.venueTypes?.forEach(type => {
        chips?.push({
          id: `venue-${type}`,
          label: type?.charAt(0)?.toUpperCase() + type?.slice(1),
          category: 'venueTypes',
          value: type
        });
      });
    }

    // Price range filters
    if (activeFilters?.priceRanges?.length > 0) {
      const priceLabels = {
        budget: 'Under $25/hour',
        moderate: '$25-$50/hour',
        premium: '$50-$100/hour',
        luxury: 'Over $100/hour'
      };
      
      activeFilters?.priceRanges?.forEach(range => {
        chips?.push({
          id: `price-${range}`,
          label: priceLabels?.[range],
          category: 'priceRanges',
          value: range
        });
      });
    }

    // Rating filters
    if (activeFilters?.ratings?.length > 0) {
      activeFilters?.ratings?.forEach(rating => {
        chips?.push({
          id: `rating-${rating}`,
          label: `${rating}+ Stars`,
          category: 'ratings',
          value: rating
        });
      });
    }

    return chips;
  };

  const chips = getFilterChips();

  if (chips?.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-foreground">Active Filters</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClearAll}
          className="text-muted-foreground hover:text-foreground"
        >
          Clear All
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {chips?.map((chip) => (
          <div
            key={chip?.id}
            className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm"
          >
            <span>{chip?.label}</span>
            <button
              onClick={() => onRemoveFilter(chip?.category, chip?.value)}
              className="hover:bg-primary/20 rounded-full p-0.5 transition-smooth"
            >
              <Icon name="X" size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterChips;