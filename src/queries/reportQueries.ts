import { gql } from "@apollo/client";

export const getReportingUsers = gql`
    query GetReportingUsers {
        getReportingUsers {
            email
            name
            reportCount
            userId
            userName
        }
    }
`;

export const getReportedPostOfAStudent = gql`
    query GetReportedPostsOfaStudent ($id: String!) {
        getReportedPostsOfaStudent(input: { id: $id }) {
            hasMore
            posts {
                createdAt
                description
                disableComments
                id
                images
                isArchived
                isFollowed
                isVoted
                reason
                reportCategory
                reportId
                title
                totalComments
                totalLikes
                totalReposts
                totalUniqueReposts
                totalViews
                type
                updatedAt
                userId
                videos
                voteOptionId
                club {
                    category
                    createdAt
                    description
                    id
                    imageUrl
                    isDeleted
                    isJoined
                    name
                    recentJoinedUsers
                    slug
                    status
                    totalMembers
                }
                user {
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

export const getPostReports = gql`
    query GetPostReports ($limit: Int, $page: Int, $postId: String!) {
        getPostReports(
            input: { limit: $limit, page: $page, postId: $postId }
        ) {
            hasMore
            reports {
                id
                postId
                reason
                reportCategory
                reportId
                userId
            }
        }
    }
`;

export const DeleteReportedPost = gql`
    mutation DeleteReportedPost($id: String!) {
        deleteReportedPost(id: $id) {
            id
        }
    }
`;