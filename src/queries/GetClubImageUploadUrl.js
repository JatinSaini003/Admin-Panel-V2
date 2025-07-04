import { gql } from "@apollo/client";

export const Get_Club_ImageUploadUrl = gql`
  query GetClubImageUploadUrl($input: GetClubImageUploadUrlInput!) {
    getClubImageUploadUrl(input: $input) {
      key
      url
    }
  }
`;
