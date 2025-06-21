
import React, { useState } from 'react';
import FilterPopup from './components/FilterPopup'; 
import { foodItems as initialFoodItems, categories as allCategories, dietaryOptions as allDietaryOptions } from './data/foodData';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'; 

const StarIcon = ({ filled, className = "w-4 h-4", onClick, onMouseEnter, onMouseLeave }) => (
  <svg
    className={`${className} ${filled ? 'text-yellow-400' : 'text-gray-300'} cursor-pointer transition-colors hover:scale-110`}
    fill="currentColor"
    viewBox="0 0 20 20"
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const CustomStarRating = ({ value, onChange, size = "w-6 h-6" }) => {
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

const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating_desc', label: 'Highest Rated' },
];

function App() {
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
  const [displayedFoodItems, setDisplayedFoodItems] = useState(initialFoodItems);

  const [priceMax, setPriceMax] = useState(50); 
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedDietary, setSelectedDietary] = useState([]);
  const [sortBy, setSortBy] = useState(sortOptions[0].value);

  const openFilterPopup = () => setIsFilterPopupOpen(true);
  const closeFilterPopup = () => setIsFilterPopupOpen(false);

  const handlePriceChange = (value) => { 
    setPriceMax(value);
  };

  const toggleCuisine = (cuisine) => {
    setSelectedCuisines(prev =>
      prev.includes(cuisine) ? prev.filter(c => c !== cuisine) : [...prev, cuisine]
    );
  };

  const toggleDietary = (dietOption) => {
    setSelectedDietary(prev =>
      prev.includes(dietOption) ? prev.filter(d => d !== dietOption) : [...prev, dietOption]
    );
  };
  
  const applyFilters = () => {
    let filtered = [...initialFoodItems];

    filtered = filtered.filter(item => item.price <= priceMax);

    if (selectedRating > 0) {
      filtered = filtered.filter(item => Math.round(item.rating) >= selectedRating);
    }

    if (selectedCuisines.length > 0) {
      filtered = filtered.filter(item => selectedCuisines.includes(item.category));
    }

    if (selectedDietary.length > 0) {
      filtered = filtered.filter(item =>
        selectedDietary.every(diet => item.dietary.includes(diet))
      );
    }
    
    switch (sortBy) {
        case 'price_asc':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price_desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'rating_desc':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
        default: 
            filtered.sort((a, b) => b.rating - a.rating); 
            break;
    }

    setDisplayedFoodItems(filtered);
    closeFilterPopup();
  };

  const resetFilters = () => {
    setPriceMax(50);
    setSelectedRating(0);
    setSelectedCuisines([]);
    setSelectedDietary([]);
    setSortBy(sortOptions[0].value);
    setDisplayedFoodItems(initialFoodItems);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">
            <span className="text-red-500">Food</span>Hub
          </h1>
          <p className="text-lg text-gray-600 mt-2">Your favorite meals, delivered fast.</p>
        </header>
        
        {displayedFoodItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedFoodItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out">
                <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover"/>
                <div className="p-5">
                    <h3 className="font-semibold text-xl text-gray-800 mb-1 truncate" title={item.name}>{item.name}</h3>
                    <p className="text-gray-500 text-sm mb-3 h-10 overflow-hidden text-ellipsis">{item.description}</p>
                    <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-lg text-red-500">${item.price.toFixed(2)}</span>
                    <div className="flex items-center">
                        <CustomStarRating value={Math.round(item.rating)} />
                        <span className="ml-1.5 text-sm text-gray-500">({item.rating.toFixed(1)})</span>
                    </div>
                    </div>
                    <div className="text-xs text-gray-500 mb-3">
                    <span className="font-medium">{item.category}</span> • {item.deliveryTime}
                    </div>
                    <button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">
                    Add to Cart
                    </button>
                </div>
                </div>
            ))}
            </div>
        ) : (
            <div className="text-center py-10">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2a4 4 0 00-4-4H2a2 2 0 00-2 2v2a2 2 0 002 2h1a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No Results Found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search criteria.</p>
                <div className="mt-6">
                    <button type="button" onClick={resetFilters} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Clear All Filters
                    </button>
                </div>
            </div>
        )}

        <div className="fixed bottom-6 right-6 z-30">
          <button onClick={openFilterPopup} className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-full shadow-xl transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 flex items-center" aria-label="Open filters">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
            Filters
          </button>
        </div>
      </div>

      <FilterPopup 
        isOpen={isFilterPopupOpen} 
        onClose={closeFilterPopup}
        onApply={applyFilters}
        onReset={resetFilters}
      >
        <div className="space-y-6 pb-6">
          {/* Price Range */}
          <div>
            <h3 className="text-base font-medium text-gray-700 mb-2">Price Range (Max)</h3>
            <div className="px-1"> 
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
            <div className="text-center text-sm text-gray-600 mt-3">Up to: ${priceMax}</div>
          </div>

          {/* Rating */}
          <div>
            <h3 className="text-base font-medium text-gray-700 mb-2">Minimum Rating</h3>
            <div className="flex justify-center sm:justify-start items-center">
              <CustomStarRating value={selectedRating} onChange={setSelectedRating} />
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200"><h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">More Options</h2></div>
          
          {/* Cuisine Type */}
          <div>
            <h3 className="text-base font-medium text-gray-700 mb-2">Cuisine Type</h3>
            <div className="flex flex-wrap gap-2">
              {allCategories.map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => toggleCuisine(cuisine)}
                  className={`px-3 py-2 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-offset-1
                              ${selectedCuisines.includes(cuisine) 
                                ? 'bg-red-500 text-white border-red-500 hover:bg-red-600' 
                                : 'text-gray-700 border-gray-300 hover:bg-red-50 hover:border-red-400 focus:ring-red-500'
                              }`}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>

          {/* Dietary Preferences */}
          <div>
            <h3 className="text-base font-medium text-gray-700 mb-2">Dietary</h3>
            <div className="space-y-2">
              {allDietaryOptions.map((diet) => (
                <label key={diet} className={`flex items-center space-x-3 p-2.5 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors
                                            ${selectedDietary.includes(diet) ? 'border-red-500 bg-red-50 ring-1 ring-red-500' : 'border-gray-200'}`}>
                  <input 
                    type="checkbox" 
                    checked={selectedDietary.includes(diet)}
                    onChange={() => toggleDietary(diet)}
                    className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500 focus:ring-offset-0" 
                  />
                  <span className="text-sm text-gray-700">{diet}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <h3 className="text-base font-medium text-gray-700 mb-2">Sort By</h3>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 bg-white rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
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