import { useSelector } from 'react-redux';
import { useCallback } from 'react';
import { AppState, useAppDispatch } from '../index';
import { setInternalError, setInternalDesc, setWebsocket, setProcessTransition, setCallbackUrl } from './actions';
import { ProcessTransition } from './reducer';

export function useProcessTransition(): [ProcessTransition, (step: ProcessTransition) => void] {
    const dispatch = useAppDispatch();

    const processTransition = useSelector<AppState, AppState['base']['processTransition']>((state: AppState) => state.base.processTransition);

    const handProcessTransition = useCallback(
        async (step: ProcessTransition) => {
            dispatch(setProcessTransition(step));
        },
        [dispatch]
    );

    return [processTransition, handProcessTransition];
}

export function useInternalError(): [boolean, (flag: boolean) => void] {
    const dispatch = useAppDispatch();

    const internalError = useSelector<AppState, AppState['base']['internalError']>((state: AppState) => state.base.internalError);

    const handInternalError = useCallback(
        async (flag: boolean) => {
            dispatch(setInternalError(flag));
        },
        [dispatch]
    );

    return [internalError, handInternalError];
}

export function useInternalDesc(): [string, (desc: string) => void] {
    const dispatch = useAppDispatch();

    const internalDesc = useSelector<AppState, AppState['base']['internalDesc']>((state: AppState) => state.base.internalDesc);

    const handInternalDesc = useCallback(
        async (desc: string) => {
            dispatch(setInternalDesc(desc));
        },
        [dispatch]
    );

    return [internalDesc, handInternalDesc];
}

export function useCallbackUrl(): [string, (url: string) => void] {
    const dispatch = useAppDispatch();

    const callbackUrl = useSelector<AppState, AppState['base']['callbackUrl']>((state: AppState) => state.base.callbackUrl);

    const handCallbackUrl = useCallback(
        async (url: string) => {
            dispatch(setCallbackUrl(url));
        },
        [dispatch]
    );

    return [callbackUrl, handCallbackUrl];
}

export function useWebsocket(): [any, (socket: any) => void] {
    const dispatch = useAppDispatch();

    const ws = useSelector<AppState, AppState['base']['ws']>((state: AppState) => state.base.ws);

    const handWs = useCallback(
        async (socket: any) => {
            dispatch(setWebsocket(socket));
        },
        [dispatch]
    );

    return [ws, handWs];
}
