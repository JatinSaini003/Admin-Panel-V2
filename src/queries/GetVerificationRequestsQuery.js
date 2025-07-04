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
