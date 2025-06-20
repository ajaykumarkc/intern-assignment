import { useState } from 'react'
import BottomSheet from './components/BottomSheet'

function App() {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)

  const openBottomSheet = () => setIsBottomSheetOpen(true)
  const closeBottomSheet = () => setIsBottomSheetOpen(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Food Delivery App
        </h1>
        
        {/* Sample Food Items */}
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

        {/* Open Bottom Sheet Button */}
        <div className="text-center">
          <button
            onClick={openBottomSheet}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-colors"
          >
            Open Filters
          </button>
        </div>
      </div>

      {/* Bottom Sheet */}
      <BottomSheet isOpen={isBottomSheetOpen} onClose={closeBottomSheet}>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-3">Price Range</h3>
            <div className="flex items-center space-x-4">
              <input 
                type="range" 
                min="0" 
                max="50" 
                className="flex-1"
              />
              <span className="text-sm text-gray-600">$0 - $50</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Cuisine Type</h3>
            <div className="grid grid-cols-2 gap-2">
              {['Italian', 'Chinese', 'Mexican', 'Indian', 'Japanese', 'American'].map((cuisine) => (
                <button
                  key={cuisine}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3">Rating</h3>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className="text-2xl text-yellow-400 hover:text-yellow-500 transition-colors"
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
        </div>
      </BottomSheet>
    </div>
  )
}

export default App
