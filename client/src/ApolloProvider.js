import React from 'react';
import App from "./App";
import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,
    ApolloProvider,
} from "@apollo/client";

const httplink = createHttpLink({
    uri: "http://localhost:8000",

});

const client = new ApolloClient({
    link: httplink,
    cache: new InMemoryCache()
});

export default (
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
);