import { gql } from 'apollo-server-express';

const userSchema = gql`
  type User {
    id: ID!
    email: String
    firstName: String
    lastName: String
    phone: String
    role: String
    birthdate: String
    totalPosts: Int
    totalOffers: Int
    isDeleted: Boolean
    isVerified: Boolean
    isBlocked: Boolean
    reports: [String]
    createdAt: String
    photo: String
  }

  type Query {
    users: [User]
    user(id: ID!): User
  }

  type Mutation {
    createUser(email: String!, password: String!): User
  }
`;

export default userSchema;