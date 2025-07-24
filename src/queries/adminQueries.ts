import { gql } from "@apollo/client";


/**
 * Query for updating the Admin Profile with new data
 */
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


/**
 * Removes the Admin Profile Pic
 */
export const Remove_Admin_ProfilePic = gql`
  mutation RemoveAdminProfilePic {
    removeAdminProfilePic {
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