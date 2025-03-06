import QRCodeStyling from '@solana/qr-code-styling';
import { FC, useEffect, useMemo, useRef } from 'react';
import Server from '@/service/api';
import { useOrderInfo, useOrderType } from '@/state/order/hooks';
import { createQROptions } from '@/utils/solanaPayQRCode';
import styled from 'styled-components';
import { useAddress } from '@/state/chain/hooks';

export const QRCode: FC = () => {
    const [orderInfo] = useOrderInfo();
    const [orderType] = useOrderType();
    const [userAddress] = useAddress();

    // TODO: make sure there is a payment id and if not show a different image than QR Code
    const params = {
        account: userAddress,
        orderId: orderInfo._id,
        type: orderType === 'deposit' ? 'deposit' : 'sharePayment',
        channel: orderInfo.payChannel
    };
    const endpoint = Server.buildTransactionRequestEndpoint(params);
    const url = `solana:${encodeURIComponent(endpoint)}`;
    const options = useMemo(() => createQROptions(url, 200, 'transparent', 'black'), [url, 200]);

    const qr = useMemo(() => new QRCodeStyling(), []);
    useEffect(() => qr.update(options), [qr, options]);

    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (ref.current) {
            qr.append(ref.current);
        }

        // Add this return function to clean up the effect
        return () => {
            if (ref.current) {
                ref.current.innerHTML = '';
            }
        };
    }, [ref, qr]);

    return (
        <QrContent>
            <div ref={ref}></div>
            <p>Scan this code to pay with your Solana wallet</p>
        </QrContent>
    );
};

const QrContent = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin: 0.3rem auto 0;
    div {
        display: flex;
        justify-content: center;
    }
    p {
        text-align: center;
        font-size: 0.08rem;
        color: rgb(75, 85, 99);
    }
`;
