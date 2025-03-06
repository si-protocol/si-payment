// 'use client';

import { FC, ReactElement, useState, useEffect } from 'react';
import css from './index.module.scss';
import { useCallbackUrl } from '@/state/base/hooks';
import Image from 'next/image';

const Header: FC<any> = (): ReactElement => {
    const [callbackUrl] = useCallbackUrl();

    return (
        <div className={css.header}>
            <img
                className={css.back}
                onClick={() => {
                    window.location.href = callbackUrl;
                    // window.location.href = window.location.origin;
                }}
                src="/images/back.svg"
                alt=""
            />
            <img src="/images/logo.svg" alt="" />
            SI Payment
        </div>
    );
};

export default Header;
