import { ApolloClient, InMemoryCache } from "@apollo/client";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

const createApolloClient = () => {
  const uploadLink = createUploadLink({
    uri: "http://localhost:4000/graphql",
    credentials: "include",
  });

  return new ApolloClient({
    link: uploadLink,
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;