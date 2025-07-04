import { gql } from "@apollo/client";

export const GET_USER_JOINED_CLUBS = gql`
  query GetUserJoinedClubs($limit: Int!, $page: Int!, $userId: String!) {
    getUserJoinedClubs(limit: $limit, page: $page, userId: $userId) {
      hasMore
      clubs {
        category
        id
        imageUrl
        name
        isJoined
      }
    }
  }
`;
