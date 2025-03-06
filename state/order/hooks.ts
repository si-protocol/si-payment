import { useSelector } from 'react-redux';
import { useCallback, useMemo } from 'react';
import { AppState, useAppDispatch } from '../index';
import { setOrderInfo, setOrderType, setPaymentType, setPaymentSymbol, setPayTokenInfo } from './actions';
import { useInternalDesc, useInternalError, useProcessTransition } from '../base/hooks';
import Server from '@/service/api';
import { message } from 'antd';
import { ProcessTransition } from '../base/reducer';

export function useOrderInfo(): [{ [key: string]: any }, { fetchOrder: (orderId: string, orderType?: string) => Promise<any>; updateOrder: (order: any) => void }] {
    const dispatch = useAppDispatch();
    const [, handInternalError] = useInternalError();
    const [, handInternalDesc] = useInternalDesc();
    const [, handPayTokenInfo] = usePayTokenInfo();
    const [, handProcessTransition] = useProcessTransition();

    const depositInfo = useSelector<AppState, AppState['order']['depositInfo']>((state: AppState) => state.order.depositInfo);
    const orderInfo = useSelector<AppState, AppState['order']['orderInfo']>((state: AppState) => state.order.orderInfo);
    const orderType = useSelector<AppState, AppState['order']['orderType']>((state: AppState) => state.order.orderType);

    const order = useMemo(() => {
        if (orderType === 'deposit') return depositInfo;
        else return orderInfo;
    }, [orderType, orderInfo, depositInfo]);

    const fetchOrder = useCallback(
        async (orderId: string, type?: string) => {
            try {
                if (!type) type = orderType;
                let result: any;
                if (type === 'deposit') {
                    result = await Server.getDepositInfo(orderId);
                } else if (type === 'sharePayment') {
                    result = await Server.getOrderInfo(orderId);
                }
                if (result.statusCode) throw new Error(result.message);
                // const tokenInfo = await Server.tokens(result.tokenId);
                const tokenInfo = await Server.tokens(`${result.payChannel}:${result.payCurrency}`);

                if (result.status === 'submit') {
                    handProcessTransition(ProcessTransition.submit);
                } else if (result.status === 'paid') {
                    handProcessTransition(ProcessTransition.success);
                } else if (result.status === 'cancel') {
                    throw new Error('The order has been cancelled');
                } else if (result.status === 'failed') {
                    handProcessTransition(ProcessTransition.fail);
                }
                handPayTokenInfo(tokenInfo);
                handInternalError(false);
                dispatch(setOrderInfo({ result, type }));
            } catch (e: any) {
                message.error(e.message || 'fail');
                handInternalError(true);
                handInternalDesc(e.message);
            }
        },
        [dispatch, orderType, handPayTokenInfo]
    );

    const updateOrder = useCallback(
        async (order: any) => {
            dispatch(setOrderInfo({ result: order }));
        },
        [dispatch]
    );

    return [order, { fetchOrder, updateOrder }];
}

export function useOrderType(): [string, (orderType: string) => void] {
    const dispatch = useAppDispatch();

    const orderType = useSelector<AppState, AppState['order']['orderType']>((state: AppState) => state.order.orderType);

    const handOrderType = useCallback(
        async (orderType: string) => {
            dispatch(setOrderType(orderType));
        },
        [dispatch]
    );

    return [orderType, handOrderType];
}

export function usePaymentType(): [string, (paymentType: string) => void] {
    const dispatch = useAppDispatch();

    const paymentType = useSelector<AppState, AppState['order']['paymentType']>((state: AppState) => state.order.paymentType);

    const handPaymentType = useCallback(
        async (paymentType: string) => {
            dispatch(setPaymentType(paymentType));
        },
        [dispatch]
    );

    return [paymentType, handPaymentType];
}

export function usePaymentSymbol(): [string, (symbol: string) => void] {
    const dispatch = useAppDispatch();

    const paymentSymbol = useSelector<AppState, AppState['order']['paymentSymbol']>((state: AppState) => state.order.paymentSymbol);

    const handPaymentSymbol = useCallback(
        async (symbol: string) => {
            dispatch(setPaymentSymbol(symbol));
        },
        [dispatch]
    );

    return [paymentSymbol, handPaymentSymbol];
}

export function usePayTokenInfo(): [{ [key: string]: any }, (tokenInfo: { [key: string]: any }) => void] {
    const dispatch = useAppDispatch();

    const payTokenInfo = useSelector<AppState, AppState['order']['payTokenInfo']>((state: AppState) => state.order.payTokenInfo);

    const handPayTokenInfo = useCallback(
        async (tokenInfo: { [key: string]: any }) => {
            dispatch(setPayTokenInfo(tokenInfo));
        },
        [dispatch]
    );

    return [payTokenInfo, handPayTokenInfo];
}
