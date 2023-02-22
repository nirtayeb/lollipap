import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import ResponsiveAppBar from "../comps/ResponsiveAppBar";

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to emails!</title>
      </Head>
      <main className="app">
        <ResponsiveAppBar />
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default CustomApp;
