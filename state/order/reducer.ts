import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    orderInfo: {},
    depositInfo: {},
    payTokenInfo: {
        tokenId: '',
        tokenSymbol: '',
        tokenAddress: '',
        tokenDecimals: 18,
        image: '',
        price: ''
    },
    orderType: 'deposit',
    paymentType: 'EVM',
    paymentSymbol: 'SOL'
};

const OrderInfoSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setOrderInfo(state, { payload: data }) {
            let { result, type } = data;
            if (!type) type = state.orderType;
            if (type === 'deposit') {
                state.depositInfo = { ...state.depositInfo, ...result };
            } else if (type === 'sharePayment') {
                state.orderInfo = { ...state.orderInfo, ...result };
            }
            state.orderType = type;
        },
        setDepositInfo(state, { payload: depositInfo }) {
            state.depositInfo = depositInfo;
        },
        setOrderType(state, { payload: orderType }) {
            state.orderType = orderType;
        },
        setPaymentType(state, { payload: paymentType }) {
            state.paymentType = paymentType;
        },
        setPayTokenInfo(state, { payload: tokenInfo }) {
            state.payTokenInfo = tokenInfo;
        },
        setPaymentSymbol(state, { payload: symbol }) {
            state.paymentSymbol = symbol;
        }
    }
});
export default OrderInfoSlice.reducer;
