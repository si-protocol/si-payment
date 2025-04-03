import { type Chain, connectorsForWallets } from '@rainbow-me/rainbowkit';
import { coinbaseWallet, metaMaskWallet, okxWallet, rabbyWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';
import { type Config, createConfig, http, createStorage, cookieStorage } from 'wagmi';
import { mainnet, bsc, bscTestnet, sepolia } from 'wagmi/chains';

export const chains: any = ['production', 'preview'].includes(process.env.APP_ENV!) ? ([mainnet, bsc] as Chain[]) : ([sepolia, bscTestnet] as Chain[]);
// export const chains = [mainnet, bsc, sepolia, bscTestnet] as const satisfies Chain[];

export const connectors = connectorsForWallets(
    [
        {
            groupName: 'Recommended',
            wallets: [metaMaskWallet, walletConnectWallet, coinbaseWallet, rabbyWallet, okxWallet]
        }
    ],
    {
        projectId: process.env.W3M_PROJECT_ID!,
        appName: 'example-wallet'
    }
);

export const initialChain = chains[0];

export const config = createConfig({
    chains,
    connectors,
    ssr: true,
    multiInjectedProviderDiscovery: true,
    transports: {
        [mainnet.id]: http(),
        [bsc.id]: http(),
        [sepolia.id]: http(),
        [bscTestnet.id]: http()
    }
    // storage: createStorage({
    //     storage: cookieStorage
    // }),
    // storage: createStorage({
    //     storage: {
    //         getItem: () => null,
    //         setItem: () => undefined,
    //         removeItem: () => undefined
    //     }
    // }),
} as any) as Config;
