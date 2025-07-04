import { gql } from "@apollo/client";

export const CREATE_GROUP = gql`
  mutation CreateGroup($input: CreateGroupInput!) {
    createGroup(input: $input) {
      avatar
      chatId
      description
      id
      name
      photoId
    }
  }
`;
