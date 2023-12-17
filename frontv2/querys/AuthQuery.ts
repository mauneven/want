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

export const REGISTER_USER = gql`
mutation RegisterUser(
  $email: String!
  $password: String!
  $firstName: String!
  $lastName: String!
  $birthdate: String!
) {
  register(
    input: {
      email: $email
      password: $password
      firstName: $firstName
      lastName: $lastName
      birthdate: $birthdate
    }
  ) {
    id
    email
    firstName
    lastName
    birthdate
    isVerified
  }
}
`;

export const LOGIN_USER = gql`
mutation LoginUser($email: String!, $password: String!) {
  login(input: { email: $email, password: $password }) {
    id
    email
  }
}
`;

