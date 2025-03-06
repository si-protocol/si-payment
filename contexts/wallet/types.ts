export interface WalletContextApi<T, K> {
    account: K | undefined;
    chain: T;
    chainId: number | undefined;
    ready: boolean;
    isSuperChain: boolean;
}
