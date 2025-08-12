import React, { useState } from 'react';
import Button from 'app/components/ui/Button';
import Input from 'app/components/ui/Input';
import Icon from 'app/components/AppIcon';
import { apiFetch } from '@/lib/apiClient';

const WriteReviewModal = ({ isOpen, onClose, facilityId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Process files to get both URL for preview and base64 for storage
    const processedImages = await Promise.all(files.map(async (file) => {
      // Create URL for preview
      const previewUrl = URL.createObjectURL(file);
      
      // Convert file to base64 for MongoDB storage
      const base64Data = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
      
      return {
        previewUrl,
        data: base64Data,
        contentType: file.type
      };
    }));
    
    // Update preview URLs for UI display
    const newImagePreviews = processedImages.map(img => img.previewUrl);
    setImages(prev => [...prev, ...newImagePreviews]);
    
    // Store the processed image data for submission
    setImageFiles(prev => [...prev, ...processedImages]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare images for MongoDB storage
      let processedImages = [];
      
      if (imageFiles.length > 0) {
        // Extract the data and contentType from each processed image
        processedImages = imageFiles.map(file => ({
          data: file.data,
          contentType: file.contentType
        }));
      }

      // Create the review with binary image data
      const response = await apiFetch('/api/reviews', {
        method: 'POST',
        body: {
          facilityId,
          rating,
          comment,
          images: processedImages
        }
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
        // Optionally refresh the page or update the reviews list
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.error || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        type="button"
        onClick={() => handleRatingChange(index + 1)}
        className="text-2xl focus:outline-none transition-smooth"
      >
        <Icon
          name="Star"
          size={32}
          className={`${index < rating ? 'text-warning fill-current' : 'text-muted-foreground'}`}
        />
      </button>
    ));
  };

  return (
    <div className="fixed inset-0 z-1050 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-card border border-border rounded-lg shadow-elevated max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Write a Review</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-accent rounded-md transition-smooth"
            disabled={isSubmitting}
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Content */}
        {success ? (
          <div className="p-6 text-center">
            <div className="mb-4 text-success">
              <Icon name="CheckCircle" size={48} />
            </div>
            <h3 className="text-lg font-medium mb-2">Thank You!</h3>
            <p className="text-muted-foreground">Your review has been submitted successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6">
              {error && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive p-4 rounded-lg">
                  <div className="flex items-center">
                    <Icon name="AlertTriangle" className="mr-2" />
                    <p>{error}</p>
                  </div>
                </div>
              )}

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium mb-2">Your Rating *</label>
                <div className="flex space-x-1">
                  {renderStars()}
                </div>
              </div>

              {/* Comment */}
              <div>
                <Input
                  label="Your Review"
                  as="textarea"
                  rows={4}
                  placeholder="Share your experience with this facility..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Add Photos</label>
                <div className="flex items-center mb-2">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="flex-1 p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                
                {images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {images.map((url, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={url} 
                          alt={`Review photo ${index + 1}`} 
                          className="w-16 h-16 object-cover rounded-md border border-border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Icon name="X" size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                disabled={isSubmitting}
                loading={isSubmitting}
                iconName="Send"
                iconPosition="left"
              >
                Submit Review
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default WriteReviewModal;