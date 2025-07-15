import { gql } from "@apollo/client";

export const GET_ALL_USER_LIST = gql`
  query GetAllUserList($page: Int, $limit: Int, $search: String) {
    getAllUserList(page: $page, limit: $limit, search: $search) {
      hasMore
      userList {
        avatar
        bio
        college
        countryCode
        createdAt
        email
        gender
        id
        isCollegeVerified
        isVerified
        location
        name
        phoneNumber
        profilePicId
        updatedAt
        userName
      }
    }
  }
`;
