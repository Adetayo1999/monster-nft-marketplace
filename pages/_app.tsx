import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { goerli } from "wagmi/chains";
// import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { ApolloProvider, InMemoryCache, ApolloClient } from "@apollo/client";
import { Toaster } from "react-hot-toast";
import { Header } from "../components/header";
import ListingProvider from "../context/listing-context";
import ListingModalProvider from "../context/listing-modal";
import { ListingModal } from "../components/listing-modal";

const { chains, provider, webSocketProvider } = configureChains(
  [goerli],
  [
    // alchemyProvider({
    //   // This is Alchemy's default API key.
    //   // You can get your own at https://dashboard.alchemyapi.io
    //   apiKey: "_gg7wSSi0KMBsdKnGVfHDueq6xMB9EkC",
    // }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://api.studio.thegraph.com/query/40062/nft-marketplace/v1.1.0",
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <ListingProvider>
            <ListingModalProvider>
              <ListingModal />
              <Toaster position="top-right" />
              <Header />
              <div className="w-[90%] mx-auto">
                <Component {...pageProps} />
              </div>
            </ListingModalProvider>
          </ListingProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </ApolloProvider>
  );
}

export default MyApp;
