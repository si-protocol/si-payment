import { FC, ReactElement, useEffect } from 'react';
import css from '../styles/thank.module.scss';
import classNames from 'classnames';
import { useOrderInfo, useOrderType, usePayTokenInfo } from '@/state/order/hooks';
import { $hash } from '@/utils/met';
import moment from 'moment';
import { useCallbackUrl } from '@/state/base/hooks';
import { useRouter } from 'next/router';
const Thank: FC = (): ReactElement => {
    const [orderInfo] = useOrderInfo();
    const [payTokenInfo] = usePayTokenInfo();
    const [orderType] = useOrderType();
    const [callbackUrl] = useCallbackUrl();
    const router = useRouter();

    useEffect(() => {
        const timer = setInterval(() => {
            window.location.href = callbackUrl as string;
        }, 3000);
        return () => {
            clearInterval(timer);
        };
    }, [callbackUrl]);
    return (
        <div className={css.main}>
            <img className="tag" src="/images/check.svg" alt="" />
            <h4>Thanks for your order.</h4>
            {orderType === 'sharePayment' && (
                <>
                    <p className={css.desc}>The proceeds are generated hourly and will be automatically credited to your account at 00:00 a.m. each day.</p>
                    <div className={css.info}>
                        <div className={css.line}>
                            <span>Deposit Node</span>
                            <div className={css.cont}>
                                <img src={orderInfo.product?.image} className={css.type} alt="" />
                                {orderInfo.product?.name}
                            </div>
                        </div>
                        <div className={css.line}>
                            <span>Deposit Amount</span>
                            <b>{orderInfo.quantity}</b>
                        </div>
                        <div className={css.line}>
                            <span>Cost</span>
                            <div className={css.cont}>
                                <img src={payTokenInfo.images} className={css.type} alt="" />
                                {orderInfo.amount} {orderInfo.payCurrency}
                            </div>
                        </div>
                        <div className={css.line}>
                            <span>Valid days</span>
                            <b>{orderInfo.product.duration} Days</b>
                        </div>
                        <div className={css.line}>
                            <span>From Order ID</span>
                            <b>{$hash(orderInfo._id, 4)}</b>
                        </div>
                        <div className={css.process}>
                            <span>Mining date</span>
                            <b>{moment(orderInfo.payAt).utc().format('YYYY-MM-DD HH:mm')}(UTC)</b>
                            <img src="/images/thanks/round.svg" alt="Completed Payment" className={css.round} />
                            <img src="/images/thanks/line.png" alt="Completed Payment" className={css.border} />
                        </div>
                        <div className={css.process}>
                            <span>Earning calculation time</span>
                            <b>{moment(orderInfo.startAt).utc().format('YYYY-MM-DD HH:mm')}(UTC)</b>
                            <img src="/images/thanks/round.svg" alt="Completed Payment" className={css.round} />
                            <img src="/images/thanks/line.png" alt="Completed Payment" className={css.border} />
                        </div>
                        <div className={classNames(css.process, css.last)}>
                            <span>Earning distribution time</span>
                            <b>{moment(orderInfo.startAt).add(1, 'd').utc().format('YYYY-MM-DD HH:mm')}(UTC)</b>
                            <img src="/images/thanks/round.svg" alt="Completed Payment" className={css.round} />
                        </div>
                    </div>
                </>
            )}

            <div
                className={css.back}
                onClick={async () => {
                    const callbackUrl = router.query.callbackurl || `${window.location.origin}/user/balance`;
                    window.location.href = callbackUrl as any;
                }}
            >
                Go back
            </div>
        </div>
    );
};

export default Thank;
