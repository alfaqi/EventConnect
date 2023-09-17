import Header from "@/components/Header";
import "@/styles/globals.css";
import Head from "next/head";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";
import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from "@livepeer/react";

const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: process.env.NEXT_PUBLIC_STUDIO_API_KEY_CORS,
  }),
});

export default function App({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>Event Connect</title>
        <meta name="description" content="" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </Head>
      <MoralisProvider initializeOnMount={false}>
        <NotificationProvider>
          <LivepeerConfig client={livepeerClient}>
            <Header />
            <Component {...pageProps} />
          </LivepeerConfig>
        </NotificationProvider>
      </MoralisProvider>
    </div>
  );
}
