import '@rainbow-me/rainbowkit/styles.css';

import { darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { useMemo, type PropsWithChildren } from 'react';
import { WagmiProvider as WagmiConfig } from 'wagmi';
import { config, chains, initialChain } from '@/config/wagmiClient.config';
import { useOrderInfo } from '@/state/order/hooks';

export interface WagmiProviderProps extends PropsWithChildren {}

export function WagmiProvider(props: WagmiProviderProps) {
    const [orderInfo] = useOrderInfo();
    const _initialChain = useMemo(() => {
        const chainConfig = JSON.parse(process.env.EVM_CHAIN!);
        const chainId = Number(chainConfig[orderInfo.payChannel] || initialChain.id);
        return chains.find((ele: any) => ele.id === chainId);
    }, [orderInfo?.payChannel]);

    return (
        <WagmiConfig config={config}>
            <RainbowKitProvider
                locale={'en'} //
                initialChain={_initialChain}
                showRecentTransactions
                theme={darkTheme()}
            >
                {props.children}
            </RainbowKitProvider>
        </WagmiConfig>
    );
}
