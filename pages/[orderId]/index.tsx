import { FC, ReactElement } from 'react';
import dynamic from 'next/dynamic';

// import Payment from 'views/payment';

const Payment = dynamic(() => import('@/views/payment'), {
    ssr: false
});

const PaymentPage: FC = (): ReactElement => {
    return <Payment />;
};

export default PaymentPage;
