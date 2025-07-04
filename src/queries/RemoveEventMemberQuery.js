import { gql } from "@apollo/client";

export const Remove_Club_Member = gql`
  mutation RemoveEventMember($eventId: String!, $userId: String!) {
    removeEventMember(eventId: $eventId, userId: $userId) {
      id
      isDeleted
    }
  }
`;
