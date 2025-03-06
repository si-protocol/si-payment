import { FC, ReactElement } from 'react';
import css from '../styles/process.module.scss';
import classNames from 'classnames';
const Process: FC = (): ReactElement => {
    return (
        <div className={css.main}>
            <h5>Transaction in progress</h5>
            <div className={css.process}>
                <div className={classNames(css.lib, css.active)}>
                    <div className={css.left}></div>
                    <div className={css.round}>
                        <img src="/images/dui.svg" alt="" />
                    </div>
                    <div className={css.right}></div>

                    <p>Submitted</p>
                </div>
                <div className={classNames(css.lib, css.ing)}>
                    <div className={css.round}></div>
                    <div className={css.left}></div>
                    <div className={css.round}>
                        <img className={css.loading} src="/images/loading.svg" alt="" />
                    </div>
                    <div className={css.right}></div>
                    <p>Processing</p>
                </div>
                <div className={css.lib}>
                    <div className={css.left}></div>
                    <div className={css.round}>{/* <img src="/images/dui.svg" alt="" /> */}</div>
                    <div className={css.right}></div>
                    <p>Completing</p>
                </div>
            </div>
        </div>
    );
};

export default Process;
