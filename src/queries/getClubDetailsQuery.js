import { gql } from "@apollo/client";

// export const Get_Club_Details = gql`
//   query GetClubDetails($id: String!) {
//     getClubDetails(input: { id: $id }) {
//       category
//       description
//       id
//       imageUrl
//       isDeleted
//       name
//       status
//       totalMembers
//       recentJoinedUsers
//       isJoined
//       createdAt
//       slug
//     }
//   }
// `;


export const Get_Club_Details = gql`
  query GetClubDetails($id: String!) {
    getClubDetails(input: { id: $id }) {
      category
      description
      id
      imageUrl
      isDeleted
      name
      status
      totalMembers
      isJoined
      createdAt
      slug
    }
  }
`;
