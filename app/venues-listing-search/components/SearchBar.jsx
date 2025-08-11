import React, { useState, useEffect } from 'react';
import Input from 'app/components/ui/Input';
import Icon from 'app/components/AppIcon';

const SearchBar = ({ onSearch, searchValue, onLocationChange, locationValue }) => {
  const [localSearch, setLocalSearch] = useState(searchValue || '');
  const [localLocation, setLocalLocation] = useState(locationValue || '');

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(localSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, onSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onLocationChange(localLocation);
    }, 300);

    return () => clearTimeout(timer);
  }, [localLocation, onLocationChange]);

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-soft">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Icon 
              name="Search" 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="text"
              placeholder="Search venues, sports, or facilities..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e?.target?.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="md:w-64">
          <div className="relative">
            <Icon 
              name="MapPin" 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="text"
              placeholder="Location or ZIP code"
              value={localLocation}
              onChange={(e) => setLocalLocation(e?.target?.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;