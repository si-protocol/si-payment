import { createAction } from '@reduxjs/toolkit';

export const setBalance = createAction<string | number>('chain/setBalance');
export const setAddress = createAction<string>('chain/setAddress');
