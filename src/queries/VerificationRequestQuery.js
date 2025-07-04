import { gql } from "@apollo/client";

export const HANDLE_VERIFICATION_REQUEST = gql`
  mutation HandleVerificationRequest($input: HandleVerificationRequestInput!) {
    handleVerificationRequest(input: $input) {
      id
    }
  }
`;
