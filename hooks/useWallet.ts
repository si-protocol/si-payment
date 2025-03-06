import { WalletContext } from '@/contexts/wallet';
import { useContext } from 'react';

const useWallet = () => {
    const walletContext = useContext(WalletContext);
    if (walletContext === undefined) {
        throw new Error('Wallet context undefined');
    }
    return walletContext;
};

export default useWallet;
