import { gql } from "@apollo/client";

export const Update_Event = gql`
  mutation UpdateEvent($input: UpdateEventInput!) {
    updateEvent(input: $input) {
      id
    }
  }
`;
