import React, { useState } from 'react';
import Icon from 'app/components/AppIcon';
import Image from 'app/components/AppImage';
import Button from 'app/components/ui/Button';

const ReviewsSection = ({ reviews, overallRating, ratingDistribution, onWriteReview }) => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const displayedReviews = showAllReviews ? reviews : reviews?.slice(0, 3);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={16}
        className={`${
          index < rating 
            ? 'text-warning fill-current' :'text-muted-foreground'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Reviews & Ratings</h2>
        <Button
          variant="outline"
          iconName="Edit3"
          iconPosition="left"
          onClick={onWriteReview}
        >
          Write Review
        </Button>
      </div>
      {/* Rating Overview */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overall Rating */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
              <span className="text-3xl font-bold text-foreground">{overallRating}</span>
              <div className="flex space-x-1">
                {renderStars(Math.floor(overallRating))}
              </div>
            </div>
            <p className="text-muted-foreground">
              Based on {reviews?.length} review{reviews?.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1]?.map((rating) => {
              const count = ratingDistribution?.[rating] || 0;
              const percentage = reviews?.length > 0 ? (count / reviews?.length) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center space-x-2 text-sm">
                  <span className="w-3 text-muted-foreground">{rating}</span>
                  <Icon name="Star" size={12} className="text-warning fill-current" />
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className="bg-warning h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-muted-foreground text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Individual Reviews */}
      <div className="space-y-4">
        {displayedReviews?.map((review) => (
          <div key={review?.id} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                {review?.userAvatar ? (
                  <Image
                    src={review?.userAvatar}
                    alt={review?.userName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon name="User" size={20} className="text-muted-foreground" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-foreground">{review?.userName}</h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        {renderStars(review?.rating)}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(review?.date)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {review?.comment}
                </p>

                {/* Review Images */}
                {review?.images && review?.images?.length > 0 && (
                  <div className="flex space-x-2 mt-3">
                    {review?.images?.map((image, index) => (
                      <div key={index} className="w-16 h-16 rounded-md overflow-hidden">
                        <Image
                          src={image}
                          alt={`Review image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Helpful Actions */}
                <div className="flex items-center space-x-4 mt-3 pt-3 border-t border-border">
                  <button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground transition-smooth">
                    <Icon name="ThumbsUp" size={14} />
                    <span>Helpful ({review?.helpfulCount || 0})</span>
                  </button>
                  <button className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Show More/Less Button */}
      {reviews?.length > 3 && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => setShowAllReviews(!showAllReviews)}
          >
            {showAllReviews ? 'Show Less Reviews' : `Show All ${reviews?.length} Reviews`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;