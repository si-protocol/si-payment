import { FC, ReactElement } from 'react';
import css from '../styles/transactionFailed.module.scss';
import { useProcessTransition } from '@/state/base/hooks';
import { ProcessTransition } from '@/state/base/reducer';
const TransactionFailed: FC = (): ReactElement => {
    const [, handProcessTransition] = useProcessTransition();

    return (
        <div className={css.main}>
            <h5>Transaction failed.</h5>
            <p>The transaction is failed. Please try again.</p>
            <div
                onClick={() => {
                    handProcessTransition(ProcessTransition.submit);
                }}
            >
                Retry the Transaction
            </div>
        </div>
    );
};

export default TransactionFailed;
