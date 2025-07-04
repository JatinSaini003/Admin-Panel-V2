import { gql } from "@apollo/client";
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

// query GetEventDetails {
//   getEventDetails(id: "01JT332KX5GY79R43G9YV2FKY7") {
//       isRegistered
//       qrCode
//       description
//       endDateTime
//       id
//       imageId
//       isDeleted
//       scheduleTime
//       startDateTime
//       name
//       domain
//       totalMembers
//       mode
//       isRegistrationOpen
//       status
//       clubs {
//           category
//           description
//           id
//           imageUrl
//           isDeleted
//           isJoined
//           name
//           recentJoinedUsers
//           status
//           totalMembers
//       }
//       venue
//       addedBy
//       createdAt
//       region {
//           id
//           name
//       }
//   }
// }
