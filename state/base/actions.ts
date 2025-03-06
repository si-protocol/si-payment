import { createAction } from '@reduxjs/toolkit';
import { ProcessTransition } from './reducer';

export const setInternalError = createAction<boolean>('base/setInternalError');
export const setProcessTransition = createAction<ProcessTransition>('base/setProcessTransition');
export const setInternalDesc = createAction<string>('base/setInternalDesc');
export const setWebsocket = createAction<any>('base/setWebsocket');
export const setCallbackUrl = createAction<string>('base/setCallbackUrl');
