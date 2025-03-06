import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { LedgerWalletAdapter } from '@solana/wallet-adapter-ledger';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { SlopeWalletAdapter } from '@solana/wallet-adapter-slope';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { SolletWalletAdapter } from '@solana/wallet-adapter-sollet';
import { TorusWalletAdapter } from '@solana/wallet-adapter-torus';
import { clusterApiUrl } from '@solana/web3.js';
import { ReactNode, useMemo } from 'react';

export function SolanaProvider({ children }: { children: ReactNode }) {
    const network = WalletAdapterNetwork.Mainnet;
    // const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const endpoint = useMemo(() => `https://${process.env.SOL_NETWORK}.helius-rpc.com/?api-key=25f3663d-937e-4f7c-9460-511a2abd2d54`, [network]);

    // @ts-ignore
    const wallets: Adapter[] = useMemo(() => [new PhantomWalletAdapter(), new TorusWalletAdapter(), new LedgerWalletAdapter(), new SolletWalletAdapter({ network }), new SlopeWalletAdapter(), new SolflareWalletAdapter()], [network]);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect={true}>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}
