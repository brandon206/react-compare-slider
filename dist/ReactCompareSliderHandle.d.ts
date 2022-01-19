import React from 'react';
import { ReactCompareSliderCommonProps } from './types';
/** Props for `ReactCompareSliderHandle`. */
export interface ReactCompareSliderHandleProps extends Pick<ReactCompareSliderCommonProps, 'portrait'> {
    /** Optional styles for handle the button. */
    buttonStyle?: React.CSSProperties;
    /** Optional styles for lines either side of the handle button. */
    linesStyle?: React.CSSProperties;
    /** Optional styles for the handle root. */
    style?: React.CSSProperties;
}
/** Default `handle`. */
export declare const ReactCompareSliderHandle: React.FC<ReactCompareSliderHandleProps>;
