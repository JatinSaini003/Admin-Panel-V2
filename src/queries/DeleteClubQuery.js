import { gql } from "@apollo/client";

export const Delete_Club = gql`
  mutation DeleteClub($input: DeleteClubInput!) {
    deleteClub(input: $input) {
      id
    }
  }
`;
