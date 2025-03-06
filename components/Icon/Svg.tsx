import styled, { css, keyframes } from 'styled-components';
import { SVGAttributes } from 'react';

export interface SvgProps extends SVGAttributes<HTMLOrSVGElement> {
    color?: string;
    spin?: boolean;
}

const Svg = styled.svg<SvgProps>`
    align-self: center; // Safari fix
    /* fill: ${({ color }) => color}; */
    flex-shrink: 0;
`;

Svg.defaultProps = {
    color: 'text',
    xmlns: 'http://www.w3.org/2000/svg'
};

export default Svg;
