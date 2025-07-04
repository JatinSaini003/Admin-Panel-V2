import { gql } from "@apollo/client";

export const Get_Club_Members = gql`
  query GetClubMembers($input: GetClubMembersInput!) {
    getClubMembers(input: $input) {
      hasMore
      members {
        college
        id
        name
        profilePicId
        totalClubJoined
        mutualClubs
        userName
      }
    }
  }
`;
