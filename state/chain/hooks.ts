import { useSelector } from 'react-redux';
import { useCallback } from 'react';
import { AppState, useAppDispatch } from '../index';
import { setBalance, setAddress } from './actions';

export function useAddress(): [string, (address: string) => void] {
    const dispatch = useAppDispatch();

    const address = useSelector<AppState, AppState['chain']['address']>((state: AppState) => state.chain.address);

    const handAddress = useCallback(
        async (address: string) => {
            dispatch(setAddress(address));
        },
        [dispatch]
    );

    return [address, handAddress];
}

export function useBalance(): [string | number, (balance: string | number) => void] {
    const dispatch = useAppDispatch();

    const balance = useSelector<AppState, AppState['chain']['balance']>((state: AppState) => state.chain.balance);

    const handBalance = useCallback(
        async (balance: string | number) => {
            dispatch(setBalance(balance));
        },
        [dispatch]
    );

    return [balance, handBalance];
}
