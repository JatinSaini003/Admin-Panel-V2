import { gql } from "@apollo/client";
export const Get_User_Info = gql`
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
