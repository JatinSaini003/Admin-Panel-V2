import { gql } from "@apollo/client";

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
