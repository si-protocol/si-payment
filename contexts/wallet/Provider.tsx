import { createContext, FC, ReactElement, useMemo, ReactNode, useEffect } from 'react';
import { Address, Chain } from 'viem';
import { useAccount, useBlockNumber, useChainId, useChains, useWalletClient } from 'wagmi';
import { chains, initialChain } from '@/config/wagmiClient.config';
import { useAccountModal, useChainModal } from '@rainbow-me/rainbowkit';
import { WalletContextApi } from './types';

export const WalletContext = createContext<WalletContextApi<Chain, Address> | undefined>(undefined);

type WalletProps = {
    children: ReactNode;
};

export const WalletProvider: FC<WalletProps> = ({ children }): ReactElement => {
    const chainList = useChains();
    // const chainId = useChainId();
    const { address, chainId } = useAccount();
    const { openAccountModal } = useAccountModal();
    const { data: walletClient } = useWalletClient();

    // const { data, error } = useBlockNumber();

    const isSuperChain: boolean = useMemo(() => {
        return !!openAccountModal;
    }, [openAccountModal]);

    const ready = useMemo(() => {
        if (isSuperChain && walletClient) return true;
        else return false;
    }, [isSuperChain, walletClient]);

    const chain = useMemo(() => {
        const target = chainList.find((ele) => ele.id === chainId);
        return target || initialChain;
    }, [chainList, chainId]);

    return <WalletContext.Provider value={{ account: address, chainId, chain, ready, isSuperChain }}>{children}</WalletContext.Provider>;
};
