import { gql } from "@apollo/client";

export const UPDATE_ADMIN_PROFILE = gql`
  mutation UpdateAdminProfile($input: UpdateAdminProfileInput!) {
    updateAdminProfile(input: $input) {
      user {
        id
        firstName
        lastName
        email
        phoneNumber
        countryCode
        profilePicId
      }
    }
  }
`;
