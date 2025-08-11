import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import NavigationHeader from '../../components/ui/NavigationHeader';
import SearchBar from './components/SearchBar';
import FilterSidebar from './components/FilterSidebar';
import FilterChips from './components/FilterChips';
import SortAndView from './components/SortAndView';
import VenueGrid from './components/VenueGrid';
import MapView from './components/MapView';
import QuickFilters from './components/QuickFilters';


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

  // Mock venues data
  const [allVenues] = useState([
    {
      id: 1,
      name: "Downtown Sports Complex",
      location: "123 Main St, New York, NY 10001",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
      rating: 4.8,
      reviewCount: 124,
      sports: ['basketball', 'tennis', 'badminton'],
      priceRange: { min: 25, max: 45 },
      openHours: "6:00 AM - 11:00 PM",
      isNew: true,
      isFavorite: false,
      venueType: 'indoor'
    },
    {
      id: 2,
      name: "Central Park Tennis Courts",
      location: "Central Park, New York, NY 10024",
      image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=500",
      rating: 4.5,
      reviewCount: 89,
      sports: ['tennis'],
      priceRange: { min: 30, max: 60 },
      openHours: "7:00 AM - 9:00 PM",
      isNew: false,
      isFavorite: true,
      venueType: 'outdoor'
    },
    {
      id: 3,
      name: "Elite Fitness & Sports",
      location: "456 Broadway, New York, NY 10013",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500",
      rating: 4.7,
      reviewCount: 156,
      sports: ['basketball', 'volleyball', 'badminton'],
      priceRange: { min: 35, max: 55 },
      openHours: "5:00 AM - 12:00 AM",
      isNew: false,
      isFavorite: false,
      venueType: 'indoor'
    },
    {
      id: 4,
      name: "Riverside Swimming Pool",
      location: "789 River Dr, New York, NY 10002",
      image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500",
      rating: 4.3,
      reviewCount: 67,
      sports: ['swimming'],
      priceRange: { min: 20, max: 35 },
      openHours: "6:00 AM - 10:00 PM",
      isNew: false,
      isFavorite: false,
      venueType: 'indoor'
    },
    {
      id: 5,
      name: "Brooklyn Basketball Courts",
      location: "321 Brooklyn Ave, Brooklyn, NY 11201",
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500",
      rating: 4.2,
      reviewCount: 43,
      sports: ['basketball'],
      priceRange: { min: 15, max: 25 },
      openHours: "8:00 AM - 8:00 PM",
      isNew: false,
      isFavorite: true,
      venueType: 'outdoor'
    },
    {
      id: 6,
      name: "Manhattan Squash Club",
      location: "654 Park Ave, New York, NY 10065",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
      rating: 4.9,
      reviewCount: 201,
      sports: ['squash', 'tennis'],
      priceRange: { min: 50, max: 80 },
      openHours: "6:00 AM - 11:00 PM",
      isNew: false,
      isFavorite: false,
      venueType: 'indoor'
    },
    {
      id: 7,
      name: "Queens Cricket Ground",
      location: "987 Queens Blvd, Queens, NY 11373",
      image: "https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?w=500",
      rating: 4.1,
      reviewCount: 38,
      sports: ['cricket'],
      priceRange: { min: 40, max: 70 },
      openHours: "9:00 AM - 6:00 PM",
      isNew: true,
      isFavorite: false,
      venueType: 'outdoor'
    },
    {
      id: 8,
      name: "Bronx Multi-Sport Arena",
      location: "147 Bronx St, Bronx, NY 10451",
      image: "https://images.pixabay.com/photo/2016/11/29/13/14/basketball-1868184_1280.jpg?w=500",
      rating: 4.4,
      reviewCount: 92,
      sports: ['basketball', 'volleyball', 'badminton', 'tennis'],
      priceRange: { min: 28, max: 48 },
      openHours: "7:00 AM - 10:00 PM",
      isNew: false,
      isFavorite: false,
      venueType: 'indoor'
    },
    {
      id: 9,
      name: "Staten Island Football Field",
      location: "258 Victory Blvd, Staten Island, NY 10301",
      image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=500",
      rating: 4.0,
      reviewCount: 29,
      sports: ['football'],
      priceRange: { min: 60, max: 100 },
      openHours: "8:00 AM - 8:00 PM",
      isNew: false,
      isFavorite: false,
      venueType: 'outdoor'
    }
  ]);

  const [filteredVenues, setFilteredVenues] = useState(allVenues);
  const [displayedVenues, setDisplayedVenues] = useState([]);

  // Filter and search logic
  const applyFiltersAndSearch = useCallback(() => {
    let filtered = [...allVenues];

    // Apply search query
    if (searchQuery?.trim()) {
      filtered = filtered?.filter(venue =>
        venue?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        venue?.sports?.some(sport => sport?.toLowerCase()?.includes(searchQuery?.toLowerCase())) ||
        venue?.location?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    // Apply location filter
    if (locationQuery?.trim()) {
      filtered = filtered?.filter(venue =>
        venue?.location?.toLowerCase()?.includes(locationQuery?.toLowerCase())
      );
    }

    // Apply sport filters
    if (filters?.sports?.length > 0) {
      filtered = filtered?.filter(venue =>
        filters?.sports?.some(sport => venue?.sports?.includes(sport))
      );
    }

    // Apply venue type filters
    if (filters?.venueTypes?.length > 0) {
      filtered = filtered?.filter(venue =>
        filters?.venueTypes?.includes(venue?.venueType)
      );
    }

    // Apply price range filters
    if (filters?.priceRanges?.length > 0) {
      filtered = filtered?.filter(venue => {
        return filters?.priceRanges?.some(range => {
          switch (range) {
            case 'budget':
              return venue?.priceRange?.max <= 25;
            case 'moderate':
              return venue?.priceRange?.min >= 25 && venue?.priceRange?.max <= 50;
            case 'premium':
              return venue?.priceRange?.min >= 50 && venue?.priceRange?.max <= 100;
            case 'luxury':
              return venue?.priceRange?.min >= 100;
            default:
              return true;
          }
        });
      });
    }

    // Apply rating filters
    if (filters?.ratings?.length > 0) {
      const minRating = Math.min(...filters?.ratings);
      filtered = filtered?.filter(venue => venue?.rating >= minRating);
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a?.priceRange?.min - b?.priceRange?.min;
        case 'price-high':
          return b?.priceRange?.max - a?.priceRange?.max;
        case 'rating':
          return b?.rating - a?.rating;
        case 'newest':
          return b?.isNew - a?.isNew;
        case 'distance':
          return 0; // Mock sorting
        default:
          return 0;
      }
    });

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
    <>
      <Helmet>
        <title>Find Sports Venues - QuickCourt</title>
        <meta name="description" content="Discover and book sports facilities near you. Search through hundreds of venues for basketball, tennis, badminton, and more." />
      </Helmet>
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
                isMobile={window.innerWidth < 1024}
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
    </>
  );
};

export default VenuesListingSearch;