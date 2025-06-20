import React, { useState, useEffect, useCallback } from 'react';

const SNAP_POINTS = [
  0.8, // Full open (80% of viewport height)
  0.5, // Half open (50% of viewport height) 
  0.08 // Closed (8% of viewport height, just handle)
];

const getSheetY = (snapIndex, vh) => vh - vh * SNAP_POINTS[snapIndex];

const BottomSheet = ({ isOpen, onClose, children }) => {
  const [vh, setVh] = useState(window.innerHeight);
  const [snapIndex, setSnapIndex] = useState(2); // Start closed
  const [sheetY, setSheetY] = useState(getSheetY(2, window.innerHeight));
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Update vh on resize
  useEffect(() => {
    const handleResize = () => setVh(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const snapTo = useCallback((index) => {
    console.log('Snapping to index:', index);
    setIsTransitioning(true);
    setSnapIndex(index);
    const targetY = getSheetY(index, vh);
    setSheetY(targetY);
    
    setTimeout(() => {
      setIsTransitioning(false);
      if (index === 2) {
        onClose();
      }
    }, 300);
  }, [vh, onClose]);

  // Handle open/close from parent
  useEffect(() => {
    console.log('isOpen changed to:', isOpen);
    if (isOpen) {
      snapTo(1); // Open to half by default
    } else {
      snapTo(2); // Close
    }
  }, [isOpen, snapTo]);

  // Don't render if closed
  if (!isOpen && snapIndex === 2) return null;

  return (
    <>
      {/* Debug Info */}
      <div className="fixed top-4 right-4 bg-red-500 text-white p-2 rounded z-50 text-xs">
        Snap: {snapIndex} | Y: {Math.round(sheetY)} | VH: {vh}
      </div>

      {/* Backdrop */}
      {(snapIndex !== 2 || isTransitioning) && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => snapTo(2)}
        />
      )}
      
      {/* Bottom Sheet */}
      <div
        className="fixed left-0 right-0 bg-white rounded-t-3xl z-50 shadow-2xl border border-gray-200"
        style={{
          bottom: 0,
          transform: `translateY(${sheetY}px)`,
          willChange: 'transform',
          transition: isTransitioning ? 'transform 0.3s ease-out' : 'none',
          minHeight: '200px',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
          <button
            onClick={() => snapTo(2)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Show More/Fewer Button */}
        {snapIndex !== 2 && (
          <div className="px-6 py-2 text-center border-b border-gray-200 bg-white">
            <button
              onClick={() => snapTo(snapIndex === 1 ? 0 : 1)}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              {snapIndex === 1 ? 'Show More Filters' : 'Show Fewer Filters'}
            </button>
          </div>
        )}
        
        {/* Content */}
        <div 
          className="px-6 py-4 bg-white" 
          style={{ 
            height: `${Math.max(200, (vh * SNAP_POINTS[snapIndex]) - 120)}px`
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default BottomSheet;