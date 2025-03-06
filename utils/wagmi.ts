import { chains, initialChain } from '@/config/wagmiClient.config';
import { Chain, createClient, createPublicClient, http } from 'viem';

export const client = (chain: Chain) =>
    createPublicClient({
        chain: chain,
        transport: http(undefined, {
            batch: true
        })
    });
