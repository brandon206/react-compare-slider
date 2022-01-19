import { RefObject, useLayoutEffect } from 'react';
/**
 * Stand-alone CSS utility to make replaced elements (`img`, `video`, etc.) fit their
 * container.
 */
export declare const styleFitContainer: ({ boxSizing, objectFit, objectPosition, ...props }?: React.CSSProperties) => React.CSSProperties;
/** Store the previous supplied value. */
export declare const usePrevious: <T>(value: T) => T;
/**
 * Event listener binding hook.
 * @param eventName      - Event to bind to.
 * @param handler        - Callback handler.
 * @param element        - Element to bind to.
 * @param handlerOptions - Event handler options.
 */
export declare const useEventListener: (eventName: EventListener['name'], handler: EventListener['caller'], element: EventTarget, handlerOptions: AddEventListenerOptions) => void;
/**
 * Conditionally use `useLayoutEffect` for client *or* `useEffect` for SSR.
 * @see <https://github.com/reduxjs/react-redux/blob/c581d480dd675f2645851fb006bef91aeb6ac24d/src/utils/useIsomorphicLayoutEffect.js>
 */
export declare const useIsomorphicLayoutEffect: typeof useLayoutEffect;
/** Params passed to `useResizeObserver` `handler` function. */
export declare type UseResizeObserverHandlerParams = DOMRect;
/**
 * Bind resize observer callback to element.
 * @param ref       - Element to bind to.
 * @param handler   - Callback for handling entry's bounding rect.
 */
export declare const useResizeObserver: (ref: RefObject<Element>, handler: (entry: UseResizeObserverHandlerParams) => void) => void;
