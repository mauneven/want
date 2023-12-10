import { gql } from "apollo-server-express";

const loginSchema = gql`
  type User {
    id: ID!
    email: String
    password: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Query {
    dummyQuery: String
  }

  type Mutation {
    login(input: LoginInput): User
  }
`;

export default loginSchema;