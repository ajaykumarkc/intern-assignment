
import React, { useState, useEffect, useRef, useCallback } from 'react';

const collapsedHeight = 400;
const expandedHeight = 600;
const animationDuration = 300;

const POPUP_STATE = {
  CLOSED: 'CLOSED',
  HALF_OPEN: 'HALF_OPEN',
  FULL_OPEN: 'FULL_OPEN',
};

const FilterPopup = ({ isOpen, onClose, children }) => {
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

    const initialState = currentPopupStateRef.current;
    const overdragFactor = 50; 

    if (initialState === POPUP_STATE.CLOSED && isOpenRef.current) {
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
        className="fixed left-0 right-0 bg-white rounded-t-3xl z-50 shadow-2xl border border-gray-200 flex flex-col"
        style={{
          ...popupStyle,
          userSelect: isDragging ? 'none' : 'auto',
          willChange: 'height, bottom',
          visibility: (currentPopupStateRef.current === POPUP_STATE.CLOSED && !isOpenRef.current && !isAnimating && currentBottomRef.current < -collapsedHeight * 0.95) ? 'hidden' : 'visible',
        }}
      >
        <div
          className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
          <button onClick={!isDragging ? handleCloseFromUI : undefined} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {currentPopupStateRef.current !== POPUP_STATE.CLOSED && (
          <div className="px-6 py-2 text-center border-b border-gray-200">
            <button onClick={!isDragging ? handleToggleExpand : undefined} className="text-blue-600 hover:text-blue-800 font-semibold" disabled={isAnimating || isDragging} >
              {currentPopupStateRef.current === POPUP_STATE.FULL_OPEN ? 'Show Fewer Filters' : 'Show More Filters'}
            </button>
          </div>
        )}

        <div
          className="flex-1 overflow-y-auto px-6 py-4"
          style={{
            height: `${contentMaxHeight}px`,
            overflowY: (currentPopupStateRef.current === POPUP_STATE.FULL_OPEN && !isDragging && !isAnimating) ? 'auto' : 'hidden',
          }}
        >
          {children}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-white">
          <div className="flex space-x-3">
            <button type="button" className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors" onClick={!isDragging ? handleCloseFromUI : undefined} >
              Reset
            </button>
            <button type="button" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" >
              Apply
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPopup;