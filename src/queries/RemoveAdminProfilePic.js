import { gql } from "@apollo/client";

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
