import { FC, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import css from '../styles/payInfo.module.scss';
import Button from '@/components/Button';
import Profile from './profile';
import { useAccount, useChainId, useChains, useDisconnect, useSwitchChain } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { $BigNumber, $hash, $momentTimes } from '@/utils/met';
import { message, Skeleton } from 'antd';
import { useOrderInfo, useOrderType, usePayTokenInfo } from '@/state/order/hooks';
import { useAddress, useBalance } from '@/state/chain/hooks';
import { useEvmBalance } from '@/hooks';
import useTransfer from '@/hooks/useTransfer';
import { useProcessTransition } from '@/state/base/hooks';
import Server from '@/service/api';
import { ProcessTransition } from '@/state/base/reducer';
import classNames from 'classnames';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import * as web3 from '@solana/web3.js';
import { Notification } from '@/typing';
import { QRCode } from './QRCode';
import StripePay from './stripePay';

const nav = [
    { title: 'Pay with Wallet', value: 'wallet' },
    { title: 'Pay with QR Code', value: 'qr' }
];

const chainConfig = JSON.parse(process.env.EVM_CHAIN!);

const PayInfo: FC = (): ReactElement => {
    // solana
    const { connected, publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();

    // wagim
    const { address, chainId, isConnected } = useAccount();
    const { switchChain } = useSwitchChain();
    const { openConnectModal } = useConnectModal();
    const { sendTransfer } = useTransfer();
    const { disconnect } = useDisconnect();

    // order
    const [orderInfo] = useOrderInfo();
    const [orderType] = useOrderType();
    const [, getEvmBalance] = useEvmBalance();
    const [balance, setBalance] = useBalance();
    const [userAddress, setAddress] = useAddress();
    const [payTokenInfo] = usePayTokenInfo();

    const [, handProcessTransition] = useProcessTransition();
    const [checkNav, setCheckNav] = useState<string>('wallet');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const payCountdownTimer = useRef<any>(null);

    const timer = useRef<any>(null);

    const [time, setTime] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    const insufficientBalance = useMemo(() => {
        if (Object.keys(orderInfo).length === 0) return false;
        return $BigNumber(orderInfo.amount).gt(balance);
    }, [orderInfo, balance]);

    const buyDisable = useMemo(() => {
        if (insufficientBalance) return true;
        if (orderType === 'sharePayment' && Object.values(time).reduce((cur, next) => cur + next, 0) === 0) return true;
        return false;
    }, [insufficientBalance, orderType, time]);

    const walletConnected = useMemo(() => {
        if (Object.keys(orderInfo).length === 0) return false;
        if (orderInfo.payChannel === 'SOL') return connected;
        else return isConnected;
    }, [orderInfo.payChannel, isConnected, connected]);

    const showSwitchChain = useMemo(() => {
        if (orderInfo.payChannel === 'SOL' || !walletConnected) return false;
        const needPayChainId = Number(chainConfig[orderInfo.payChannel]);
        if (needPayChainId === chainId) return false;
        return true;
    }, [walletConnected, orderInfo.payChannel, chainId]);

    const loopPayCountdown = () => {
        if (orderInfo.paymentExpirationTime) {
            const countdown: any = $momentTimes(orderInfo.paymentExpirationTime);
            setTime(countdown);

            clearInterval(payCountdownTimer.current);

            payCountdownTimer.current = setInterval(() => {
                const _date: any = $momentTimes(orderInfo.paymentExpirationTime);
                setTime(_date);
                if (Object.values(_date).reduce((cur: number, next: any) => cur + next, 0) === 0) {
                    clearInterval(payCountdownTimer.current);
                }
            }, 1000);
        }
    };

    const getSolErrorType = (error: any) => {
        if (error instanceof Error) {
            const message = error.message.toLowerCase();
            if (message.includes('user rejected') || message.includes('approval denied')) return Notification.declined;
            if (message.includes('0x0') && message.includes('instruction 0')) return Notification.duplicatePayment;
            if (message.includes('0x1') && message.includes('instruction 1')) return Notification.insufficentFunds;
            if (message === 'Transaction string is null') return Notification.transactionRequestFailed;
            if (message === 'Failed to parse transaction string') return Notification.transactionRequestFailed;
        }
        return Notification.simulatingIssue;
    };

    const getSelfBalance = async () => {
        try {
            let balance = 0;
            if (orderInfo.payChannel === 'SOL') {
                if (!publicKey) return;
                if (orderInfo.payCurrency === 'SOL') {
                    const _balance = await connection.getBalance(publicKey);
                    balance = _balance / LAMPORTS_PER_SOL;
                } else {
                    const TOKEN_MINT = payTokenInfo.tokenAddress;
                    const ataAddress = await getAssociatedTokenAddress(new PublicKey(TOKEN_MINT!), publicKey);
                    const result = await connection.getAccountInfo(ataAddress);
                    if (result) {
                        let tokenAcs: any = await connection.getTokenAccountBalance(ataAddress);
                        balance = tokenAcs.value.uiAmount;
                    }
                }
            } else {
                balance = await getEvmBalance(payTokenInfo.tokenAddress);
            }
            setBalance(Number($BigNumber(balance).toFixed(4, 1)));
        } catch (e: any) {
            console.error(e);
        }
    };

    const handLoopHash = (hash: string) => {
        setTimeout(async () => {
            const data = await Server.payHandle({
                txhash: `${hash}:${orderInfo.payChannel}`
            });
            if (!['finished', 'failed', 'success'].includes(data.transactionStatus)) {
                handLoopHash(hash);
            }
        }, 2000);
    };

    const handBuy = async () => {
        try {
            setLoading(true);
            if (orderInfo.payChannel === 'SOL') {
                const params = { account: publicKey!.toBase58(), channel: 'SOL', type: orderType === 'deposit' ? 'deposit' : 'sharePayment' };
                const result = await Server.payTransaction(orderInfo._id, params);
                const transactionString = result.transaction;
                // const transactionString ='"AvPBNVdAJQguPty9zlccq4Y+14QCofl6Ckhb/UgIX0H+HqLrqeZD6dflIH/MLbNiLOj46CNyPsq+j21cNSEK2Q0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgECBn4wCqqhmrTb1Vs9b2HS6u5dYD8bkyomxyxDFtIni65wvTAkX8cyXlylo7mxhAwPxGDHS8oNX6R/lMSYC2VwEY9EQtO3y8dWqDqXCzaQGGzP3wsCWqwpdnn2qiB7BexVWHb1vfu4UZBD0GmGmLhqVaR5aVGZDDDSMqAXPnqg/TYUO0Qss5EhV/E6kz0BNCgtAytf/s0Botvxt3kGCN8ALqcG3fbh12Whk9nL4UbO63msHLSF7V9bN5E6jPWFfv8AqWM1sRgsjDe65feBV/U4pWr0/VDQwT7wNYVwIx1vj3mjAQUEAgQDAQoMECcAAAAAAAAG"';
                if (!transactionString) {
                    throw new Error('Transaction string is null');
                }

                let transaction: web3.Transaction;
                try {
                    const buffer = Buffer.from(transactionString, 'base64');
                    transaction = web3.Transaction.from(buffer);
                } catch (error) {
                    throw new Error('Failed to parse transaction string');
                }

                await sendTransaction(transaction, connection);
                handProcessTransition(ProcessTransition.process);
            } else {
                const option = {
                    to: orderInfo.recipientAddress,
                    value: orderInfo.amount,
                    token: payTokenInfo.tokenAddress
                };
                const receipt = await sendTransfer(option, async (hash: string) => {
                    await Server.payTransaction(orderInfo._id, {
                        account: orderInfo.userId,
                        type: orderType,
                        channel: chainId,
                        txhash: hash
                    });
                    handLoopHash(hash);
                    handProcessTransition(ProcessTransition.process);
                });
                console.debug('receipt=======', receipt);
                // if (receipt.transactionHash) handLoopHash(receipt.transactionHash);
            }
        } catch (error: any) {
            // handInternalError(true);
            console.error('error:::::', error);
            handProcessTransition(ProcessTransition.fail);
            // handProcessTransition(ProcessTransition.submit);
            let errorDesc = error.message;
            if (orderInfo.payChannel === 'SOL') {
                errorDesc = getSolErrorType(error);
                // handInternalDesc(errorType);
            } else {
                // handInternalDesc(error?.message);
            }
            console.error('errorDesc===', errorDesc, '=====orderType::::', orderType);
            if ([Notification.simulatingIssue, Notification.declined, Notification.evmCancelPay].includes(errorDesc)) {
                if (orderType === 'deposit') Server.cancelDepositPay({ _id: orderInfo._id });
                else if (orderType === 'sharePayment') Server.cancelOrderPay({ orderId: orderInfo._id });
            }
            // message.error(errorDesc);
        } finally {
            setLoading(false);
        }
    };

    const handNav = (value: string) => {
        if (value !== 'qr') {
            setCheckNav(value);
        } else if (orderInfo.payChannel === 'SOL') {
            setCheckNav(value);
        }
    };

    const handSwitchEVMChain = () => {
        const needPayChainId = Number(chainConfig[orderInfo.payChannel]);
        switchChain({ chainId: needPayChainId });
    };

    useEffect(() => {
        if (!walletConnected) return;
        if (orderInfo.payChannel === 'SOL') {
            setAddress(publicKey!?.toBase58());
        } else {
            setAddress(address!);
        }
    }, [orderInfo, walletConnected, address, publicKey]);

    useEffect(() => {
        if (orderInfo && userAddress) {
            getSelfBalance();
            orderType === 'sharePayment' && loopPayCountdown();
        }
    }, [orderInfo, userAddress, chainId]);

    useEffect(() => {
        return () => {
            // timer.current && clearInterval(timer.current);
        };
    }, []);

    return (
        <div className={css.main}>
            {orderInfo.payChannel !== 'STRIPE' && (
                <div className={css.nav}>
                    {nav.map((ele) => (
                        <div key={ele.value} className={classNames(checkNav === ele.value ? css.check : '', orderInfo.payChannel !== 'SOL' && ele.value === 'qr' ? css.nav_disable : '')} onClick={() => handNav(ele.value)}>
                            {ele.title}
                        </div>
                    ))}
                </div>
            )}

            {Object.keys(orderInfo).length === 0 ? (
                <div className={css.dashboard}>
                    <div className={classNames(css.price, css.skeleton)}>
                        <Skeleton.Avatar className={css.avatar} active />
                        <Skeleton.Input className={css.block} active />
                    </div>
                    <div className={classNames(css.symbol, css.skeleton)}>
                        Pay with <Skeleton.Input className={css.block} active />
                    </div>
                </div>
            ) : (
                <div className={css.dashboard}>
                    <div className={css.price}>
                        {/* <img src={`/images/symbol/${orderInfo.payCurrency}.svg`} alt="" /> */}
                        <img src={payTokenInfo.image} alt="" />
                        {orderInfo.amount}
                    </div>
                    <div className={css.symbol}>
                        Pay with <div className={css.payCurrency}>{orderInfo.payCurrency}</div>
                    </div>
                </div>
            )}

            <div className={css.info}>
                <div className={css.line}>Cart {Object.keys(orderInfo).length === 0 ? <Skeleton.Input className={css.block} active /> : <span>{orderInfo.amount}</span>}</div>
                <div className={css.line}>Transaction Fee {Object.keys(orderInfo).length === 0 ? <Skeleton.Input className={css.block} active /> : <div className={css.fee}>Free</div>}</div>
            </div>

            {orderInfo.payChannel === 'STRIPE' ? (
                <div className={css.foot}>
                    <StripePay />
                </div>
            ) : (
                <>
                    {checkNav === 'wallet' ? (
                        <>
                            {Object.keys(orderInfo).length !== 0 && (
                                <>
                                    <div className={css.foot}>
                                        {!!walletConnected ? (
                                            <>
                                                {orderType === 'sharePayment' && (
                                                    <div className={css.pay_time}>
                                                        Pay time：
                                                        <b>
                                                            {time.minutes}:{time.seconds}
                                                        </b>
                                                    </div>
                                                )}

                                                <div className={css.profile} onClick={() => setIsProfileOpen(true)}>
                                                    <div>
                                                        <img src="/images/electric_bolt.svg" alt="" />
                                                        {$hash(userAddress, 4, 6)}
                                                    </div>
                                                    <img className={css.expand} src="/images/expand.svg" alt="" />
                                                </div>
                                                {Object.keys(orderInfo).length === 0 ? (
                                                    <Skeleton.Input className={css.block} active />
                                                ) : (
                                                    <>
                                                        {showSwitchChain ? (
                                                            <Button onClick={() => handSwitchEVMChain()}>Switch Chain</Button>
                                                        ) : (
                                                            <Button disabled={buyDisable} loading={loading} onClick={() => handBuy()}>
                                                                {insufficientBalance ? 'Insufficient balance' : 'Buy now'}
                                                            </Button>
                                                        )}
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {orderInfo.payChannel === 'SOL' ? (
                                                    <WalletMultiButton>
                                                        <Button>Connect wallet</Button>
                                                    </WalletMultiButton>
                                                ) : (
                                                    <Button
                                                        onClick={() => {
                                                            try {
                                                                disconnect();
                                                            } finally {
                                                                openConnectModal!();
                                                            }
                                                        }}
                                                    >
                                                        Connect wallet
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <QRCode />
                    )}
                </>
            )}

            <Profile open={isProfileOpen} handClose={() => setIsProfileOpen(false)} />
        </div>
    );
};

export default PayInfo;
