import React, { useState, useEffect, useRef, useCallback } from 'react';

const collapsedHeight = 400;
const expandedHeight = 600;
const animationDuration = 300;

const POPUP_STATE = {
  CLOSED: 'CLOSED',
  HALF_OPEN: 'HALF_OPEN',
  FULL_OPEN: 'FULL_OPEN',
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
    let targetH = collapsedHeight; 
    if (state === POPUP_STATE.FULL_OPEN) {
      targetH = expandedHeight;
    }
    if (state === POPUP_STATE.CLOSED && pIsOpen === false) { 
        if (currentPopupStateRef.current === POPUP_STATE.FULL_OPEN) targetH = expandedHeight;
        else if (currentPopupStateRef.current === POPUP_STATE.HALF_OPEN) targetH = collapsedHeight;
    }

    const targetB = (state !== POPUP_STATE.CLOSED && pIsOpen) ? 0 : -targetH;
    return { height: targetH, bottom: targetB };
  }, []); 

  useEffect(() => {
    return () => { if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current); };
  }, []);

  const handleSnapToState = useCallback((targetState) => {
    const visuals = getTargetVisuals(targetState, isOpenRef.current);

    if (isAnimating && currentPopupStateRef.current === targetState) return; 
    if (!isAnimating && !isDragging &&
        currentPopupStateRef.current === targetState &&
        Math.abs(currentBottomRef.current - visuals.bottom) < 2 && 
        Math.abs(currentHeightRef.current - visuals.height) < 2) {
      return; 
    }

    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);

    setIsAnimating(true);       
    setCurrentPopupState(targetState); 
    currentHeightRef.current = visuals.height;
    currentBottomRef.current = visuals.bottom;

    if (popupRef.current) {
        popupRef.current.style.transition = `height ${animationDuration}ms ease-out, bottom ${animationDuration}ms ease-out`;
    }

    animationTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
      if (targetState === POPUP_STATE.CLOSED && isOpenRef.current) {
        onClose();
      }
    }, animationDuration);
  }, [getTargetVisuals, onClose, isAnimating, isDragging]);

  useEffect(() => {
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);

    const visualsHalfOpen = getTargetVisuals(POPUP_STATE.HALF_OPEN, true);
    const currentOpenStateForClose = currentPopupStateRef.current === POPUP_STATE.CLOSED ? POPUP_STATE.HALF_OPEN : currentPopupStateRef.current;
    const visualsForClosing = getTargetVisuals(currentOpenStateForClose, false); 
    const finalVisualsClosed = getTargetVisuals(POPUP_STATE.CLOSED, false); 

    if (isOpen) {
      if ((currentPopupStateRef.current === POPUP_STATE.CLOSED || currentBottomRef.current < -(collapsedHeight * 0.8)) && !isAnimating) {
        setIsAnimating(true);
        setCurrentPopupState(POPUP_STATE.HALF_OPEN);
        currentHeightRef.current = visualsHalfOpen.height;
        currentBottomRef.current = visualsHalfOpen.bottom;
        animationTimeoutRef.current = setTimeout(() => setIsAnimating(false), animationDuration);
      }
    } else { 
      if (currentPopupStateRef.current !== POPUP_STATE.CLOSED && !isAnimating) {
        setIsAnimating(true);
        currentHeightRef.current = visualsForClosing.height; 
        currentBottomRef.current = visualsForClosing.bottom; 
        animationTimeoutRef.current = setTimeout(() => {
          setCurrentPopupState(POPUP_STATE.CLOSED); 
          currentHeightRef.current = finalVisualsClosed.height; 
          currentBottomRef.current = finalVisualsClosed.bottom; 
          setIsAnimating(false);
        }, animationDuration);
      } else if (currentPopupStateRef.current !== POPUP_STATE.CLOSED && isAnimating) {
         animationTimeoutRef.current = setTimeout(() => {
            if (!isOpenRef.current) {
                 setCurrentPopupState(POPUP_STATE.CLOSED);
                 setIsAnimating(false);
            }
        }, animationDuration + 50);
      }
    }
  }, [isOpen, getTargetVisuals]);

  const handleDragStart = useCallback((e) => {
    if ((currentPopupStateRef.current === POPUP_STATE.CLOSED && !isOpenRef.current) || isDragging) return;

    if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        setIsAnimating(false);
    }
    e.preventDefault();
    setIsDragging(true);
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    let initialB, initialH;
    if (popupRef.current) {
        const styles = window.getComputedStyle(popupRef.current);
        initialB = parseFloat(styles.bottom);
        initialH = parseFloat(styles.height);
    } else {
        initialB = currentBottomRef.current;
        initialH = currentHeightRef.current;
    }
    dragStartRef.current = { y: clientY, initialHeight: initialH, initialBottom: initialB };
    if (popupRef.current) popupRef.current.style.transition = 'none';
  }, [isAnimating, isDragging]);


 const handleDragMove = useCallback((e) => {
    if (!isDragging) return;
    e.preventDefault();

    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const deltaY = dragStartRef.current.y - clientY; 

    let newH = dragStartRef.current.initialHeight;
    let newB = dragStartRef.current.initialBottom;

    const initialState = currentPopupStateRef.current; // Use ref
    const overdragFactor = 50; 

    if (initialState === POPUP_STATE.CLOSED && isOpenRef.current) { // Use ref
        newB = dragStartRef.current.initialBottom + deltaY;
        newH = collapsedHeight;
        newB = Math.max(-collapsedHeight - overdragFactor, Math.min(overdragFactor, newB));
    } else if (initialState === POPUP_STATE.HALF_OPEN) {
        if (deltaY > 0) { 
            newH = dragStartRef.current.initialHeight + deltaY;
            newH = Math.min(expandedHeight + overdragFactor, newH);
            newH = Math.max(collapsedHeight - overdragFactor / 2, newH);
            newB = 0;
        } else { 
            newH = collapsedHeight;
            newB = dragStartRef.current.initialBottom + deltaY;
            newB = Math.max(-collapsedHeight - overdragFactor, Math.min(0, newB));
        }
    } else if (initialState === POPUP_STATE.FULL_OPEN) {
        newH = dragStartRef.current.initialHeight + deltaY; 
        newB = 0; 

        if (newH < collapsedHeight && deltaY < 0) { 
            const dragPastCollapsed = (dragStartRef.current.initialHeight - collapsedHeight) + deltaY; 
            newB = dragPastCollapsed; 
            newH = collapsedHeight; 
            newB = Math.max(-(Math.max(collapsedHeight,expandedHeight) + overdragFactor), newB); 
        } else {
             newH = Math.max(collapsedHeight - overdragFactor, newH); 
        }
         newH = Math.min(expandedHeight + overdragFactor, newH); 
    }

    currentHeightRef.current = newH;
    currentBottomRef.current = newB;

    if (popupRef.current) {
      popupRef.current.style.height = `${newH}px`;
      popupRef.current.style.bottom = `${newB}px`;
    }
  }, [isDragging]);


const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    const currentH = currentHeightRef.current;
    const currentB = currentBottomRef.current;
    const initialDragState = currentPopupStateRef.current;

    const snapBiasToOpen = 0.25; 
    const snapBiasToClose = 0.35; 

    const diffHeight = expandedHeight - collapsedHeight;

    const halfToFullThresholdH = collapsedHeight + diffHeight * (0.5 - snapBiasToClose); 
    const fullToHalfThresholdH = expandedHeight - diffHeight * (0.5 - snapBiasToClose); 

    
    const openFromClosedThresholdB = -collapsedHeight * (1 - (0.5 + snapBiasToOpen)); 

    const closeThresholdB = -collapsedHeight * (0.5 - snapBiasToClose);

    const closeThresholdAbsoluteH = collapsedHeight * 0.5; 


    if (initialDragState === POPUP_STATE.CLOSED) {
        if (isOpenRef.current) { 
            if (currentB > openFromClosedThresholdB) {
                handleSnapToState(POPUP_STATE.HALF_OPEN);
            } else {
                handleSnapToState(POPUP_STATE.CLOSED);
            }
        } else { 
            handleSnapToState(POPUP_STATE.CLOSED);
        }
    } else if (initialDragState === POPUP_STATE.HALF_OPEN) {
        if (currentB < closeThresholdB || currentH < closeThresholdAbsoluteH) {
            handleSnapToState(POPUP_STATE.CLOSED);
        } else if (currentH > halfToFullThresholdH && currentB >= -25) { 
            handleSnapToState(POPUP_STATE.FULL_OPEN);
        } else { 
            handleSnapToState(POPUP_STATE.HALF_OPEN);
        }
    } else if (initialDragState === POPUP_STATE.FULL_OPEN) {
        if (currentB < closeThresholdB || currentH < closeThresholdAbsoluteH) {
             handleSnapToState(POPUP_STATE.CLOSED);
        } else if (currentH < fullToHalfThresholdH && currentB >= -25) { 
            handleSnapToState(POPUP_STATE.HALF_OPEN);
        } else { 
            handleSnapToState(POPUP_STATE.FULL_OPEN);
        }
    } else {
        handleSnapToState(isOpenRef.current ? POPUP_STATE.HALF_OPEN : POPUP_STATE.CLOSED);
    }
  }, [isDragging, handleSnapToState]); 


  useEffect(() => {
    const currentPopup = popupRef.current;
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchmove', handleDragMove, { passive: false });
      document.addEventListener('touchend', handleDragEnd);
      document.body.style.overflow = 'hidden';
    } else {
        if (currentPopup && currentPopup.style.transition === 'none') {
             currentPopup.style.transition = `height ${animationDuration}ms ease-out, bottom ${animationDuration}ms ease-out`;
        }
    }
    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleDragMove);
      document.removeEventListener('touchend', handleDragEnd);
      document.body.style.overflow = 'auto';
    };
  }, [isDragging, handleDragMove, handleDragEnd]);


  const handleToggleExpand = useCallback(() => {
    if (isAnimating || isDragging) return;
    if (currentPopupStateRef.current === POPUP_STATE.HALF_OPEN) handleSnapToState(POPUP_STATE.FULL_OPEN);
    else if (currentPopupStateRef.current === POPUP_STATE.FULL_OPEN) handleSnapToState(POPUP_STATE.HALF_OPEN);
  }, [isAnimating, isDragging, handleSnapToState]);

  const handleCloseFromUI = useCallback(() => {
    if ((isAnimating && currentPopupStateRef.current === POPUP_STATE.CLOSED) || isDragging) return;
    if (isOpenRef.current) onClose();
  }, [isAnimating, isDragging, onClose]);
  
  let popupStyle = {};
  const { height: targetStyleH, bottom: targetStyleB } = getTargetVisuals(currentPopupStateRef.current, isOpenRef.current);


  if (currentPopupStateRef.current === POPUP_STATE.CLOSED && !isOpenRef.current && !isAnimating) {
    return null;
  }

  if (isDragging) {
    popupStyle = {
      height: `${currentHeightRef.current}px`,
      bottom: `${currentBottomRef.current}px`,
      transition: 'none',
    };
  } else {
    popupStyle = {
      height: `${targetStyleH}px`,
      bottom: `${targetStyleB}px`,
      transition: `height ${animationDuration}ms ease-out, bottom ${animationDuration}ms ease-out`,
    };
  }
  
  const buttonAreaHeight = 80;
  const headerAreaHeight = 60;
  const handleAndExpandButtonHeight = 60;
  const nonContentHeight = buttonAreaHeight + headerAreaHeight + handleAndExpandButtonHeight;
  
  let effectiveDisplayHeight = parseFloat(popupStyle.height);
  const contentMaxHeight = Math.max(0, effectiveDisplayHeight - nonContentHeight);

  const showBackdrop = (isOpenRef.current && currentPopupStateRef.current !== POPUP_STATE.CLOSED && currentBottomRef.current > -collapsedHeight + 50) ||
                       (isAnimating && isOpenRef.current && currentPopupStateRef.current !== POPUP_STATE.CLOSED && getTargetVisuals(currentPopupStateRef.current, true).bottom > -50 );


  return (
    <>
      {showBackdrop && (
        <div
          className={`fixed inset-0 bg-black z-40 transition-opacity duration-${animationDuration} ${
             (currentPopupStateRef.current !== POPUP_STATE.CLOSED && isOpenRef.current && currentBottomRef.current > -50 ) ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'
          }`}
          onClick={!isDragging ? handleCloseFromUI : undefined}
        />
      )}

      <div
        ref={popupRef}
        className="fixed left-0 right-0 bg-gradient-to-b from-white to-gray-50 rounded-t-3xl z-50 shadow-2xl border border-gray-200 flex flex-col backdrop-blur-sm"
        style={{
          ...popupStyle,
          userSelect: isDragging ? 'none' : 'auto',
          willChange: 'height, bottom',
          visibility: (currentPopupStateRef.current === POPUP_STATE.CLOSED && !isOpenRef.current && !isAnimating && currentBottomRef.current < -collapsedHeight * 0.95) ? 'hidden' : 'visible',
        }}
      >
        <div
          className="flex justify-center pt-4 pb-3 cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          <div className="w-16 h-1.5 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full shadow-sm"></div>
        </div>

        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Smart Filters</h2>
              <p className="text-sm text-gray-500">Find your perfect meal</p>
            </div>
          </div>
          <button 
            onClick={!isDragging ? handleCloseFromUI : undefined} 
            className="p-2.5 hover:bg-red-50 rounded-full transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-200"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {currentPopupStateRef.current !== POPUP_STATE.CLOSED && (
          <div className="px-6 py-3 text-center border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <button
              onClick={!isDragging ? handleToggleExpand : undefined} 
              className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center justify-center space-x-2 transition-all duration-200 hover:scale-105" 
              disabled={isAnimating || isDragging}
            >
              <span>{currentPopupStateRef.current === POPUP_STATE.FULL_OPEN ? 'Show Fewer Filters' : 'Show More Filters'}</span>
              <svg className={`w-4 h-4 transition-transform duration-200 ${currentPopupStateRef.current === POPUP_STATE.FULL_OPEN ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}

        <div
          className="flex-1 overflow-y-auto px-6 py-6 bg-gradient-to-b from-white to-gray-50"
          style={{
            height: `${contentMaxHeight}px`,
            overflowY: (currentPopupStateRef.current === POPUP_STATE.FULL_OPEN && !isDragging && !isAnimating) ? 'auto' : 'hidden',
          }}
        >
          {children}
        </div>

        <div className="px-6 py-5 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white shadow-lg">
          <div className="flex space-x-4">
            <button
              type="button"
              className="flex-1 px-6 py-3.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-400 transition-all duration-200 hover:scale-105"
              onClick={!isDragging ? onReset : undefined} 
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Reset</span>
              </div>
            </button>
            <button
              type="button"
              className="flex-1 px-6 py-3.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 hover:scale-105 shadow-lg"
              onClick={!isDragging ? onApply : undefined} 
            >
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Apply Filters</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPopup;