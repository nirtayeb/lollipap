import { AppProps } from 'next/app';
import Head from 'next/head';
import ResponsiveAppBar from "../comps/ResponsiveAppBar";
import { Box } from '@mui/material';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to emails!</title>
      </Head>
      <main className="app" style={{backgroundColor:"white"}}>
        <Box sx={{backgroundColor:"#fff"}}>
        <ResponsiveAppBar />
        <Component {...pageProps} />
        </Box>
      </main>
    </>
  );
}

export default CustomApp;
