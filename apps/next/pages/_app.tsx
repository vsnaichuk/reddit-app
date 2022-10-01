import { Provider } from 'app/provider';
import Head from 'next/head';
import React from 'react';
import type { SolitoAppProps } from 'solito';
import 'raf/polyfill';

function MyApp({ Component, pageProps }: SolitoAppProps) {
  return (
    <>
      <Head>
        <title>Reddit App</title>
        <meta name="description" content="Reddit clone app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Provider>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default MyApp;
