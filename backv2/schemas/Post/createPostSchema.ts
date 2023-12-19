import { gql } from "apollo-server-express";

export const createPostSchema = gql`
  type Post {
    id: ID!
    title: String!
    description: String
    createdAt: String!
    createdBy: ID!
    latitude: Float!
    longitude: Float!
    mainCategory: String
    price: Float!
    photos: [String]
    reports: [ID]
  }

  input CreatePostInput {
    title: String!
    description: String
    createdAt: String!
    createdBy: ID!
    latitude: Float!
    longitude: Float!
    mainCategory: String
    price: Float!
    photos: [String]
    reports: [ID]
  }

  type Mutation {
    createPost(input: CreatePostInput): Post
  }
`;

export default createPostSchema;