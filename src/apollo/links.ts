import { setContext } from "@apollo/client/link/context";
import { createHttpLink, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { getToken } from "../auth/authUtils";

/**
 * Http Link for Apollo client
 */
const httpLink = createHttpLink({
    uri: import.meta.env.VITE_API_URL,
});


/**
 * Websocket link for Apollo client
 * For Real Time Data Fetching
 */
const wsLink = new GraphQLWsLink(
    createClient({
        url: import.meta.env.VITE_GRAPHQL_WS!,
    })
);


/**
 * 
 */
const authLink = setContext((_, { headers }) => {
    const token = getToken();
    return {
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : "",
            "x-api-key": import.meta.env.VITE_API_KEY,
        },
    };
});

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
        );
    },
    wsLink,
    authLink.concat(httpLink)
);

export default splitLink;
