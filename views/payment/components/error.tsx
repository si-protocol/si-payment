import { FC, ReactElement } from 'react';
import css from '../styles/error.module.scss';
import { useCallbackUrl, useInternalDesc } from '@/state/base/hooks';

const Error: FC = (): ReactElement => {
    const [internalDesc] = useInternalDesc();
    const [callbackUrl] = useCallbackUrl();

    return (
        <div className={css.main}>
            <div className={css.info}>
                <img src="/images/waring.svg" alt="" />
                <h5>Internal Error</h5>
                <p>{internalDesc}</p>
            </div>
            <div
                className={css.back}
                onClick={() => {
                    window.location.href = callbackUrl;
                }}
            >
                Go back
            </div>
        </div>
    );
};

export default Error;
