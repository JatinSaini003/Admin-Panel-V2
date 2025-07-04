import { gql } from "@apollo/client";

export const Delete_Event = gql`
  mutation DeleteEvent($input: DeleteEventInput!) {
    deleteEvent(input: $input) {
      id
    }
  }
`;
