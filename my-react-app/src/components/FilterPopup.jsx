import React, { useState, useEffect, useRef } from 'react';

const collapsedHeight = 400; // State 1: Half-Open
const expandedHeight = 600;  // State 2: Full-Open
const animationDuration = 300; // ms

// Define states for clarity
const POPUP_STATE = {
  CLOSED: 'CLOSED',
  HALF_OPEN: 'HALF_OPEN',
  FULL_OPEN: 'FULL_OPEN',
};

const FilterPopup = ({ isOpen, onClose, children }) => {
  const [currentPopupState, setCurrentPopupState] = useState(POPUP_STATE.CLOSED);
  const [isAnimating, setIsAnimating] = useState(false); 

  // Drag functionality states
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ y: 0, initialHeight: 0 }); 
  const currentHeightRef = useRef(collapsedHeight); 
  const popupRef = useRef(null);

  // Determine current visual height based on state
  const getTargetHeight = (state) => {
    if (state === POPUP_STATE.FULL_OPEN) return expandedHeight;
    if (state === POPUP_STATE.HALF_OPEN) return collapsedHeight;
    return collapsedHeight; 
  };

  // Effect to handle isOpen prop changes (external control)
  useEffect(() => {
    if (isOpen) {
      if (currentPopupState === POPUP_STATE.CLOSED) {
        // Transition: 0 -> 1 (Closed to Half-Open)
        setIsAnimating(true);
        setCurrentPopupState(POPUP_STATE.HALF_OPEN);
        currentHeightRef.current = collapsedHeight;
        setTimeout(() => setIsAnimating(false), animationDuration);
      }
    } else {
      if (currentPopupState !== POPUP_STATE.CLOSED) {
        // Transition: 1 -> 0 or 2 -> 0 (Half-Open/Full-Open to Closed)
        setIsAnimating(true);
        // currentPopupState will be set to CLOSED after animation in onTransitionEnd or timeout
        setTimeout(() => {
          setCurrentPopupState(POPUP_STATE.CLOSED); // Visually hide
          setIsAnimating(false);
        }, animationDuration);
      }
    }
  }, [isOpen]); 

  const handleSnapToState = (targetState) => {
    if (isAnimating || currentPopupState === targetState) return;

    setIsAnimating(true);
    setCurrentPopupState(targetState);
    currentHeightRef.current = getTargetHeight(targetState);

    setTimeout(() => {
      setIsAnimating(false);
      if (targetState === POPUP_STATE.CLOSED && isOpen) { 
        onClose();
      }
    }, animationDuration);
  };

  const handleDragStart = (e) => {
    if (isAnimating || currentPopupState === POPUP_STATE.CLOSED) return;

    e.preventDefault(); 
    setIsDragging(true);
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    dragStartRef.current = {
      y: clientY,
      initialHeight: currentHeightRef.current, 
    };
    if (popupRef.current) {
      popupRef.current.style.transition = 'none'; 
    }
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();

    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const deltaY = dragStartRef.current.y - clientY; 

    let newHeight = dragStartRef.current.initialHeight + deltaY;

    
    if (currentPopupState === POPUP_STATE.HALF_OPEN) {
     
      newHeight = Math.max(collapsedHeight - 100, Math.min(expandedHeight, newHeight));
    } else if (currentPopupState === POPUP_STATE.FULL_OPEN) {
      
      newHeight = Math.max(collapsedHeight - 100, Math.min(expandedHeight, newHeight));
    }
    
    currentHeightRef.current = newHeight;
    if (popupRef.current) {
      
      popupRef.current.style.height = `${newHeight}px`;
    }
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const currentActualHeight = currentHeightRef.current;
    const initialDragState = currentPopupState; 


    if (initialDragState === POPUP_STATE.HALF_OPEN) {
      if (currentActualHeight > collapsedHeight + (expandedHeight - collapsedHeight) / 2) {
        handleSnapToState(POPUP_STATE.FULL_OPEN); // Dragged up enough to expand
      } else if (currentActualHeight < collapsedHeight - 50) { 
        handleSnapToState(POPUP_STATE.CLOSED);
      } else {
        handleSnapToState(POPUP_STATE.HALF_OPEN); // Snap back to half
      }
    } else if (initialDragState === POPUP_STATE.FULL_OPEN) {
      if (currentActualHeight < expandedHeight - (expandedHeight - collapsedHeight) / 2) {
         if (currentActualHeight < collapsedHeight - 50) { 
            handleSnapToState(POPUP_STATE.CLOSED);
        } else {
            handleSnapToState(POPUP_STATE.HALF_OPEN);
        }
      } else {
        handleSnapToState(POPUP_STATE.FULL_OPEN); 
      }
    }
  };
  
  // Add global event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchmove', handleDragMove, { passive: false });
      document.addEventListener('touchend', handleDragEnd);
      document.body.style.overflow = 'hidden'; 
    }
    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleDragMove);
      document.removeEventListener('touchend', handleDragEnd);
      document.body.style.overflow = 'auto';
    };
  }, [isDragging]);


  const handleToggleExpand = () => {
    if (currentPopupState === POPUP_STATE.HALF_OPEN) {
      handleSnapToState(POPUP_STATE.FULL_OPEN);
    } else if (currentPopupState === POPUP_STATE.FULL_OPEN) {
      handleSnapToState(POPUP_STATE.HALF_OPEN);
    }
  };

  const handleCloseFromUI = () => {
    if (isOpen) { 
        onClose(); 
    }
  };


  
  let popupStyle = {};
  const targetHeightForState = getTargetHeight(currentPopupState);

  if (currentPopupState === POPUP_STATE.CLOSED && !isOpen && !isAnimating) { 
    return null;
  }

  if (isDragging) {
    popupStyle = {
      height: `${currentHeightRef.current}px`,
      bottom: `0px`,
      transition: 'none',
    };
  } else {
    popupStyle = {
      height: `${targetHeightForState}px`,
      bottom: (currentPopupState !== POPUP_STATE.CLOSED && isOpen) ? `0px` : `-${targetHeightForState}px`,
      transition: `height ${animationDuration}ms ease-out, bottom ${animationDuration}ms ease-out`,
    };
  }
  
  
  const buttonAreaHeight = 80; 
  const headerAreaHeight = 60; 
  const handleAndExpandButtonHeight = 60; 
  const nonContentHeight = buttonAreaHeight + headerAreaHeight + handleAndExpandButtonHeight;
  
  let currentDisplayHeight = isDragging ? currentHeightRef.current : targetHeightForState;
  if (!isOpen && currentPopupState === POPUP_STATE.CLOSED && isAnimating) {
    currentDisplayHeight = collapsedHeight; 
  }

  const contentMaxHeight = Math.max(0, currentDisplayHeight - nonContentHeight);

  return (
    <>
      {/* Backdrop */}
      {isOpen && ( 
        <div
          className={`fixed inset-0 bg-black z-40 transition-opacity duration-${animationDuration} ${
            (currentPopupState !== POPUP_STATE.CLOSED && isOpen) ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'
          }`}
          onClick={handleCloseFromUI}
        />
      )}

      {/* Popup */}
      <div
        ref={popupRef}
        className="fixed left-0 right-0 bg-white rounded-t-3xl z-50 shadow-2xl border border-gray-200 flex flex-col"
        style={{
          ...popupStyle,
          userSelect: isDragging ? 'none' : 'auto',
          willChange: 'height, bottom', 
        }}
      >
        {/* Draggable Handle */}
        <div
          className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
          <button
            onClick={handleCloseFromUI}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Expand/Collapse Button (only visible if not closed) */}
        {currentPopupState !== POPUP_STATE.CLOSED && (
          <div className="px-6 py-2 text-center border-b border-gray-200">
            <button
              onClick={handleToggleExpand}
              className="text-blue-600 hover:text-blue-800 font-semibold"
              disabled={isAnimating}
            >
              {currentPopupState === POPUP_STATE.FULL_OPEN ? 'Show Fewer Filters' : 'Show More Filters'}
            </button>
          </div>
        )}

        {/* Scrollable Content */}
        <div
          className="flex-1 overflow-y-auto px-6 py-4"
          style={{
            height: `${contentMaxHeight}px`,
            overflowY: (currentPopupState === POPUP_STATE.FULL_OPEN && !isDragging && !isAnimating) ? 'auto' : 'hidden',
          }}
        >
          {children}
        </div>

        {/* Fixed Action Buttons at Bottom */}
        <div className="px-6 py-4 border-t border-gray-200 bg-white">
          <div className="flex space-x-3">
            <button
              type="button"
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={handleCloseFromUI} 
            >
              Reset
            </button>
            <button
              type="button"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPopup;