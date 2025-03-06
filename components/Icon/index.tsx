import React, { SVGAttributes } from 'react';
import Svg, { SvgProps } from './Svg';

export const IconWarning: React.FC<SvgProps> = (props) => {
    return (
        <Svg {...props} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.72 5.47995L2.42669 24.3333C1.95288 25.1538 1.95005 26.1641 2.41926 26.9873C2.88847 27.8105 3.75924 28.3229 4.70669 28.3333H27.2934C28.2408 28.3229 29.1116 27.8105 29.5808 26.9873C30.05 26.1641 30.0472 25.1538 29.5734 24.3333L18.28 5.47995C17.7966 4.68299 16.9321 4.19629 16 4.19629C15.0679 4.19629 14.2034 4.68299 13.72 5.47995Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M16 12.333V17.6663" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <ellipse cx="15.9998" cy="23.0003" rx="1.33333" ry="1.33333" fill="currentColor" />
        </Svg>
    );
};

export const IconError: React.FC<SvgProps> = (props) => {
    return (
        <Svg {...props} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" />
            <path d="M20 12L12 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20 20L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
};

export const IconSuccess: React.FC<SvgProps> = (props) => {
    return (
        <Svg {...props} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.5 13L14.1666 20L10.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
};
export const IconCancel: React.FC<SvgProps> = (props) => {
    return (
        <Svg viewBox="0 0 24 24" fill="none" {...props}>
            <path d="M7 7L17 17M7 17L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
};
