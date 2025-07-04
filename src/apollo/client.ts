import { ApolloClient, InMemoryCache } from "@apollo/client";
import splitLink from "./links";

export const apolloClient = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
});
