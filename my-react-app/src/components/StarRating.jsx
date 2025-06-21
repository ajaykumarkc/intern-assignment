import React, { useState } from 'react';

const StarIcon = ({ filled, className = "w-4 h-4", onClick, onMouseEnter, onMouseLeave }) => (
  <svg
    data-testid="star"
    className={`${className} ${filled ? 'text-yellow-400' : 'text-gray-300'} ${onClick ? 'cursor-pointer transition-colors hover:scale-110' : ''}`}
    fill="currentColor"
    viewBox="0 0 20 20"
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export const DisplayStarRating = ({ value, size = "w-4 h-4" }) => (
  <div className="flex items-center space-x-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <StarIcon
        key={star}
        filled={star <= value}
        className={size}
      />
    ))}
  </div>
);

export const CustomStarRating = ({ value, onChange, size = "w-6 h-6" }) => {
  const [hoverValue, setHoverValue] = useState(0);

  const handleStarClick = (starValue) => {
    onChange(starValue === value ? 0 : starValue);
  };

  const handleStarHover = (starValue) => {
    setHoverValue(starValue);
  };

  const handleMouseLeave = () => {
    setHoverValue(0);
  };

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = hoverValue > 0 ? star <= hoverValue : star <= value;
        return (
          <StarIcon
            key={star}
            filled={isFilled}
            className={size}
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
            onMouseLeave={handleMouseLeave}
          />
        );
      })}
    </div>
  );
}; 