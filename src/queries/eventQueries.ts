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
        createdAt
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

export const Create_Event = gql`
  mutation AddEvent($input: AddEventInput!) {
    addEvent(input: $input) {
      id
    }
  }
`;


export const Delete_Event = gql`
  mutation DeleteEvent($input: DeleteEventInput!) {
    deleteEvent(input: $input) {
      id
    }
  }
`;

export const Get_EventDetails = gql`
  query GetEventDetails($id: String!) {
    getEventDetails(id: $id) {
      isRegistered
      qrCode
      description
      endDateTime
      id
      imageId
      isDeleted
      scheduleTime
      startDateTime
      name
      domain
      totalMembers
      mode
      isRegistrationOpen
      status
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
      venue
      addedBy
      createdAt
      region {
        id
        name
      }
    }
  }
`;

export const Get_Event_Image_UploadUrl = gql`
  query GetEventImageUploadUrl($input: GetEventImageUploadUrlInput!) {
    getEventImageUploadUrl(input: $input) {
      url
      key
    }
  }
`;


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

export const Remove_Event_Member = gql`
  mutation RemoveEventMember($eventId: String!, $userId: String!) {
    removeEventMember(eventId: $eventId, userId: $userId) {
      id
      isDeleted
    }
  }
`;

export const Update_Event = gql`
  mutation UpdateEvent($input: UpdateEventInput!) {
    updateEvent(input: $input) {
      id
    }
  }
`;


export const GET_LOCATIONS = gql`
  query GetLocations($input: GetLocationsInput!) {
    getLocations(input: $input) {
      hasMore
      locations {
        id
        name
      }
    }
  }
`;

export const Get_User_Requested_Events = gql`
  query GetApprovalRequestEvents($input: GetEventsInput!) {
    getApprovalRequestEvents(input: $input) {
        hasMore
        events {
            description
            endDateTime
            id
            imageId
            scheduleTime
            startDateTime
            name
            totalMembers
            mode
            domain
            status
            addedBy
            scheduleTime
            venue
            createdAt
        }
    }
  }
`;

export const Update_Event_Status = gql`
  mutation UpdateEventApprovalStatus($input: UpdateEventApprovalStatusInput!) {
    updateEventApprovalStatus(input: $input) {
        id
    }
  }
`;

