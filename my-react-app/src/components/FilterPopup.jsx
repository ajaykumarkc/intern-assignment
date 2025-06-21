import React, { useState, useEffect, useRef, useCallback } from 'react';

const collapsedHeight = 420;
const expandedHeight = 600;
const animationDuration = 300;

const animationEasing = 'cubic-bezier(0.4, 0, 0.2, 1)';

const POPUP_STATE = {
  CLOSED: 'CLOSED',
  HALF_OPEN: 'HALF_OPEN',
  FULL_OPEN: 'FULL_OPEN',
};

const SNAP_ZONES = {
  CLOSED: { height: collapsedHeight, bottom: -collapsedHeight },
  HALF_OPEN: { height: collapsedHeight, bottom: 0 },
  FULL_OPEN: { height: expandedHeight, bottom: 0 }
};

const FilterPopup = ({ isOpen, onClose, children, onReset, onApply }) => {
  const [currentPopupState, setCurrentPopupState] = useState(POPUP_STATE.CLOSED);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartRef = useRef({ y: 0, initialHeight: 0, initialBottom: -collapsedHeight });
  const currentHeightRef = useRef(collapsedHeight);
  const currentBottomRef = useRef(-collapsedHeight);
  const popupRef = useRef(null);
  const animationTimeoutRef = useRef(null);

  const isOpenRef = useRef(isOpen);
  useEffect(() => { isOpenRef.current = isOpen; }, [isOpen]);

  const currentPopupStateRef = useRef(currentPopupState);
  useEffect(() => { currentPopupStateRef.current = currentPopupState; }, [currentPopupState]);

  const getTargetVisuals = useCallback((state, pIsOpen) => {
    if (!pIsOpen) return SNAP_ZONES.CLOSED;
    
    switch (state) {
      case POPUP_STATE.HALF_OPEN: return SNAP_ZONES.HALF_OPEN;
      case POPUP_STATE.FULL_OPEN: return SNAP_ZONES.FULL_OPEN;
      default: return pIsOpen ? SNAP_ZONES.HALF_OPEN : SNAP_ZONES.CLOSED;
    }
  }, []); 

  useEffect(() => {
    return () => { 
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current); 
    };
  }, []);

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      // Cleanup on unmount
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Add keyboard event listener for Esc key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSnapToState = useCallback((targetState) => {
    const visuals = getTargetVisuals(targetState, isOpenRef.current);

    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);

    setIsAnimating(true);       
    setCurrentPopupState(targetState); 
    currentHeightRef.current = visuals.height;
    currentBottomRef.current = visuals.bottom;

    if (popupRef.current) {
      popupRef.current.style.transition = `height ${animationDuration}ms ${animationEasing}, bottom ${animationDuration}ms ${animationEasing}`;
      popupRef.current.style.height = `${visuals.height}px`;
      popupRef.current.style.bottom = `${visuals.bottom}px`;
    }

    animationTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
    }, animationDuration);
  }, [getTargetVisuals]);

  useEffect(() => {
    if (isOpen) {
      if (currentPopupStateRef.current === POPUP_STATE.CLOSED) {
        if (popupRef.current) {
          const closedVisuals = SNAP_ZONES.CLOSED;
          popupRef.current.style.transition = 'none';
          popupRef.current.style.height = `${closedVisuals.height}px`;
          popupRef.current.style.bottom = `${closedVisuals.bottom}px`;
          
          void popupRef.current.offsetHeight; 
          
          requestAnimationFrame(() => {
            handleSnapToState(POPUP_STATE.HALF_OPEN);
          });
        } else {
          handleSnapToState(POPUP_STATE.HALF_OPEN);
        }
      }
    } else { 
      if (currentPopupStateRef.current !== POPUP_STATE.CLOSED) {
        handleSnapToState(POPUP_STATE.CLOSED);
      }
    }
  }, [isOpen, handleSnapToState]);

  const handleDragStart = useCallback((e) => {
    if (!isOpenRef.current || isAnimating) return; 
    if (isDragging) return;

    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      setIsAnimating(false); 
    }
    
    if (e.touches) e.preventDefault();

    setIsDragging(true);
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const computedStyle = window.getComputedStyle(popupRef.current);
    const currentHeight = parseFloat(computedStyle.height);
    const currentBottom = parseFloat(computedStyle.bottom);

    dragStartRef.current = { 
      y: clientY, 
      initialHeight: currentHeight, 
      initialBottom: currentBottom 
    };

    if (popupRef.current) {
      popupRef.current.style.transition = 'none';
    }
  }, [isAnimating, isDragging]);

  const handleDragMove = useCallback((e) => {
    if (!isDragging) return;
    if (e.touches) e.preventDefault();

    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const deltaY = dragStartRef.current.y - clientY;

    let newHeight = dragStartRef.current.initialHeight;
    let newBottom = dragStartRef.current.initialBottom;
    
    const currentState = currentPopupStateRef.current;
    const overdragLimit = 80;

    if (currentState === POPUP_STATE.HALF_OPEN) {
      if (deltaY > 0) {
        newHeight = Math.min(expandedHeight + overdragLimit, dragStartRef.current.initialHeight + deltaY);
        newBottom = 0;
      } else {
        newHeight = collapsedHeight;
        newBottom = Math.max(-collapsedHeight - overdragLimit, dragStartRef.current.initialBottom + deltaY);
      }
    } else if (currentState === POPUP_STATE.FULL_OPEN) {
      if (deltaY < 0) {
        const targetHeight = dragStartRef.current.initialHeight + deltaY;
        if (targetHeight >= collapsedHeight) {
          newHeight = Math.max(collapsedHeight, targetHeight);
          newBottom = 0;
        } else {
          newHeight = collapsedHeight;
          const excessDrag = collapsedHeight - targetHeight;
          newBottom = Math.max(-collapsedHeight - overdragLimit, -excessDrag);
        }
      } else {
        newHeight = Math.min(expandedHeight + overdragLimit, dragStartRef.current.initialHeight + deltaY);
        newBottom = 0;
      }
    }

    currentHeightRef.current = newHeight;
    currentBottomRef.current = newBottom;

    if (popupRef.current) {
      popupRef.current.style.height = `${newHeight}px`;
      popupRef.current.style.bottom = `${newBottom}px`;
    }
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    const currentH = currentHeightRef.current;
    const currentB = currentBottomRef.current;

    const closeThreshold = -collapsedHeight * 0.35;
    if (currentB < closeThreshold) {
      onClose();
      return;
    }

    const expandThreshold = collapsedHeight + (expandedHeight - collapsedHeight) * 0.4;
    if (currentH > expandThreshold && currentB >= -50) {
      handleSnapToState(POPUP_STATE.FULL_OPEN);
    } else {
      handleSnapToState(POPUP_STATE.HALF_OPEN);
    }
  }, [isDragging, handleSnapToState, onClose]);

  useEffect(() => {
    if (isDragging) {
      const options = { passive: false };
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchmove', handleDragMove, options);
      document.addEventListener('touchend', handleDragEnd);

      return () => {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
        document.removeEventListener('touchmove', handleDragMove, options);
        document.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  const handleToggleExpand = useCallback(() => {
    if (isAnimating || isDragging) return;
    if (currentPopupStateRef.current === POPUP_STATE.HALF_OPEN) {
      handleSnapToState(POPUP_STATE.FULL_OPEN);
    } else if (currentPopupStateRef.current === POPUP_STATE.FULL_OPEN) {
      handleSnapToState(POPUP_STATE.HALF_OPEN);
    }
  }, [isAnimating, isDragging, handleSnapToState]);

  const handleCloseFromUI = useCallback(() => {
    if (isAnimating || isDragging) return;
    onClose();
  }, [isAnimating, isDragging, onClose]);

  if (currentPopupState === POPUP_STATE.CLOSED && !isOpen && !isAnimating) {
    return null;
  }

  const buttonAreaHeight = 80;
  const headerAreaHeight = 60;
  const handleAndExpandButtonHeight = 60;
  const nonContentHeight = buttonAreaHeight + headerAreaHeight + handleAndExpandButtonHeight;
  
  let popupComputedStyle = {};
  if (isDragging) {
    popupComputedStyle = {
      height: `${currentHeightRef.current}px`,
      bottom: `${currentBottomRef.current}px`,
      transition: 'none',
    };
  } else {
    const visuals = getTargetVisuals(currentPopupState, isOpen);
    popupComputedStyle = {
      height: `${visuals.height}px`,
      bottom: `${visuals.bottom}px`,
      transition: `height ${animationDuration}ms ${animationEasing}, bottom ${animationDuration}ms ${animationEasing}`,
    };
  }
  
  const currentCssHeight = parseFloat(popupComputedStyle.height || '0');
  const contentMaxHeight = Math.max(0, currentCssHeight - nonContentHeight);

  const showBackdrop = isOpen && currentPopupState !== POPUP_STATE.CLOSED;

  return (
    <>
      {showBackdrop && (
        <div
          className="fixed inset-0 bg-black bg-opacity-10 z-40 transition-opacity ease-in-out"
          style={{ transitionDuration: `${animationDuration}ms` }}
          onClick={handleCloseFromUI}
        />
      )}

      <div
        ref={popupRef}
        className="fixed left-0 right-0 bg-gradient-to-b from-white to-gray-50 rounded-t-3xl z-50 shadow-2xl border border-gray-200 flex flex-col backdrop-blur-sm"
        style={{
          ...popupComputedStyle,
          userSelect: isDragging ? 'none' : 'auto',
          willChange: 'height, bottom',
          ...(currentPopupState === POPUP_STATE.CLOSED && isOpen && !isAnimating && popupRef.current === null && {
            height: `${SNAP_ZONES.CLOSED.height}px`,
            bottom: `${SNAP_ZONES.CLOSED.bottom}px`,
            transition: 'none',
          })
        }}
      >
        <div
          className="flex justify-center pt-4 pb-3 cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          <div className="w-16 h-1.5 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full shadow-sm"></div>
        </div>

        <div className="flex justify-between items-center px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500 rounded-lg sm:rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">Smart Filters</h2>
              <p className="text-xs sm:text-sm text-gray-500">Find your perfect meal</p>
            </div>
          </div>
          <button 
            onClick={handleCloseFromUI} 
            className="p-2 sm:p-2.5 hover:bg-red-50 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-200"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-4 sm:px-6 py-2 sm:py-3 text-center border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <button
            onClick={handleToggleExpand} 
            className="text-blue-600 hover:text-blue-800 font-semibold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all duration-200 hover:scale-105" 
            disabled={isAnimating || isDragging}
          >
            <span>{currentPopupState === POPUP_STATE.FULL_OPEN ? 'Show Fewer Filters' : 'Show More Filters'}</span>
            <svg className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 ${currentPopupState === POPUP_STATE.FULL_OPEN ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 bg-gradient-to-b from-white to-gray-50"
          style={{
            height: `${contentMaxHeight}px`,
            overflowY: currentPopupState === POPUP_STATE.FULL_OPEN && contentMaxHeight > 0 ? 'auto' : 'hidden',
          }}
        >
          {children}
        </div>

        <div className="px-4 sm:px-6 py-4 sm:py-5 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white shadow-lg">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              type="button"
              className="flex-1 px-4 sm:px-6 py-3 sm:py-3.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-all duration-200 hover:scale-105"
              onClick={onReset} 
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-sm sm:text-base">Reset</span>
              </div>
            </button>
            <button
              type="button"
              className="flex-1 px-4 sm:px-6 py-3 sm:py-3.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 hover:scale-105 shadow-lg"
              onClick={onApply} 
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm sm:text-base">Apply Filters</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPopup;