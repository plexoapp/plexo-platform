import { ColorScheme } from "@mantine/core";
import type { AppProps } from "next/app";
import { getCookie } from "cookies-next";
import { ReactElement, ReactNode } from "react";
import { Provider as URQLProvider } from "urql";
import { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";

import Fonts from "theming/fonts";
import URQLClientSingleton from "lib/client";
import { MyMantineProvider } from "theming/mantine";
import PlexoProvider from "../context/PlexoContext";
import MySpotlightProvider from "components/ui/NavBarWithSearch/searchPopup";
// import { unstable_noStore as noStore } from "next/cache";

export type NextPageWithLayout<T = {}> = NextPage<T> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout<T> = AppProps & {
  Component: NextPageWithLayout<T>;
};

type PlexoPlatformAppProps = {
  colorScheme: ColorScheme;
  viewMode: "list" | "grid";
  authCookie: string;
  plexoAPIEndpoint: string;
  plexoWSEndpoint: string;
};

const PlexoApp = ({
  Component,
  pageProps,
  colorScheme,
  authCookie,
  plexoAPIEndpoint,
  plexoWSEndpoint,
}: AppPropsWithLayout<PlexoPlatformAppProps> & PlexoPlatformAppProps) => {
  const getLayout = Component.getLayout ?? (page => page);

  let graphQLEndpoint = `${plexoAPIEndpoint}/graphql`;
  let graphQLWsEndpoint = `${plexoWSEndpoint}/graphql/ws`;

  const client = URQLClientSingleton.getClient(graphQLEndpoint, graphQLWsEndpoint, authCookie);

  return (
    <>
      <Head>
        <title>Plexo</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="icon" type="image/png" sizes="5x5" href="/plexo.png" />
      </Head>
      <URQLProvider value={client}>
        <PlexoProvider authCookie={authCookie} plexoAPIEndpoint={plexoAPIEndpoint}>
          <MyMantineProvider colorScheme={colorScheme}>
            <MySpotlightProvider>
              <Fonts />
              {getLayout(<Component {...pageProps} />)}
            </MySpotlightProvider>
          </MyMantineProvider>
        </PlexoProvider>
      </URQLProvider>
    </>
  );
};

PlexoApp.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => {
  return {
    colorScheme: getCookie("mantine-color-scheme", ctx) || "dark",
    viewMode: getCookie("viewMode", ctx) || "list",
    authCookie: getCookie("plexo-session-token", ctx) || "",
    plexoAPIEndpoint: process.env.PLEXO_API_ENDPOINT || "",
    plexoWSEndpoint: process.env.NEXT_PUBLIC_WS_ENDPOINT || "",
  };
};

export default PlexoApp;
