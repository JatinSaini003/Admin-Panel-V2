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


/**
 * Get User's Likes Posts
 */
export const GET_LIKED_POSTS = gql`
  query GetLikedPosts($userId: String!) {
    getLikedPosts(
      input: {
        userId: $userId
        userPostsOnly: true
      }
    ) {
      hasMore
      posts {
        id
        title
        description
        userId
        createdAt
        updatedAt
        disableComments
        images
        videos
        isLiked
        isSaved
        totalLikes
        totalComments
        totalViews
        type
        user {
          userName
          name
          avatar
          isDMEnabled
          profilePicId
        }
        club {
          id
          name
          description
          imageUrl
          category
          isDeleted
          isJoined
          recentJoinedUsers
          status
          totalMembers
        }
      }
    }
  }
`;


/**
 * Get User's Registered Events
 */
export const GET_USER_REGISTERED_EVENTS = gql`
  query GetUserRegisteredEvents($input: GetUserRegisteredEventsInput!) {
    getUserRegisteredEvents(input: $input) {
      hasMore
      events {
        description
        domain
        endDateTime
        id
        imageId
        isDeleted
        isRegistrationOpen
        mode
        name
        scheduleTime
        startDateTime
        status
        totalMembers
      }
    }
  }
`;


/**
 * Get User's Joined Clubs
 */
export const GET_USER_JOINED_CLUBS = gql`
  query GetUserJoinedClubs($limit: Int!, $page: Int!, $userId: String!) {
    getUserJoinedClubs(limit: $limit, page: $page, userId: $userId) {
      hasMore
      clubs {
        category
        id
        imageUrl
        name
        isJoined
      }
    }
  }
`;


/**
 * get User's Posts
 */
export const Get_Posts = gql`
  mutation GetPosts($input: GetPostsInput!) {
    getPosts(input: $input) {
      hasMore
      posts {
        isFollowed
        userId
        createdAt
        description
        disableComments
        id
        images
        totalComments
        totalLikes
        totalViews
        type
        updatedAt
        userId
        videos
        question {
          durationMinutes
          endDateTime
          images
          name
          options {
            id
            label
            percentage
            votes
          }
          totalVotes
          votingStatus
        }
        user {
          id
          avatar
          name
          userName
          isDMEnabled
          profilePicId
        }
        isLiked
        isSaved
        club {
          id
          category
          description
          name
          imageUrl
          status
          totalMembers
          isDeleted
        }
        isVoted
        voteOptionId
        repostedPost {
          createdAt
          description
          disableComments
          id
          images
          totalComments
          totalLikes
          totalViews
          type
          updatedAt
          userId
          videos
          question {
            durationMinutes
            endDateTime
            images
            name
            totalVotes
            votingStatus
            options {
              id
              label
              percentage
              votes
            }
          }
          user {
            avatar
            isDMEnabled
            name
            profilePicId
            userName
            id
          }
          isLiked
          isSaved
          isFollowed
          club {
            category
            description
            id
            imageUrl
            isDeleted
            isJoined
            name
            recentJoinedUsers
            status
            totalMembers
          }
          totalUniqueReposts
          totalReposts
        }
        title
        isArchived
        totalUniqueReposts
        totalReposts
        repostedByUser {
          avatar
          id
          isDMEnabled
          name
          profilePicId
          userName
        }
      }
    }
  }
`;

export const Delete_Post = gql`
  mutation DeletePost($id: String!) {
    deletePost(id: $id) {
      id
    }
  }
`;
