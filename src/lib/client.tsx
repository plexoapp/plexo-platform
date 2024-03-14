// import { devtoolsExchange } from "@urql/devtools";
import {
  cacheExchange,
  Client,
  CombinedError,
  createClient,
  // dedupExchange,
  errorExchange,
  fetchExchange,
  subscriptionExchange,
} from "urql";
import { createClient as createWSClient } from "graphql-ws";

// export const URQLClient = (graphQLEndpoint: string, graphQLWsEndpoint: string) => {
//   const GRAPHQL_ENDPOINT = graphQLEndpoint;
//   const GRAPHQL_WS_ENDPOINT = graphQLWsEndpoint;

//   // const wsClient =
//   //   typeof window === "undefined"
//   //     ? null
//   //     : ;

//   // console.log(GRAPHQL_ENDPOINT);

//   return createClient({
//     url: GRAPHQL_ENDPOINT,
//     fetchOptions: {
//       credentials: "include",
//       headers: {
//         // Authorization: PLEXO_TOKEN,
//       },
//     },
//     exchanges: [
//       // devtoolsExchange,
//       // dedupExchange,
//       cacheExchange,
//       errorExchange({
//         onError: (error: CombinedError) => {
//           console.log({ error });
//         },
//       }),
//       subscriptionExchange({
//         forwardSubscription(request) {
//           const input = { ...request, query: request.query || "" };
//           return {
//             subscribe(sink) {
//               return {
//                 unsubscribe: createWSClient({
//                   url: GRAPHQL_WS_ENDPOINT,
//                   connectionParams: {
//                     Authorization: "",
//                   },
//                 }).subscribe(input, sink),
//               };
//             },
//           };
//         },
//       }),
//       fetchExchange,
//     ],
//     requestPolicy: "network-only",
//   });
// };

// import { createClient } from 'urql';

class URQLClientSingleton {
  private static instance: Client;
  // private static endpoint = "";
  // private static wsEndpoint = "";

  public static getClient(graphQLEndpoint: string, graphQLWsEndpoint: string) {
    const GRAPHQL_ENDPOINT = graphQLEndpoint;
    const GRAPHQL_WS_ENDPOINT = graphQLWsEndpoint;

    if (
      !URQLClientSingleton.instance
      // ||
      // URQLClientSingleton.endpoint !== graphQLEndpoint ||
      // URQLClientSingleton.wsEndpoint !== graphQLWsEndpoint
    ) {
      // URQLClientSingleton.endpoint = graphQLEndpoint;
      // URQLClientSingleton.wsEndpoint = graphQLWsEndpoint;
      URQLClientSingleton.instance = createClient({
        url: GRAPHQL_ENDPOINT,
        fetchOptions: {
          credentials: "include",
          headers: {
            // Authorization: PLEXO_TOKEN,
          },
        },
        exchanges: [
          // devtoolsExchange,
          // dedupExchange,
          cacheExchange,
          errorExchange({
            onError: (error: CombinedError) => {
              console.log({ error });
            },
          }),
          subscriptionExchange({
            forwardSubscription(request) {
              const input = { ...request, query: request.query || "" };
              return {
                subscribe(sink) {
                  return {
                    unsubscribe: createWSClient({
                      url: GRAPHQL_WS_ENDPOINT,
                      connectionParams: {
                        Authorization: "",
                      },
                    }).subscribe(input, sink),
                  };
                },
              };
            },
          }),
          fetchExchange,
        ],
        requestPolicy: "network-only",
      });
    }
    return URQLClientSingleton.instance;
  }
}

export default URQLClientSingleton;
