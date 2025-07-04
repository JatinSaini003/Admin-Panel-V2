import { gql } from "@apollo/client";

export const Create_Event = gql`
  mutation AddEvent($input: AddEventInput!) {
    addEvent(input: $input) {
      id
    }
  }
`;
