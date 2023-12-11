import { gql } from "@apollo/client";

export const GET_USER_DATA = gql`
  query {
    getUserData {
      id
      email
      firstName
      lastName
      photo
    }
  }
`;