import React from 'react';
import VenueCard from './VenueCard';
import VenueCardSkeleton from './VenueCardSkeleton';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VenueGrid = ({ venues, loading, hasMore, onLoadMore }) => {
  if (loading && venues?.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, index) => (
          <VenueCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (venues?.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
          <Icon name="Search" size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No venues found</h3>
        <p className="text-muted-foreground mb-4">
          Try adjusting your search criteria or filters to find more venues.
        </p>
        <Button variant="outline" onClick={() => window.location?.reload()}>
          Reset Search
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues?.map((venue) => (
          <VenueCard key={venue?.id} venue={venue} />
        ))}
      </div>
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <VenueCardSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      )}
      {hasMore && !loading && (
        <div className="text-center py-8">
          <Button onClick={onLoadMore} variant="outline" size="lg">
            Load More Venues
          </Button>
        </div>
      )}
    </div>
  );
};

export default VenueGrid;