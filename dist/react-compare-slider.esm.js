import React, { forwardRef, useRef, useEffect, useCallback, useLayoutEffect, useState } from 'react';

/** Container for clipped item. */

const ContainerClip = /*#__PURE__*/forwardRef((props, ref) => {
  const style = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    willChange: 'clip',
    userSelect: 'none',
    KhtmlUserSelect: 'none',
    MozUserSelect: 'none',
    WebkitUserSelect: 'none'
  };
  return React.createElement("div", Object.assign({}, props, {
    style: style,
    "data-rcs": "clip-item",
    ref: ref
  }));
});
ContainerClip.displayName = 'ContainerClip';
/** Container to control the handle's position. */

const ContainerHandle = /*#__PURE__*/forwardRef(({
  children,
  portrait
}, ref) => {
  const style = {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none'
  };
  const innerStyle = {
    position: 'absolute',
    width: portrait ? '100%' : undefined,
    height: portrait ? undefined : '100%',
    transform: portrait ? 'translateY(-50%)' : 'translateX(-50%)',
    pointerEvents: 'all'
  };
  return React.createElement("div", {
    style: style,
    "data-rcs": "handle-container",
    ref: ref
  }, React.createElement("div", {
    style: innerStyle
  }, children));
});
ContainerHandle.displayName = 'ThisHandleContainer';

const ThisArrow = ({
  flip
}) => {
  const style = {
    width: 0,
    height: 0,
    borderTop: '8px solid transparent',
    borderRight: '10px solid',
    borderBottom: '8px solid transparent',
    transform: flip ? 'rotate(180deg)' : undefined
  };
  return React.createElement("div", {
    style: style
  });
};
/** Default `handle`. */


const ReactCompareSliderHandle = ({
  portrait,
  buttonStyle,
  linesStyle,
  style,
  ...props
}) => {
  const _style = {
    display: 'flex',
    flexDirection: portrait ? 'row' : 'column',
    placeItems: 'center',
    height: '100%',
    cursor: portrait ? 'ns-resize' : 'ew-resize',
    pointerEvents: 'none',
    color: '#fff',
    ...style
  };
  const _linesStyle = {
    flexGrow: 1,
    height: portrait ? 2 : '100%',
    width: portrait ? '100%' : 2,
    backgroundColor: 'currentColor',
    pointerEvents: 'auto',
    boxShadow: '0 0 7px rgba(0,0,0,.35)',
    ...linesStyle
  };
  const _buttonStyle = {
    display: 'grid',
    gridAutoFlow: 'column',
    gap: 8,
    placeContent: 'center',
    flexShrink: 0,
    width: 56,
    height: 56,
    borderRadius: '50%',
    borderStyle: 'solid',
    borderWidth: 2,
    pointerEvents: 'auto',
    backdropFilter: 'blur(7px)',
    WebkitBackdropFilter: 'blur(7px)',
    boxShadow: '0 0 7px rgba(0,0,0,.35)',
    transform: portrait ? 'rotate(90deg)' : undefined,
    ...buttonStyle
  };
  return React.createElement("div", Object.assign({
    className: "__rcs-handle-root"
  }, props, {
    style: _style
  }), React.createElement("div", {
    className: "__rcs-handle-line",
    style: _linesStyle
  }), React.createElement("div", {
    className: "__rcs-handle-button",
    style: _buttonStyle
  }, React.createElement(ThisArrow, null), React.createElement(ThisArrow, {
    flip: true
  })), React.createElement("div", {
    className: "__rcs-handle-line",
    style: _linesStyle
  }));
};

/**
 * Stand-alone CSS utility to make replaced elements (`img`, `video`, etc.) fit their
 * container.
 */

const styleFitContainer = ({
  boxSizing = 'border-box',
  objectFit = 'cover',
  objectPosition = 'center',
  ...props
} = {}) => ({
  display: 'block',
  width: '100%',
  height: '100%',
  maxWidth: '100%',
  boxSizing,
  objectFit,
  objectPosition,
  ...props
});
/** Store the previous supplied value. */

const usePrevious = value => {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
/**
 * Event listener binding hook.
 * @param eventName      - Event to bind to.
 * @param handler        - Callback handler.
 * @param element        - Element to bind to.
 * @param handlerOptions - Event handler options.
 */

const useEventListener = (eventName, handler, element, handlerOptions) => {
  const savedHandler = useRef();
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);
  useEffect(() => {
    // Make sure element supports addEventListener.
    if (!(element && element.addEventListener)) return; // Create event listener that calls handler function stored in ref.

    const eventListener = event => savedHandler.current && savedHandler.current(event);

    element.addEventListener(eventName, eventListener, handlerOptions);
    return () => {
      element.removeEventListener(eventName, eventListener, handlerOptions);
    };
  }, [eventName, element, handlerOptions]);
};
/**
 * Conditionally use `useLayoutEffect` for client *or* `useEffect` for SSR.
 * @see <https://github.com/reduxjs/react-redux/blob/c581d480dd675f2645851fb006bef91aeb6ac24d/src/utils/useIsomorphicLayoutEffect.js>
 */

const useIsomorphicLayoutEffect = typeof window !== 'undefined' && window.document && window.document.createElement ? useLayoutEffect : useEffect;
/**
 * Bind resize observer callback to element.
 * @param ref       - Element to bind to.
 * @param handler   - Callback for handling entry's bounding rect.
 */

const useResizeObserver = (ref, handler) => {
  const observer = useRef();
  const observe = useCallback(() => {
    if (ref.current && observer.current) observer.current.observe(ref.current);
  }, [ref]); // Bind/rebind observer when `handler` changes.

  useIsomorphicLayoutEffect(() => {
    observer.current = new ResizeObserver(([entry]) => handler(entry.contentRect));
    observe();
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [handler, observe]);
};

const EVENT_PASSIVE_PARAMS = {
  passive: true
};
const EVENT_CAPTURE_PARAMS = {
  capture: true,
  passive: false
};
/** Root Comparison slider. */

const ReactCompareSlider = ({
  handle,
  itemOne,
  itemTwo,
  onlyHandleDraggable = false,
  onPositionChange,
  portrait = false,
  position = 50,
  boundsPadding = 0,
  changePositionOnHover = false,
  style,
  ...props
}) => {
  /** DOM node of the root element. */
  const rootContainerRef = useRef(null);
  /** DOM node of the item that is clipped. */

  const clipContainerRef = useRef(null);
  /** DOM node of the handle container. */

  const handleContainerRef = useRef(null);
  /** Current position as a percentage value (initially negative to sync bounds on mount). */

  const internalPositionPc = useRef(position);
  /** Previous `position` prop value. */

  const prevPropPosition = usePrevious(position);
  /** Whether user is currently dragging. */

  const [isDragging, setIsDragging] = useState(false);
  /** Whether component has a `window` event binding. */

  const hasWindowBinding = useRef(false);
  /** Target container for pointer events. */

  const [interactiveTarget, setInteractiveTarget] = useState();
  /** Whether the bounds of the container element have been synchronised. */

  const [didSyncBounds, setDidSyncBounds] = useState(false); // Set target container for pointer events.

  useEffect(() => {
    setInteractiveTarget(onlyHandleDraggable ? handleContainerRef.current : rootContainerRef.current);
  }, [onlyHandleDraggable]);
  /** Update internal position value. */

  const updateInternalPosition = useCallback(function updateInternalCall({
    x,
    y,
    isOffset,
    portrait: _portrait,
    boundsPadding: _boundsPadding
  }) {
    const {
      top,
      left,
      width,
      height
    } = rootContainerRef.current.getBoundingClientRect(); // Early out if width or height are zero, can't calculate values
    // from zeros.

    if (width === 0 || height === 0) return;
    /**
     * Pixel position clamped within the container's bounds.
     * @NOTE This does *not* take `boundsPadding` into account because we need
     *       the full coords to correctly position the handle.
     */

    const positionPx = Math.min(Math.max( // Determine bounds based on orientation
    _portrait ? isOffset ? y - top - window.pageYOffset : y : isOffset ? x - left - window.pageXOffset : x, // Min value
    0), // Max value
    _portrait ? height : width);
    /** Width or height with CSS scaling accounted for. */

    const zoomScale = _portrait ? height / (rootContainerRef.current.offsetHeight || 1) : width / (rootContainerRef.current.offsetWidth || 1);
    const adjustedPosition = positionPx / zoomScale;
    const adjustedWidth = width / zoomScale;
    const adjustedHeight = height / zoomScale;
    /**
     * Internal position percentage *without* bounds.
     * @NOTE This uses the entire container bounds **without** `boundsPadding`
     *       to get the *real* bounds.
     */

    const nextInternalPositionPc = adjustedPosition / (_portrait ? adjustedHeight : adjustedWidth) * 100;
    /** Whether the current pixel position meets the min/max bounds. */

    const positionMeetsBounds = _portrait ? adjustedPosition === 0 || adjustedPosition === adjustedHeight : adjustedPosition === 0 || adjustedPosition === adjustedWidth;
    const canSkipPositionPc = nextInternalPositionPc === internalPositionPc.current && (internalPositionPc.current === 0 || internalPositionPc.current === 100); // Early out if pixel and percentage positions are already at the min/max
    // to prevent update spamming when the user is sliding outside of the
    // container.

    if (didSyncBounds && canSkipPositionPc && positionMeetsBounds) {
      return;
    } else {
      setDidSyncBounds(true);
    } // Set new internal position.


    internalPositionPc.current = nextInternalPositionPc;
    /** Pixel position clamped to extremities *with* bounds padding. */

    const clampedPx = Math.min( // Get largest from pixel position *or* bounds padding.
    Math.max(adjustedPosition, 0 + _boundsPadding), // Use height *or* width based on orientation.
    (_portrait ? adjustedHeight : adjustedWidth) - _boundsPadding);

    if (clipContainerRef && clipContainerRef.current) {
      clipContainerRef.current.style.clip = _portrait ? `rect(auto,auto,${clampedPx}px,auto)` : `rect(auto,${clampedPx}px,auto,auto)`;
    }

    if (handleContainerRef && handleContainerRef.current) {
      handleContainerRef.current.style.transform = _portrait ? `translate3d(0,${clampedPx}px,0)` : `translate3d(${clampedPx}px,0,0)`;
    }

    if (onPositionChange) onPositionChange(internalPositionPc.current);
  }, [didSyncBounds, onPositionChange]); // Update internal position when other user controllable props change.

  useEffect(() => {
    const {
      width,
      height
    } = rootContainerRef.current.getBoundingClientRect(); // Use current internal position if `position` hasn't changed.

    const nextPosition = position === prevPropPosition ? internalPositionPc.current : position;
    updateInternalPosition({
      portrait,
      boundsPadding,
      x: width / 100 * nextPosition,
      y: height / 100 * nextPosition
    });
  }, [portrait, position, prevPropPosition, boundsPadding, updateInternalPosition]);
  /** Handle mouse/touch down. */

  const handlePointerDown = useCallback(ev => {
    ev.preventDefault();
    updateInternalPosition({
      portrait,
      boundsPadding,
      isOffset: true,
      x: ev instanceof MouseEvent ? ev.pageX : ev.touches[0].pageX,
      y: ev instanceof MouseEvent ? ev.pageY : ev.touches[0].pageY
    });
    setIsDragging(true);
  }, [portrait, boundsPadding, updateInternalPosition]);
  /** Handle mouse/touch move. */

  const handlePointerMove = useCallback(function moveCall(ev) {
    updateInternalPosition({
      portrait,
      boundsPadding,
      isOffset: true,
      x: ev instanceof MouseEvent ? ev.pageX : ev.touches[0].pageX,
      y: ev instanceof MouseEvent ? ev.pageY : ev.touches[0].pageY
    });
  }, [portrait, boundsPadding, updateInternalPosition]);
  /** Handle mouse/touch up. */

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  /** Resync internal position on resize. */

  const handleResize = useCallback(({
    width,
    height
  }) => {
    const {
      width: scaledWidth,
      height: scaledHeight
    } = rootContainerRef.current.getBoundingClientRect();
    updateInternalPosition({
      portrait,
      boundsPadding,
      x: width / 100 * internalPositionPc.current * scaledWidth / width,
      y: height / 100 * internalPositionPc.current * scaledHeight / height
    });
  }, [portrait, boundsPadding, updateInternalPosition]); // Allow drag outside of container while pointer is still down.

  useEffect(() => {
    if (isDragging && !hasWindowBinding.current) {
      window.addEventListener('mousemove', handlePointerMove, EVENT_PASSIVE_PARAMS);
      window.addEventListener('mouseup', handlePointerUp, EVENT_PASSIVE_PARAMS);
      window.addEventListener('touchmove', handlePointerMove, EVENT_PASSIVE_PARAMS);
      window.addEventListener('touchend', handlePointerUp, EVENT_PASSIVE_PARAMS);
      hasWindowBinding.current = true;
    }

    return () => {
      if (hasWindowBinding.current) {
        window.removeEventListener('mousemove', handlePointerMove);
        window.removeEventListener('mouseup', handlePointerUp);
        window.removeEventListener('touchmove', handlePointerMove);
        window.removeEventListener('touchend', handlePointerUp);
        hasWindowBinding.current = false;
      }
    };
  }, [handlePointerMove, handlePointerUp, isDragging]); // Bind resize observer to container.

  useResizeObserver(rootContainerRef, handleResize); // Handle hover events on the container.

  useEffect(() => {
    const containerRef = rootContainerRef.current;

    const handleMouseLeave = () => {
      if (isDragging) return;
      handlePointerUp();
    };

    if (changePositionOnHover) {
      containerRef.addEventListener('mousemove', handlePointerMove, EVENT_PASSIVE_PARAMS);
      containerRef.addEventListener('mouseleave', handleMouseLeave, EVENT_PASSIVE_PARAMS);
    }

    return () => {
      containerRef.removeEventListener('mousemove', handlePointerMove);
      containerRef.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [changePositionOnHover, handlePointerMove, handlePointerUp, isDragging]);
  useEventListener('mousedown', handlePointerDown, interactiveTarget, EVENT_CAPTURE_PARAMS);
  useEventListener('touchstart', handlePointerDown, interactiveTarget, EVENT_CAPTURE_PARAMS); // Use custom handle if requested.

  const Handle = handle || React.createElement(ReactCompareSliderHandle, {
    portrait: portrait
  });
  const rootStyle = {
    position: 'relative',
    overflow: 'hidden',
    cursor: isDragging ? portrait ? 'ns-resize' : 'ew-resize' : undefined,
    userSelect: 'none',
    KhtmlUserSelect: 'none',
    msUserSelect: 'none',
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    ...style
  };
  return React.createElement("div", Object.assign({}, props, {
    ref: rootContainerRef,
    style: rootStyle,
    "data-rcs": "root"
  }), itemTwo, React.createElement(ContainerClip, {
    ref: clipContainerRef
  }, itemOne), React.createElement(ContainerHandle, {
    portrait: portrait,
    ref: handleContainerRef
  }, Handle));
};

/** Image with defaults from `styleFitContainer` applied. */

const ReactCompareSliderImage = ({
  style,
  ...props
}) => {
  const rootStyle = styleFitContainer(style);
  return React.createElement("img", Object.assign({}, props, {
    style: rootStyle,
    "data-rcs": "image"
  }));
};

export { ReactCompareSlider, ReactCompareSliderHandle, ReactCompareSliderImage, styleFitContainer };
//# sourceMappingURL=react-compare-slider.esm.js.map
