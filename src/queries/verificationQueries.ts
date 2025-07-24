import { gql } from "@apollo/client";

export const Get_Verification_Requests = gql`
  query GetVerificationRequests($limit: Int!, $page: Int!) {
    getVerificationRequests(input: { limit: $limit, page: $page }) {
      hasMore
      requests {
        documentId
        documentType
        id
        status
        userId
        user {
          college
          id
          name
          profilePicId
          userName
        }
      }
    }
  }
`;

export const HANDLE_VERIFICATION_REQUEST = gql`
  mutation HandleVerificationRequest($input: HandleVerificationRequestInput!) {
    handleVerificationRequest(input: $input) {
      id
    }
  }
`;