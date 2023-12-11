import { gql } from "apollo-server-express";

const userValidatorSchema = gql`
  type User {
    id: ID!
    email: String
    firstName: String
    lastName: String
    photo: String
  }

  type Query {
    dummyQuery: String
    getUserData: User
  }
`;

export default userValidatorSchema;