import { gql } from "@apollo/client";

export const Remove_Club_Member = gql`
  mutation RemoveClubMember($clubId: String!, $userId: String!) {
    removeClubMember(clubId: $clubId, userId: $userId) {
      id
      isJoined
    }
  }
`;
