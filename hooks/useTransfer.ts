import { client } from '@/utils/wagmi';
import useWallet from './useWallet';
import { Account, Address, EstimateGasParameters, GetTransactionReceiptReturnType, SendTransactionParameters } from 'viem';
import { useCallback, useState } from 'react';
import { useWalletClient } from 'wagmi';
import { calculateGasMargin } from '@/utils';
import { useCallWithGasPrice } from './useCallWithGasPrice';
import abi_erc20 from '../abi/abi_erc20.json';
import BigNumber from 'bignumber.js';
import useTokenInfo from './useTokenInfo';
import useCatchTx from './useCatchTx';
import useTransaction from './useTransaction';
import { $BigNumber } from '@/utils/met';
import useEvmBalance from './useEvmBalance';

type SendTransaction = {
    account?: Account | Address;
    to: Address;
    value: number | string;
    token: Address;
};
export default function useTransfer() {
    const { chain } = useWallet();
    const { callWithGasPrice } = useCallWithGasPrice();
    const { data: walletClient } = useWalletClient();
    const { sendTransaction } = useTransaction();
    const [, getBalance] = useEvmBalance();
    const [, getTokenInfo] = useTokenInfo();
    const { fetchWithCatchTx, hash } = useCatchTx();
    const [loading, setLoading] = useState<boolean>(false);

    const sendTransfer = useCallback(
        async (data: SendTransaction, confirmingTransaction?: (hash: string) => void): Promise<GetTransactionReceiptReturnType> => {
            try {
                setLoading(true);
                const balance = await getBalance(data.token);
                if ($BigNumber(data.value).gt(balance)) throw new Error('Insufficient balance');
                const { decimals } = await getTokenInfo(data.token);
                const value = new BigNumber(data.value).shiftedBy(decimals).toFixed();
                let receipt: GetTransactionReceiptReturnType;
                if (data.token === '0x0000000000000000000000000000000000000000') {
                    receipt = await fetchWithCatchTx(() => sendTransaction({ to: data.to, value }), confirmingTransaction);
                } else {
                    receipt = await fetchWithCatchTx(
                        () =>
                            callWithGasPrice(
                                {
                                    abi: abi_erc20,
                                    address: data.token
                                },
                                'transfer',
                                [data.to, value]
                            ),
                        confirmingTransaction
                    );
                }
                // console.log('receipt', receipt, receipt.transactionHash);
                return receipt;
            } catch (error: any) {
                console.log('error.message', error);
                throw new Error(error.message.split('.')[0]);
            } finally {
                setLoading(false);
            }
        },
        [chain, walletClient, callWithGasPrice, getTokenInfo]
    );

    return { sendTransfer, loading, hash };
}
