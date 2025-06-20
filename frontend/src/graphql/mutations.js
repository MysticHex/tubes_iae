// src/graphql/mutations.js
import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($nim: String!, $email: String!) {
    login(nim: $nim, email: $email) {
      token
      user {
        id
        nim
        nama
      }
    }
  }
`;