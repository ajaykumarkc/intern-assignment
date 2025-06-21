import React, { useState, useEffect } from 'react';
import FilterPopup from './components/FilterPopup';
import FoodCard from './components/FoodCard';
import ActiveFilters from './components/ActiveFilters';
import { CustomStarRating } from './components/StarRating';
import { useLocalStorage } from './hooks/useLocalStorage';
import { applyFilters, sortOptions } from './utils/filterUtils';
import { foodItems as initialFoodItems, categories as allCategories, dietaryOptions as allDietaryOptions } from './data/foodData';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

function App() {
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
  const [displayedFoodItems, setDisplayedFoodItems] = useState(initialFoodItems);

  const defaultFilters = {
    priceMax: 50,
    selectedRating: 0,
    selectedCuisines: [],
    selectedDietary: [],
    sortBy: sortOptions[0].value
  };

  const [filters, setFilters] = useLocalStorage(defaultFilters);
  const { priceMax, selectedRating, selectedCuisines, selectedDietary, sortBy } = filters;

  const openFilterPopup = () => setIsFilterPopupOpen(true);
  const closeFilterPopup = () => setIsFilterPopupOpen(false);

  const handlePriceChange = (value) => {
    setFilters(prev => ({ ...prev, priceMax: value }));
  };

  const toggleCuisine = (cuisine) => {
    setFilters(prev => ({
      ...prev,
      selectedCuisines: prev.selectedCuisines.includes(cuisine) 
        ? prev.selectedCuisines.filter(c => c !== cuisine) 
        : [...prev.selectedCuisines, cuisine]
    }));
  };

  const toggleDietary = (dietOption) => {
    setFilters(prev => ({
      ...prev,
      selectedDietary: prev.selectedDietary.includes(dietOption) 
        ? prev.selectedDietary.filter(d => d !== dietOption) 
        : [...prev.selectedDietary, dietOption]
    }));
  };
  
  const handleApplyFilters = () => {
    const filtered = applyFilters(initialFoodItems, filters);
    setDisplayedFoodItems(filtered);
    closeFilterPopup();
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setDisplayedFoodItems(initialFoodItems);
  };

  useEffect(() => {
    const filtered = applyFilters(initialFoodItems, filters);
    setDisplayedFoodItems(filtered);
  }, [filters]);

  return (
    <div className="min-h-screen bg-gray-900" style={{ minHeight: '100vh' }}>
      <div className="container mx-auto px-4 py-12 pb-32">
        <header className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">
            <span className="text-red-500">Food</span>Hub
          </h1>
          <p className="text-lg text-gray-300 mt-2">Your favorite meals, delivered fast.</p>
        </header>

        <ActiveFilters 
          filters={{ ...filters, sortOptions }} 
          onClearAll={resetFilters} 
        />
        
        {displayedFoodItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedFoodItems.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <svg className="mx-auto h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2a4 4 0 00-4-4H2a2 2 0 00-2 2v2a2 2 0 002 2h1a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-white">No Results Found</h3>
            <p className="mt-1 text-sm text-gray-400">Try adjusting your filters or search criteria.</p>
            <div className="mt-6">
              <button 
                type="button" 
                onClick={resetFilters} 
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        <div className="fixed bottom-6 right-6 z-30">
          <button 
            onClick={openFilterPopup} 
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-full shadow-xl transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 flex items-center" 
            aria-label="Open filters"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
            </svg>
            Filters
          </button>
        </div>
      </div>

      <FilterPopup 
        isOpen={isFilterPopupOpen} 
        onClose={closeFilterPopup}
        onApply={handleApplyFilters}
        onReset={resetFilters}
      >
        <div className="space-y-4 sm:space-y-6 pb-4 sm:pb-6">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">Price Range (Max)</h3>
            <div className="px-2 sm:px-4 bg-gray-50 rounded-lg p-3 sm:p-4"> 
              <Slider
                min={0}
                max={100}
                value={priceMax}
                onChange={handlePriceChange}
                railStyle={{ backgroundColor: '#e5e7eb', height: '6px' }}
                trackStyle={{ backgroundColor: '#ef4444', height: '6px' }} 
                handleStyle={{
                  borderColor: '#ef4444',
                  height: '18px',
                  width: '18px',
                  marginTop: '-6px', 
                  backgroundColor: 'white',
                  opacity: 1,
                  boxShadow: '0 0 0 2px #ef444430' 
                }}
              />
            </div>
            <div className="text-center text-sm text-gray-600 mt-3 font-medium">
              Up to: <span className="text-red-500 font-bold">${priceMax}</span>
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">Minimum Rating</h3>
            <div className="flex justify-center sm:justify-start items-center bg-gray-50 rounded-lg p-3 sm:p-4">
              <CustomStarRating 
                value={selectedRating} 
                onChange={(value) => setFilters(prev => ({ ...prev, selectedRating: value }))} 
              />
            </div>
          </div>
          
          <div className="pt-3 sm:pt-4 border-t border-gray-200">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">More Options</h2>
          </div>
          
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">Cuisine Type</h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {allCategories.map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => toggleCuisine(cuisine)}
                  className={`px-3 sm:px-4 py-2 sm:py-3 border rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1
                              ${selectedCuisines.includes(cuisine) 
                                ? 'bg-red-500 text-white border-red-500 hover:bg-red-600 shadow-md scale-105' 
                                : 'text-gray-700 border-gray-300 hover:bg-red-50 hover:border-red-400 focus:ring-red-500 hover:scale-105'
                              }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">Dietary Preferences</h3>
            <div className="space-y-2 sm:space-y-3">
              {allDietaryOptions.map((diet) => (
                <label key={diet} className={`flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 border rounded-lg sm:rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:scale-105
                                            ${selectedDietary.includes(diet) ? 'border-red-500 bg-red-50 ring-1 ring-red-500' : 'border-gray-200'}`}>
                  <input 
                    type="checkbox" 
                    checked={selectedDietary.includes(diet)}
                    onChange={() => toggleDietary(diet)}
                    className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 border-gray-300 rounded focus:ring-red-500 focus:ring-offset-0" 
                  />
                  <span className="text-sm sm:text-base text-gray-700 font-medium">{diet}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">Sort By</h3>
            <select 
              value={sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 bg-white rounded-lg sm:rounded-xl text-sm sm:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-medium"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </FilterPopup>
    </div>
  );
}

export default App;