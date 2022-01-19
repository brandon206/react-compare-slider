import React from 'react';
import { ReactCompareSliderCommonProps, ReactCompareSliderPropPosition } from './types';
/** Comparison slider properties. */
export interface ReactCompareSliderProps extends Partial<ReactCompareSliderCommonProps> {
    /** Padding to limit the slideable bounds in pixels on the X-axis (landscape) or Y-axis (portrait). */
    boundsPadding?: number;
    /** Whether the slider should follow the pointer on hover. */
    changePositionOnHover?: boolean;
    /** Custom handle component. */
    handle?: React.ReactNode;
    /** First item to show. */
    itemOne: React.ReactNode;
    /** Second item to show. */
    itemTwo: React.ReactNode;
    /** Whether to only change position when handle is interacted with (useful for touch devices). */
    onlyHandleDraggable?: boolean;
    /** Callback on position change with position as percentage. */
    onPositionChange?: (position: ReactCompareSliderPropPosition) => void;
}
/** Root Comparison slider. */
export declare const ReactCompareSlider: React.FC<ReactCompareSliderProps & React.HtmlHTMLAttributes<HTMLDivElement>>;
