import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const createApolloClient = () => {
  const httpLink = new HttpLink({
    uri: "http://localhost:4000/graphql",
  });

  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    credentials: "include",
  });
};

export default createApolloClient;
