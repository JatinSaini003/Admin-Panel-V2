import { gql } from '@apollo/client';

export const ADMIN_LOGIN = gql`
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

