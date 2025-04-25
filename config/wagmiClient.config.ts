import { type Chain, connectorsForWallets } from '@rainbow-me/rainbowkit';
import { coinbaseWallet, metaMaskWallet, okxWallet, rabbyWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';
import { createClient, defineChain } from 'viem';
import { type Config, createConfig, http, createStorage, cookieStorage } from 'wagmi';
import { mainnet, bsc, bscTestnet, sepolia } from 'wagmi/chains';

const customBsc = defineChain({
    ...bsc,
    rpcUrls: {
        default: { http: ['https://bsc-mainnet.infura.io/v3/fb40925bfc8444b0bc5677870300725c', 'https://bsc.blockrazor.xyz', 'https://bsc-dataseed1.defibit.io'] }
    }
});

const customMainnet = defineChain({
    ...mainnet,
    rpcUrls: {
        default: {
            http: ['https://mainnet.infura.io/v3/fb40925bfc8444b0bc5677870300725c', 'https://rpc.mevblocker.io']
        }
    }
});

export const chains: [Chain, ...Chain[]] = ['production', 'preview'].includes(process.env.APP_ENV!) ? [customMainnet, customBsc] : [sepolia, bscTestnet];
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
    client({ chain }: any) {
        return createClient({ chain, transport: http() });
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
