import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const VenueImageGallery = ({ images, venueName }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images?.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images?.length) % images?.length);
  };

  const openFullscreen = () => {
    setIsFullscreenOpen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreenOpen(false);
  };

  return (
    <>
      {/* Main Gallery */}
      <div className="relative bg-card rounded-lg overflow-hidden shadow-soft">
        {/* Main Image */}
        <div className="relative h-64 md:h-80 lg:h-96">
          <Image
            src={images?.[currentImageIndex]}
            alt={`${venueName} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover cursor-pointer"
            onClick={openFullscreen}
          />
          
          {/* Navigation Arrows */}
          {images?.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-smooth"
                aria-label="Previous image"
              >
                <Icon name="ChevronLeft" size={20} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-smooth"
                aria-label="Next image"
              >
                <Icon name="ChevronRight" size={20} />
              </button>
            </>
          )}

          {/* Fullscreen Button */}
          <button
            onClick={openFullscreen}
            className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-smooth"
            aria-label="View fullscreen"
          >
            <Icon name="Maximize2" size={16} />
          </button>

          {/* Image Counter */}
          {images?.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {images?.length}
            </div>
          )}
        </div>

        {/* Thumbnail Navigation - Desktop Only */}
        {images?.length > 1 && (
          <div className="hidden md:flex p-4 space-x-2 overflow-x-auto">
            {images?.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-smooth ${
                  index === currentImageIndex
                    ? 'border-primary' :'border-transparent hover:border-border'
                }`}
              >
                <Image
                  src={image}
                  alt={`${venueName} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Fullscreen Modal */}
      {isFullscreenOpen && (
        <div className="fixed inset-0 z-1050 bg-black/90 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={closeFullscreen}
              className="absolute top-4 right-4 w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-smooth z-10"
              aria-label="Close fullscreen"
            >
              <Icon name="X" size={24} />
            </button>

            {/* Navigation in Fullscreen */}
            {images?.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-smooth"
                  aria-label="Previous image"
                >
                  <Icon name="ChevronLeft" size={24} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-smooth"
                  aria-label="Next image"
                >
                  <Icon name="ChevronRight" size={24} />
                </button>
              </>
            )}

            {/* Fullscreen Image */}
            <Image
              src={images?.[currentImageIndex]}
              alt={`${venueName} - Fullscreen view`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Image Counter in Fullscreen */}
            {images?.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 text-white px-4 py-2 rounded-full text-sm">
                {currentImageIndex + 1} / {images?.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default VenueImageGallery;