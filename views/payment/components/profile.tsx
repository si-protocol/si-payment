import { useAddress, useBalance } from '@/state/chain/hooks';
import { useOrderInfo } from '@/state/order/hooks';
import { $copy, $hash } from '@/utils/met';
import { useWallet } from '@solana/wallet-adapter-react';
import { Modal } from 'antd';
import { FC, ReactElement, useState } from 'react';
import styled from 'styled-components';
import { useDisconnect } from 'wagmi';

type IProps = {
    open: boolean;
    handClose: Function;
};

const Profile: FC<IProps> = ({ open, handClose }): ReactElement => {
    const { disconnect: solDisconnect } = useWallet();
    const { disconnect } = useDisconnect();
    const [address] = useAddress();
    const [balance] = useBalance();
    const [orderInfo] = useOrderInfo();
    const [copied, setCopied] = useState<boolean>(false);

    const handCopy = () => {
        if (copied) return;
        $copy(address);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    const handDisconnect = async () => {
        try {
            await disconnect();
            await solDisconnect();
        } catch (e) {}
        handClose();
    };

    return (
        <View centered open={open} onCancel={() => handClose()} footer={null}>
            <section>
                <img className="icon" src="/images/connected-icon.svg" alt="" />
                <h4>{$hash(address, 4, 6)}</h4>
                <p>
                    {balance} <span>{orderInfo.payCurrency}</span>
                </p>
                <div className="foot">
                    <div onClick={() => handDisconnect()}>
                        <img src="/images/logout.svg" alt="" />
                        Disconnect
                    </div>
                    <div onClick={() => handCopy()}>
                        <img src="/images/copy.svg" alt="" />
                        {copied ? 'Copied' : 'Copy address'}
                    </div>
                </div>
            </section>
        </View>
    );
};

const View = styled(Modal)`
    .ant-modal-content {
        border: 1px solid #ededed;
        border-radius: 0.05rem;
        box-shadow: 0px 10px 32px 8px rgba(0, 0, 0, 0.1), 0px 4px 6px 0px rgba(0, 0, 0, 0.1) !important;
        section {
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 0.25rem 0.06rem 0.1rem;
            .icon {
                height: 0.33rem;
            }
            h4 {
                font-size: 0.14rem;
                margin: 0.07rem 0.03rem 0.01rem;
                text-align: center;
            }
            p {
                font-size: 0.1rem;
                text-align: center;
            }
            .foot {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 0 0.1rem;
                margin-top: 0.2rem;
                font-size: 0.1rem;
                div {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 2px solid #000;
                    border-radius: 0.04rem;
                    height: 0.28rem;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-weight: 800;
                    &:hover {
                        background: rgb(239, 244, 248);
                    }
                    img {
                        height: 0.11rem;
                        margin-right: 0.05rem;
                    }
                }
            }
        }
    }
`;

export default Profile;
