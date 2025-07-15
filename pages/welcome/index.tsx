import { FC, ReactElement, useEffect } from 'react';
import css from './index.module.scss';
const Welcome: FC = (): ReactElement => {
    useEffect(() => {
        console.log('Welcome-----');
    }, []);
    return (
        <div className={css.main}>
            <h4>Welcome to Taoillium Pay</h4>
            <p>Checkout from Si using Pay</p>
            <p>Earn Rewards from your crypto payments</p>
        </div>
    );
};

export default Welcome;
