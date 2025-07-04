import { gql } from "@apollo/client";

export const Get_Events = gql`
  query GetEvents($input: GetEventsInput!) {
    getEvents(input: $input) {
      hasMore
      events {
        description
        endDateTime
        id
        imageId
        isDeleted
        scheduleTime
        startDateTime
        name
        totalMembers
        mode
        domain
        status
        isRegistrationOpen
        addedBy
        clubs {
          category
          description
          id
          imageUrl
          isDeleted
          isJoined
          name
          recentJoinedUsers
          status
          totalMembers
        }
      }
    }
  }
`;


