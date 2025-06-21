import React from 'react';

const ActiveFilters = ({ filters, onClearAll }) => {
  const { selectedRating, selectedCuisines, selectedDietary, priceMax, sortBy, sortOptions } = filters;
  
  const hasActiveFilters = selectedRating > 0 || selectedCuisines.length > 0 || selectedDietary.length > 0 || priceMax < 50 || sortBy !== sortOptions[0].value;

  if (!hasActiveFilters) return null;

  return (
    <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-gray-300 text-sm font-medium">Active Filters:</span>
          {selectedRating > 0 && (
            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
              ⭐ {selectedRating}+ stars
            </span>
          )}
          {selectedCuisines.map(cuisine => (
            <span key={cuisine} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
              {cuisine}
            </span>
          ))}
          {selectedDietary.map(diet => (
            <span key={diet} className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
              {diet}
            </span>
          ))}
          {priceMax < 50 && (
            <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
              Under ${priceMax}
            </span>
          )}
        </div>
        <button
          onClick={onClearAll}
          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default ActiveFilters; 