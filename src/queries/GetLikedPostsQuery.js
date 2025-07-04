
import { gql } from '@apollo/client';

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