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

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: process.env.NEXT_PUBLIC_STUDIO_API_KEY_CORS,
  }),
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://api.studio.thegraph.com/query/48083/eventconnect/version/latest",
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
        <ApolloProvider client={client}>
          <NotificationProvider>
            <LivepeerConfig client={livepeerClient}>
              <Header />
              <Component {...pageProps} />
            </LivepeerConfig>
          </NotificationProvider>
        </ApolloProvider>
      </MoralisProvider>
    </div>
  );
}
