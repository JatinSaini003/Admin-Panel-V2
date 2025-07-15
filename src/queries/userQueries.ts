import { gql } from '@apollo/client';
import type { DocumentNode } from "@apollo/client";

/**
 * Get the list of all the users
 */
export const GET_ALL_USER_LIST: DocumentNode = gql`
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


/**
 * Get the Information of the user respective to their UserId
 */
export const Get_User_Info: DocumentNode = gql`
  query GetUserInfo($userId: String) {
    getUserInfo(userId: $userId) {
      user {
        avatar
        countryCode
        phoneNumber
        createdAt
        email
        gender
        id
        isVerified
        name
        updatedAt
        userName
        college
        profilePicId
      }
      settings {
        isDMEnabled
      }
      followRequestId
      followingCount
      followersCount
      isFollowRequested
      isFollowed
      profileUnderReview
    }
  }
`;