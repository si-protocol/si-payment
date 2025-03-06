import { useCallback, useState } from 'react';
import { client } from '../utils/wagmi';
import useWallet from './useWallet';
import abi_erc20 from '../abi/abi_erc20.json';
import { Address } from 'viem';
import { $shiftedBy, $shiftedByFixed } from '@/utils/met';

function useEvmBalance(): [string | number, (token: Address, user?: Address) => Promise<any>] {
    const { chain, account } = useWallet();
    const [balance, setBalance] = useState<string | number>(0);

    const getBalance = useCallback(
        async (tokenAddress: Address, user?: Address) => {
            try {
                let _balance = '0';
                if (tokenAddress !== '0x0000000000000000000000000000000000000000') {
                    const [decimals, result]: any = await Promise.all([
                        client(chain).readContract({ abi: abi_erc20, address: tokenAddress, functionName: 'decimals', args: [] }),
                        client(chain).readContract({ abi: abi_erc20, address: tokenAddress, functionName: 'balanceOf', args: [user || account] })
                    ]);
                    _balance = $shiftedBy(result, -1 * decimals);
                } else {
                    const result: any = await client(chain).getBalance({ address: user || (account as any) });
                    _balance = $shiftedBy(result, -18);
                }
                setBalance(_balance);
                return _balance;
            } catch (e: any) {
                console.error('fetchTokenInfo error:', e.message);
                throw new Error(e.message);
            }
        },
        [chain, account]
    );
    return [balance, getBalance];
}

export default useEvmBalance;
