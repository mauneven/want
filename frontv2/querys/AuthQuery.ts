import { gql } from "@apollo/client";

export const GET_USER_DATA = gql`
  query {
    getUserData {
      id
      email
      # Otros campos del usuario que necesites
    }
  }
`;