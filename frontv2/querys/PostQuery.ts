import { gql } from '@apollo/client';


export const CREATE_POST_MUTATION = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      title
      description
      latitude
      longitude
      mainCategory
      price
      photos
    }
  }
`;