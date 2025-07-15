import 'styles/index.scss';
import '@solana/wallet-adapter-react-ui/styles.css';

import { QueryClientProvider } from '@tanstack/react-query';

import { createGlobalStyle } from 'styled-components';
import type { AppProps } from 'next/app';

import Header from 'components/header';
import Head from 'next/head';
import { Provider } from 'react-redux';
import store from '../state';
import styled from 'styled-components';
import { WagmiProvider } from '@/components/WagmiProvider';
import { WalletProvider } from '@/contexts/wallet';
import MessageProvider from 'contexts/message';
import { queryClient } from '@/config/queryClient.config';
import dynamic from 'next/dynamic';

const GlobalStyle = createGlobalStyle``;

const Main = styled.div`
    background: #fff;
    width: 100%;
    /* min-height: calc(100vh - 0.5rem); */
    border-radius: 0.1rem 0.1rem 0 0;
    padding: 0.3rem;
    height: calc(100vh - 0.5rem);
`;

const Section = styled.div`
    min-width: 375px;
    max-width: 600px;
    margin: 0 auto;
    height: 100vh;
`;
const SolanaProvider = dynamic(() => import('../contexts/Solana/Provider').then(({ SolanaProvider }) => SolanaProvider), { ssr: false });

export async function getServerSideProps(context: any) {
    const { params, query } = context;

    return {
        props: {
            params: params ?? {},
            searchParams: query,
            headers: context.req.headers
        }
    };
}

function AiApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <link rel="icon" href="/favicon.svg" />
                <title>Taoillium Payment</title>
                <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
                <meta name="msapplication-tap-highlight" content="no" />
            </Head>
            <GlobalStyle />
            <Provider store={store}>
                <SolanaProvider>
                    <QueryClientProvider client={queryClient}>
                        <WagmiProvider>
                            <MessageProvider>
                                <WalletProvider>
                                    <Section>
                                        <Header headers={pageProps.headers} />
                                        <Main>
                                            <Component {...pageProps} />
                                        </Main>
                                    </Section>
                                </WalletProvider>
                            </MessageProvider>
                        </WagmiProvider>
                    </QueryClientProvider>
                </SolanaProvider>
            </Provider>
        </>
    );
}

export default AiApp;
