import { useCallback } from 'react';
// import { useGasPrice } from 'state/user/hooks';
// import { calculateGasMargin } from 'utils';
import { client } from '@/utils/wagmi';
import type { ContractFunctionArgs, ContractFunctionName, EstimateContractGasParameters } from 'viem';
import { Abi, Account, Address, CallParameters, Chain, WriteContractParameters } from 'viem';
import { useChainId, useWalletClient } from 'wagmi';
import useWallet from './useWallet';
import { calculateGasMargin } from '@/utils';

export function useCallWithGasPrice() {
    const { chain } = useWallet();
    const { data: walletClient } = useWalletClient();

    const callWithGasPriceWithSimulate = useCallback(
        async <TAbi extends Abi | unknown[], functionName extends ContractFunctionName<TAbi, 'nonpayable' | 'payable'>, args extends ContractFunctionArgs<TAbi, 'nonpayable' | 'payable', functionName>>(
            // contract: { abi: TAbi; account: Account | undefined; chain: Chain | undefined; address: Address } | null,
            contract: { abi: TAbi; address: Address } | null,
            methodName: functionName,
            methodArgs?: args,
            overrides?: Omit<CallParameters, 'chain' | 'to' | 'data'>
        ): Promise<{ hash: Address }> => {
            if (!contract) {
                throw new Error('No valid contract');
            }
            if (!walletClient) {
                throw new Error('No valid wallet connect');
            }

            const _overrides = overrides || {};
            const { gas: gas_, ...overrides_ } = _overrides;
            let gas = gas_;
            if (!gas) {
                gas = await client(chain).estimateContractGas({
                    abi: contract.abi,
                    address: contract.address,
                    account: walletClient.account,
                    functionName: methodName,
                    args: methodArgs,
                    value: 0n,
                    ...overrides_
                } as unknown as EstimateContractGasParameters);
                console.log('gas', gas);
                _overrides['gas'] = calculateGasMargin(gas);
            }

            const res = await walletClient.writeContract({
                abi: contract.abi,
                address: contract.address,
                account: walletClient.account,
                functionName: methodName,
                args: methodArgs,
                // gasPrice,
                // for some reason gas price is insamely high when using maxuint approval, so commenting out for now
                // gas: calculateGasMargin(gas),
                value: 0n,
                ...overrides_
            } as unknown as WriteContractParameters);

            const hash = res;

            return {
                hash
            };
        },
        [walletClient, chain]
    );

    return { callWithGasPrice: callWithGasPriceWithSimulate };
}
