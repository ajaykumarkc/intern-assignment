import { useState } from 'react'
import FilterPopup from './components/FilterPopup'

function App() {
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false)

  const openFilterPopup = () => setIsFilterPopupOpen(true)
  const closeFilterPopup = () => setIsFilterPopupOpen(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Debug Info */}
      <div className="fixed top-4 left-4 bg-black text-white p-2 rounded z-50">
        Filter Popup: {isFilterPopupOpen ? 'Open' : 'Closed'}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Food Delivery App
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow-md p-4">
              <div className="w-full h-32 bg-gray-200 rounded-lg mb-3"></div>
              <h3 className="font-semibold text-lg mb-2">Food Item {item}</h3>
              <p className="text-gray-600 mb-2">Delicious food description here</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-green-600">$12.99</span>
                <span className="text-sm text-gray-500">⭐ 4.5</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={openFilterPopup}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-colors"
          >
            Open Filters
          </button>
        </div>
      </div>

      {/* Filter Popup */}
      <FilterPopup isOpen={isFilterPopupOpen} onClose={closeFilterPopup}>
        {/* Content for the Filter Popup */}
        <div className="space-y-4">
          {/* Basic Filters - Always visible */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Price Range</h3>
            <div className="flex items-center space-x-4">
              <input 
                type="range" 
                min="0" 
                max="50" 
                defaultValue="25"
                className="flex-1 accent-blue-600"
              />
              <span className="text-sm text-gray-600">$0 - $50</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Rating</h3>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className="text-2xl text-gray-300 hover:text-yellow-400 transition-colors"
                >
                  <svg 
                    className="w-6 h-6" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Additional Filters - Only visible in expanded state */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div>
              <h3 className="font-semibold text-lg mb-3">Cuisine Type</h3>
              <div className="grid grid-cols-2 gap-2">
                {['Italian', 'Chinese', 'Mexican', 'Indian', 'Japanese', 'American'].map((cuisine) => (
                  <button
                    key={cuisine}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100 transition-colors"
                  >
                    {cuisine}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Dietary</h3>
              <div className="grid grid-cols-2 gap-2">
                {['Vegetarian', 'Vegan', 'Gluten-Free', 'Halal'].map((diet) => (
                  <label key={diet} className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg">
                    <input type="checkbox" className="h-4 w-4 text-blue-600 rounded border-gray-300" />
                    <span className="text-gray-700 text-sm">{diet}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Sort By</h3>
              <select className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Relevance</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating</option>
                <option>Delivery Time</option>
              </select>
            </div>
          </div>
        </div>
      </FilterPopup>
    </div>
  )
}

export default App;