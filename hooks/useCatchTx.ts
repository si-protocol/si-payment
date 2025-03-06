import { useCallback, useState } from 'react';
import { usePublicClient } from 'wagmi';
import { Address, BlockNotFoundError, Hash, TransactionNotFoundError, TransactionReceiptNotFoundError, WaitForTransactionReceiptTimeoutError } from 'viem';
import { sleep } from 'sleep-ts';
import useWallet from './useWallet';

export default function useCatchTx() {
    const { chainId } = useWallet();
    const provider = usePublicClient({ chainId: chainId! });
    const [loading, setLoading] = useState<boolean>(false);
    const [hash, setHash] = useState<string>('');

    const fetchWithCatchTx = useCallback(
        async (callTx: () => Promise<{ hash: Address } | Hash | undefined>, confirmingTransaction?: (hash: string) => void) => {
            let tx: { hash: Address } | Hash | null | undefined = null;
            try {
                setLoading(true);
                tx = await callTx();
                if (!tx || !provider) {
                    return null;
                }

                const hash = typeof tx === 'string' ? tx : tx.hash;
                setHash(hash);
                confirmingTransaction && confirmingTransaction(hash);

                let receipt: any = null,
                    i = 0;
                await sleep(5000);

                while (i < 20) {
                    try {
                        receipt = await provider.getTransactionReceipt({ hash });
                        i = 100;
                    } catch (error) {
                        if (error instanceof TransactionNotFoundError) {
                            // throw new Error(`Transaction not found: ${hash}`)
                            console.error(`Transaction not found: ${hash}`);
                        } else if (error instanceof TransactionReceiptNotFoundError) {
                            // throw new Error(`Transaction receipt not found: ${hash}`)
                            console.error(`Transaction receipt not found: ${hash}`);
                        } else if (error instanceof BlockNotFoundError) {
                            // throw new Error(`Block not found for transaction: ${hash}`)
                            console.error(`Block not found for transaction: ${hash}`);
                        } else if (error instanceof WaitForTransactionReceiptTimeoutError) {
                            // throw new Error(`Timeout reached when fetching transaction receipt: ${hash}`)
                            console.error(`Timeout reached when fetching transaction receipt: ${hash}`);
                        }
                        await sleep(5000);
                        i++;
                    }
                }

                receipt = await provider.getTransactionReceipt({ hash });
                if (receipt?.status === 'success') {
                    return receipt;
                }
                throw Error('Failed');
            } catch (e: any) {
                throw e;
            } finally {
                setLoading(false);
            }
        },
        [provider]
    );
    return { fetchWithCatchTx, loading, hash };
}
