import { createAction } from '@reduxjs/toolkit';

export const setOrderInfo = createAction<{ [key: string]: any }, string>('order/setOrderInfo');
export const setPayTokenInfo = createAction<{ [key: string]: any }>('order/setPayTokenInfo');
export const setOrderType = createAction<string>('order/setOrderType');
export const setPaymentType = createAction<string>('order/setPaymentType');
export const setPaymentSymbol = createAction<string>('order/setPaymentSymbol');
