import { gql } from "@apollo/client";

export const GET_LOCATIONS = gql`
  query GetLocations($input: GetLocationsInput!) {
    getLocations(input: $input) {
      hasMore
      locations {
        id
        name
      }
    }
  }
`;
