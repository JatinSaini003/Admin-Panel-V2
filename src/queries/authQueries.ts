import { gql } from '@apollo/client';
import type { DocumentNode } from "@apollo/client";

export const ADMIN_LOGIN: DocumentNode = gql`
  mutation AdminLogin($email: String!, $password: String!) {
    adminLogin(email: $email, password: $password) {
      expiresIn
      accessToken
      id
      refreshToken
      tokenType
    }
  }
`;

export const GET_ADMIN_PROFILE: DocumentNode = gql`
  query GetAdminProfile {
    getAdminProfile {
      user {
        countryCode
        email
        firstName
        id
        lastName
        phoneNumber
        profilePicId
      }
    }
  }
`;