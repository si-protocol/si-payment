import { createContext, FC, ReactNode, useCallback, useState } from 'react';
import { MessageApi, MessageContextApi, MessageTypes } from 'contexts/message/type';
import styled from 'styled-components';

export const MessageContext = createContext<MessageContextApi | undefined>(undefined);

type MessageProps = {
    children: ReactNode;
};
const Message: FC<MessageProps> = ({ children }) => {
    const [messages, setMessages] = useState<MessageContextApi['messages']>([]);
    const times = 4500;

    const message = useCallback(
        ({ description, duration, id, type }: any) => {
            setMessages((pre) => {
                const curMessages = pre.filter((item) => item.id !== id);
                duration = duration === null ? null : duration || times;
                autoHide(id, duration);
                return [
                    ...curMessages,
                    {
                        id,
                        description,
                        duration,
                        type
                    }
                ];
            });
        },
        [setMessages]
    );

    const autoHide = (id: string | number, duration: MessageApi['duration']) => {
        if (!duration) return;
        setTimeout(() => {
            setMessages((pre) => {
                const curMessages = pre.filter((item) => item.id !== id);
                return [...curMessages];
            });
        }, duration + 1500);
    };
    const messageError = (description?: MessageApi['description'], duration: MessageApi['duration'] = times) => {
        const id = new Date().getTime().toString();
        message({ description, duration, id, type: MessageTypes.ERROR });
        return id;
    };
    const messageInfo = (description?: MessageApi['description'], duration: MessageApi['duration'] = times) => {
        const id = new Date().getTime().toString();
        message({ description, duration, id, type: MessageTypes.INFO });
        return id;
    };
    const messageSuccess = (description?: MessageApi['description'], duration: MessageApi['duration'] = times) => {
        const id = new Date().getTime().toString();
        message({ description, duration, id, type: MessageTypes.SUCCESS });
        return id;
    };
    const messageWarning = (description?: MessageApi['description'], duration: MessageApi['duration'] = times) => {
        const id = new Date().getTime().toString();
        message({ description, duration, id, type: MessageTypes.WARNING });
        return id;
    };
    const clear = () => setMessages([]);
    const remove = (id: string | number) => {
        setMessages((pre) => pre.filter((item) => item.id !== id));
    };

    return (
        <MessageContext.Provider
            value={{
                messages,
                clear,
                remove,
                messageError,
                messageInfo,
                messageSuccess,
                messageWarning
            }}
        >
            {children}
            <Container>
                {messages.map((item, index) => {
                    return (
                        <div key={item.id + '_' + index}>
                            <Wrapper duration={item.duration} $type={item.type}>
                                <Content>
                                    <Icon src={`/static/images/common/${item.type === 'error' || item.type === 'warning' ? 'icon2' : 'icon1'}.svg`}></Icon>
                                    {item.description}
                                </Content>
                            </Wrapper>
                        </div>
                    );
                })}
            </Container>
        </MessageContext.Provider>
    );
};

const Container = styled.div`
    position: fixed;
    top: 0.32rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 999999;
    @media screen and (max-width: 768px) {
        top: 0.16rem;
    }
`;

const Wrapper = styled.div<{ duration: MessageApi['duration'] | null; $type: MessageApi['type'] }>`
    padding: 0.08rem 0.16rem;
    position: relative;
    transition: all 0.3s;
    opacity: 1;
    pointer-events: all;
    display: inline-block;
    background: ${(props) => (props.$type === 'error' || props.$type === 'warning' ? '#F5CCCC' : '#ccf5f1')};
    border-radius: 0.06rem;
    overflow: hidden;
    font-size: 0.14rem;
    line-height: 0.24rem;
    color: #0e0134;
    border: 0.01rem solid #0e0134;
    animation: ${(props: any) => (props.duration === null ? '' : `hide .3s linear ${props.duration / 1000}s forwards`)};

    @keyframes hide {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-0.2rem);
        }
    }
`;

const Content = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Icon = styled.img`
    width: 0.12rem;
    height: 0.12rem;
    margin-right: 0.08rem;
    margin-top: 0.01rem;
`;

export default Message;
