import { gql } from "@apollo/client";

export const CREATE_CLUB = gql`
mutation CreateClub($input: CreateClubInput!) {
  createClub(input: $input) {
      category
      id
      imageUrl
      name
  }
}
`;
