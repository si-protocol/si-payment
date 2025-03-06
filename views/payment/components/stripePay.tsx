import Server from '@/service/api';
import { useOrderInfo, useOrderType } from '@/state/order/hooks';
import { useInternalDesc, useInternalError } from '@/state/base/hooks';
import Button from '@/components/Button';
import { useState } from 'react';
import { $openLink } from '@/utils/met';

const StripePay = () => {
    const [orderInfo] = useOrderInfo();
    const [orderType] = useOrderType();
    const [, handInternalError] = useInternalError();
    const [, handInternalDesc] = useInternalDesc();
    const [loading, setLoading] = useState(false);

    const payment = async () => {
        try {
            setLoading(true);
            const params = { channel: 'STRIPE', type: orderType === 'deposit' ? 'deposit' : 'sharePayment' };
            const result = await Server.payTransaction(orderInfo._id, params);
            $openLink(result?.url);
            // window.open(result?.url, 'blank');
        } catch (e: any) {
            console.error('error', e.message);
            handInternalError(true);
            handInternalDesc(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button loading={loading} onClick={payment}>
            Pay
        </Button>
    );
};
export default StripePay;
