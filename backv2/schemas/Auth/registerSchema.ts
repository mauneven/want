import { gql } from "apollo-server-express";

const registerSchema = gql`
  type User {
    id: ID!
    email: String
    firstName: String
    lastName: String
    birthdate: String
    isVerified: Boolean
  }

  input RegisterInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    birthdate: String!
  }

  type Query {
    dummyQuery: String
  }

  type Mutation {
    register(input: RegisterInput): User
  }
`;

export default registerSchema;