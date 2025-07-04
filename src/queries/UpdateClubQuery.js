import { gql } from "@apollo/client";

export const Update_Club = gql`
  mutation UpdateClub($input: UpdateClubInput!) {
    updateClub(input: $input) {
      category
      id
      imageUrl
      name
    }
  }
`;
