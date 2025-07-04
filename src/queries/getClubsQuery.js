import { gql } from '@apollo/client';

export const GET_CLUBS = gql`
  query GetClubs($category: String, $limit: Int, $page: Int) {
    getClubs(input: { category: $category, limit: $limit, page: $page }) {
      clubs {
        category
        description
        id
        imageUrl
        isDeleted
        name
        status
        isJoined
      }
      hasMore
    }
  }
`;

