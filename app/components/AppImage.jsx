import React from 'react';

function Image({
  src,
  imageData,
  contentType,
  alt = "Image Name",
  className = "",
  ...props
}) {
  // Convert binary data to base64 URL if imageData is provided
  const getImageSrc = () => {
    if (imageData && contentType) {
      // If imageData is a Buffer object from MongoDB
      if (typeof imageData === 'object' && imageData.type === 'Buffer') {
        return `data:${contentType};base64,${Buffer.from(imageData).toString('base64')}`;
      }
      // If imageData is already a base64 string
      else if (typeof imageData === 'string') {
        return `data:${contentType};base64,${imageData}`;
      }
    }
    // Fallback to src prop if provided
    return src;
  };

  return (
    <img
      src={getImageSrc() || src}
      alt={alt}
      className={className}
      onError={(e) => {
        e.target.style.display = 'none';
      }}
      {...props}
    />
  );
}

export default Image;
