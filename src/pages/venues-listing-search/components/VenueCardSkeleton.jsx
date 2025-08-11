import React from 'react';

const VenueCardSkeleton = () => {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-soft animate-pulse">
      <div className="aspect-video bg-muted"></div>
      
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="h-6 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-16"></div>
        </div>
        
        <div className="h-4 bg-muted rounded w-2/3"></div>
        
        <div className="flex gap-2">
          <div className="h-6 bg-muted rounded w-16"></div>
          <div className="h-6 bg-muted rounded w-20"></div>
          <div className="h-6 bg-muted rounded w-18"></div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="h-4 bg-muted rounded w-24"></div>
          <div className="text-right">
            <div className="h-6 bg-muted rounded w-20 mb-1"></div>
            <div className="h-3 bg-muted rounded w-12"></div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="h-8 bg-muted rounded flex-1"></div>
          <div className="h-8 bg-muted rounded flex-1"></div>
        </div>
      </div>
    </div>
  );
};

export default VenueCardSkeleton;