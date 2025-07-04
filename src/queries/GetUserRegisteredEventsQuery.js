// src/graphql/queries.js
import { gql } from '@apollo/client';

export const GET_USER_REGISTERED_EVENTS = gql`
  query GetUserRegisteredEvents($input: GetUserRegisteredEventsInput!) {
    getUserRegisteredEvents(input: $input) {
      hasMore
      events {
        description
        domain
        endDateTime
        id
        imageId
        isDeleted
        isRegistrationOpen
        mode
        name
        scheduleTime
        startDateTime
        status
        totalMembers
      }
    }
  }
`;
