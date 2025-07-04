import { gql } from "@apollo/client";

export const Get_Club_Categories = gql`
  query GetClubCategories {
    getClubCategories {
      categories {
        category
        slug
      }
    }
  }
`;
