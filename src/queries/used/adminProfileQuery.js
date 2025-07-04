import { gql } from '@apollo/client';

export const GET_ADMIN_PROFILE = gql`
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
