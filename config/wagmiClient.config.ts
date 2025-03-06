import { type Chain, connectorsForWallets } from '@rainbow-me/rainbowkit';
import { coinbaseWallet, metaMaskWallet, okxWallet, rabbyWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';
import { createClient } from 'viem';
import { type Config, createConfig, http, createStorage, cookieStorage } from 'wagmi';
import { mainnet as builtInMainnet, bsc, bscTestnet, sepolia } from 'wagmi/chains';

const mainnet = process.env.ETH_RPC
    ? ({
        ...builtInMainnet,
        rpcUrls: {
            default: {
                http: [process.env.ETH_RPC] // Custom rpc
            }
        }
    } as const)
    : builtInMainnet;

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
    client({ chain }) {
        return createClient({
            chain,
            transport: http(undefined, {
                batch: true
            })
        });
    }
}) as Config;
