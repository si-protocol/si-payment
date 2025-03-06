import { createSlice } from '@reduxjs/toolkit';

export enum ProcessTransition {
    submit = 'submit',
    process = 'process',
    fail = 'fail',
    success = 'success'
}

const initialState = {
    ws: null,
    internalError: false,
    internalDesc: 'here is a fatal error with this app. Internal Error. Please return back to Si.',
    processTransition: ProcessTransition.submit,
    callbackUrl: ''
};

const BaseSlice = createSlice({
    name: 'base',
    initialState,
    reducers: {
        setInternalError(state, { payload: flag }) {
            state.internalError = flag;
        },
        setInternalDesc(state, { payload: desc }) {
            state.internalDesc = desc;
        },
        setWebsocket: (state, action: any) => {
            state.ws = action.payload;
        },
        setCallbackUrl: (state, { payload: url }) => {
            state.callbackUrl = url;
        },
        setProcessTransition: (state, { payload: process }) => {
            state.processTransition = process;
        }
    }
});
export default BaseSlice.reducer;
