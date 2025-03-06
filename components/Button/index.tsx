import { FC, ReactElement, ReactNode } from 'react';
import styles from './button.module.scss';
import cn from 'classnames';
import styled from 'styled-components';

interface ButtonProps {
    children: ReactNode;
    onClick?: Function;
    style?: Record<string, any>;
    id?: string;
    className?: string;
    loading?: boolean;
    disabled?: boolean;
}

const Button: FC<ButtonProps> = ({ children, onClick, style, id, className, loading, disabled }: ButtonProps): ReactElement => {
    return (
        <ButtonView id={id} className={cn(className, loading && 'loading', disabled && 'disabled')} style={style} onClick={() => !disabled && onClick && onClick()}>
            {loading && (
                <span className="loadingIcon">
                    <svg viewBox="0 0 1024 1024" focusable="false" data-icon="loading" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                        <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path>
                    </svg>
                </span>
            )}
            {children}
        </ButtonView>
    );
};

const ButtonView = styled.button`
    position: relative;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(0.16rem);
    padding: 0.1rem 0.3rem;
    border-radius: 0.26rem;
    display: inline-flex;
    color: #fff;
    font-size: 0.2rem;
    line-height: 120%;
    cursor: pointer;
    justify-content: center;
    align-items: center;

    &.disabled {
        cursor: not-allowed;
        color: #a3a3a3;
        background: rgb(222, 229, 237) !important;
    }
    &.loading::before {
        position: absolute;
        top: -1px;
        right: -1px;
        bottom: -1px;
        left: -1px;
        z-index: 1;
        border-radius: inherit;
        opacity: 0.35;
        transition: opacity 0.2s;
        font-size: 30px;
        content: '';
        pointer-events: none;
    }

    .loadingIcon {
        display: inline-block;
        margin-right: 10px;
        animation: rotate 1s infinite linear;
    }

    @media (max-width: 768px) {
        position: relative;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(0.16rem);
        padding: 0.1rem 0.2rem;
        border-radius: 0.16rem;
        display: inline-block;
        color: #fff;
        font-family: 'Gerbera';
        font-size: 0.16rem;
        line-height: 100%;
    }
`;

export default Button;
