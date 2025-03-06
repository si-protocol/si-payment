import { client } from '@/utils/wagmi';
import useWallet from './useWallet';
import { Account, Address, EstimateGasParameters, SendTransactionParameters } from 'viem';
import { useCallback, useState } from 'react';
import { useWalletClient } from 'wagmi';
import { calculateGasMargin } from '@/utils';

type SendTransaction = {
    account?: Account | Address;
    to: Address;
    value: string;
};
export default function useTransaction() {
    const { chain } = useWallet();
    const { data: walletClient } = useWalletClient();
    const [loading, setLoading] = useState<boolean>(false);

    const sendTransaction = useCallback(
        async (data: SendTransaction) => {
            const gas = await client(chain).estimateGas(data as unknown as EstimateGasParameters);

            const hash = await walletClient!.sendTransaction({
                ...data,
                // gasPrice,
                gas: calculateGasMargin(gas)
            } as unknown as SendTransactionParameters);
            return {
                hash
            };
        },
        [chain, walletClient]
    );

    return { sendTransaction };
}
