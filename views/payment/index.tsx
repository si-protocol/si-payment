import { FC, ReactElement, useEffect, useLayoutEffect, useRef } from 'react';
import { PayInfo, TransactionFailed, Error, Process, Thank } from './components';
import { useCallbackUrl, useInternalDesc, useInternalError, useProcessTransition, useWebsocket } from '@/state/base/hooks';
import { useOrderInfo, useOrderType } from '@/state/order/hooks';
import { useRouter } from 'next/router';
import { useDebounce } from '@/hooks';
import { io } from 'socket.io-client';
import { ProcessTransition } from '@/state/base/reducer';
import { useDisconnect } from 'wagmi';
import { useWallet } from '@solana/wallet-adapter-react';
import { Notification } from '@/typing';

const Home: FC = (): ReactElement => {
    const { disconnect: solDisconnect } = useWallet();
    const { disconnect } = useDisconnect();

    const router = useRouter();
    const [websocket, handWebsocket] = useWebsocket();
    const { debounce } = useDebounce();
    const [internalError, handInternalError] = useInternalError();
    const [, handInternalDesc] = useInternalDesc();
    const [, handCallbackUrl] = useCallbackUrl();
    const [, { fetchOrder, updateOrder }] = useOrderInfo();
    const [, handOrderType] = useOrderType();
    const [processTransition, handProcessTransition] = useProcessTransition();

    const createIo = () => {
        const ws_io = io(process.env.WEBSOCKET_URL!, {
            path: '/ws',
            query: {
                roomId: router.query.orderId
            },
            reconnection: true,
            reconnectionAttempts: 3,
            reconnectionDelay: 3000,
            reconnectionDelayMax: 3000,
            forceNew: true
            // extraHeaders: {
            //     Authorization: `Bearer ${userBlock.token}`, //'Bearer h93t4293t49jt34j9rferek...'
            // },
        });

        ws_io.on('connect', () => {
            console.log('Connected to server');
            // ws_io.emit('message', 'test---msg');
        });

        ws_io.on('connect_error', (error: any) => {
            console.log('connect_error');
        });

        ws_io.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        ws_io.on('message', (msg: any) => {
            // console.log('message:', msg);
            try {
                msg = JSON.parse(msg);
                console.log('JSON.parse msg', msg);
                if (msg.messageType === 'paymentDetails') {
                    if (!msg.payload.paymentDetails) return;
                    const { orderStatus, transactionExisted, transactionStatus, order } = msg.payload.paymentDetails;
                    if (orderStatus === 'paid') {
                        handProcessTransition(ProcessTransition.success);
                        order && updateOrder(order);
                    } else if (transactionExisted && transactionStatus === 'pending') {
                        handProcessTransition(ProcessTransition.process);
                    } else if (transactionExisted && transactionStatus === 'failed') {
                        handProcessTransition(ProcessTransition.fail);
                    }
                } else if (msg.messageType === 'transactionRequestFailed') {
                    handInternalError(true);
                    // handProcessTransition(ProcessTransition.fail);
                    handInternalDesc(Notification.transactionRequestFailed);
                }
            } catch (e: any) {
                console.error('ws_io: ', e.message);
            }
        });

        ws_io.on('reconnect_attempt', () => {
            // this.reconnectionAttempts++;
            // if (this.reconnectionAttempts >= MAX_RECONNECTION_ATTEMPTS) {
            //   console.error('over max reconection attempts, socket close');
            //   socket.current.io.opts.reconnection = false; // Disable built-in reconnections
            //   socket.current.close(); // Close the socket manually
            // }
        });
        handWebsocket(ws_io);
    };

    const getInitData = async () => {
        try {
            // console.log('router.query.orderId', router.query);
            fetchOrder(router.query.orderId as string, router.query.type as string);
            createIo();
        } catch (e: any) {}
    };

    useEffect(() => {
        if (router.query.orderId) {
            const callbackUrl = router.query.callbackurl || `${window.location.origin}/user/balance`;
            handCallbackUrl(callbackUrl as string);
            if (websocket) {
                websocket.off(router.query.orderId);
                websocket.disconnect();
            }
            debounce(() => getInitData(), 1000);
        }
    }, [router.query.orderId]);

    useLayoutEffect(() => {
        try {
            setTimeout(() => {
                disconnect();
                solDisconnect();
            }, 1500);
        } catch (e) {}
    }, []);

    return (
        <>
            {internalError ? (
                <Error />
            ) : (
                <>
                    {processTransition === ProcessTransition.submit && <PayInfo />}
                    {processTransition === ProcessTransition.process && <Process />}
                    {processTransition === ProcessTransition.fail && <TransactionFailed />}
                    {processTransition === ProcessTransition.success && <Thank />}
                </>
            )}
        </>
    );
};

export default Home;
