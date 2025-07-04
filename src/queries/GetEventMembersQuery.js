import { gql } from "@apollo/client";

export const Get_Event_Members = gql`
  query GetEventMembers($input: GetEventMembersArgs!) {
    getEventMembers(input: $input) {
      hasMore
      members {
        id
        name
        profilePicId
        userName
        college
      }
    }
  }
`;
