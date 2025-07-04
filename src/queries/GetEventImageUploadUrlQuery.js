import { gql } from "@apollo/client";

export const Get_Event_Image_UploadUrl = gql`
  query GetEventImageUploadUrl($input: GetEventImageUploadUrlInput!) {
    getEventImageUploadUrl(input: $input) {
      url
      key
    }
  }
`;
