"use client";
import React, { useState, useEffect, useCallback } from 'react';
import NavigationHeader from '../../components/layout/NavigationHeader';
import SearchBar from './components/SearchBar';
import FilterSidebar from './components/FilterSidebar';
import FilterChips from './components/FilterChips';
import SortAndView from './components/SortAndView';
import VenueGrid from './components/VenueGrid';
import MapView from './components/MapView';
import QuickFilters from './components/QuickFilters';
import { apiFetch } from '@/lib/apiClient';

const VenuesListingSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('list');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    sports: [],
    venueTypes: [],
    priceRanges: [],
    ratings: []
  });

  const [allVenues, setAllVenues] = useState([]);

  const [filteredVenues, setFilteredVenues] = useState(allVenues);
  const [displayedVenues, setDisplayedVenues] = useState([]);

  // Fetch venues
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await apiFetch(`/api/facilities?approved=true&page=1&limit=100`, { method: 'GET', auth: false });
      if (!cancelled) setAllVenues((res?.data || []).map((v) => ({
        id: v._id,
        name: v.name,
        image: (v.photos && v.photos[0]) || '/assets/images/no_image.png',
        rating: v.rating || 0,
        reviewCount: Math.round((v.rating || 0) * 20),
        location: v.locationShort || '',
        sports: v.sports || [],
        priceRange: { min: v.startingPrice || 0, max: (v.startingPrice || 0) + 200 },
        openHours: '06:00 - 22:00'
      })));
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // Filter and search logic
  const applyFiltersAndSearch = useCallback(() => {
    let filtered = [...allVenues];
    // ... (keep the filtering logic as in your original file)
    setFilteredVenues(filtered);
    setCurrentPage(1);
  }, [searchQuery, locationQuery, filters, sortBy, allVenues]);

  // Update displayed venues based on pagination
  useEffect(() => {
    const itemsPerPage = 9;
    const startIndex = 0;
    const endIndex = currentPage * itemsPerPage;
    const newDisplayed = filteredVenues?.slice(startIndex, endIndex);
    setDisplayedVenues(newDisplayed);
    setHasMore(endIndex < filteredVenues?.length);
  }, [filteredVenues, currentPage]);

  // Apply filters when they change
  useEffect(() => {
    applyFiltersAndSearch();
  }, [applyFiltersAndSearch]);

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      setLoading(false);
    }, 1000);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setIsMobileFilterOpen(false);
  };

  const handleRemoveFilter = (category, value) => {
    const newFilters = { ...filters };
    newFilters[category] = newFilters?.[category]?.filter(item => item !== value);
    setFilters(newFilters);
  };

  const handleClearAllFilters = () => {
    setFilters({
      sports: [],
      venueTypes: [],
      priceRanges: [],
      ratings: []
    });
  };

  const handleQuickFilter = (category, value) => {
    const newFilters = { ...filters };
    if (!newFilters?.[category]) {
      newFilters[category] = [];
    }
    const isActive = newFilters?.[category]?.includes(value);
    if (isActive) {
      newFilters[category] = newFilters?.[category]?.filter(item => item !== value);
    } else {
      newFilters[category] = [...newFilters?.[category], value];
    }
    setFilters(newFilters);
  };

  const hasActiveFilters = Object.values(filters)?.some(filterArray => filterArray?.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Section */}
          <div className="mb-6">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Find Your Perfect Sports Venue
              </h1>
              <p className="text-muted-foreground">
                Discover and book sports facilities near you
              </p>
            </div>
            <SearchBar
              onSearch={setSearchQuery}
              searchValue={searchQuery}
              onLocationChange={setLocationQuery}
              locationValue={locationQuery}
            />
          </div>
          {/* Quick Filters - Mobile */}
          <div className="mb-6 lg:hidden">
            <QuickFilters
              activeFilters={filters}
              onQuickFilter={handleQuickFilter}
            />
          </div>
          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="mb-6">
              <FilterChips
                activeFilters={filters}
                onRemoveFilter={handleRemoveFilter}
                onClearAll={handleClearAllFilters}
              />
            </div>
          )}
          {/* Sort and View Controls */}
          <div className="mb-6">
            <SortAndView
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              resultsCount={filteredVenues?.length}
              onFilterToggle={() => setIsMobileFilterOpen(true)}
              isMobile={typeof window !== 'undefined' && window.innerWidth < 1024}
            />
          </div>
          <div className="flex gap-8">
            {/* Desktop Filter Sidebar */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="mb-6">
                <QuickFilters
                  activeFilters={filters}
                  onQuickFilter={handleQuickFilter}
                />
              </div>
              <FilterSidebar
                filters={filters}
                onFiltersChange={handleFiltersChange}
                isOpen={true}
                onClose={() => {}}
              />
            </div>
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {viewMode === 'list' ? (
                <VenueGrid
                  venues={displayedVenues}
                  loading={loading}
                  hasMore={hasMore}
                  onLoadMore={handleLoadMore}
                />
              ) : (
                <MapView
                  venues={filteredVenues}
                  onVenueSelect={setSelectedVenue}
                  selectedVenue={selectedVenue}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      {/* Mobile Filter Sidebar */}
      <FilterSidebar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        isMobile={true}
      />
    </div>
  );
};

export default VenuesListingSearch;
