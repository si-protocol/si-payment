import { useCallback } from 'react';
import useWallet from './useWallet';
import { useSignMessage, useWalletClient } from 'wagmi';

function useSign(): (message: string) => Promise<any> {
    const { ready } = useWallet();
    const { signMessageAsync } = useSignMessage();
    // const { data: walletClient } = useWalletClient();

    const sign = useCallback(
        async (message: string) => {
            try {
                if (!ready) return;
                const signed = await signMessageAsync({ message });

                // or
                // const signed = walletClient!.signMessage({ message });

                return signed;
            } catch (e: any) {
                console.error('useSign error:::', e.message);
                throw new Error(e.message);
            }
        },
        [ready]
    );
    return sign;
}

export default useSign;
