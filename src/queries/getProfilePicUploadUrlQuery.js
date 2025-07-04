// src/queries/getProfilePicUploadUrlQuery.js
import { gql } from '@apollo/client';

export const GET_PROFILE_PIC_UPLOAD_URL = gql`
  query GetProfilePicUploadUrl($input: GetProfilePicUploadUrlInput!) {
    getProfilePicUploadUrl(input: $input) {
      url
      key
    }
  }
`;
