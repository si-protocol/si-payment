import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    balance: 0,
    address: ''
};

const ChainSlice = createSlice({
    name: 'chain',
    initialState,
    reducers: {
        setBalance(state, { payload: balance }) {
            state.balance = balance;
        },
        setAddress(state, { payload: address }) {
            state.address = address;
        }
    }
});
export default ChainSlice.reducer;
