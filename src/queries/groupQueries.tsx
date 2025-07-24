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

export const Update_Group = gql`
    mutation UpdateGroup ($input: UpdateGroupInput!){
        updateGroup(input: $input) {
            message
            groups {
                description
                name
            }
        }
    }
`;

export const Get_All_Groups = gql`
    query GetAllGroups($limit: Int, $page: Int) {
        getAllGroups(input: { limit: $limit, page: $page }) {
            hasMore
            total
            groups {
                id
                avatar
                name
                isDeleted
                photoId
                settings {
                    approveUsers
                    isPrivate
                }
                userPermissions {
                    sendMessages
                }
                updatedBy
                totalUsers
                totalMedia
                chatId
                collegeId
                createdBy
                description
            }
        }
    }
`;

export const Delete_Group = gql`
    mutation DeleteGroup($groupId: String!) {
        deleteGroup(groupId: $groupId) {
            message
        }
    }
`;

export const Get_Group_Details = gql`
    query GetGroupDetails($groupId: String!, $limit: Int, $page: Int) {
        getGroupDetails(groupId: $groupId, limit: $limit, page: $page) {
            avatar
            chatId
            description
            id
            name
            photoId
            totalMedia
            totalUsers
            settings {
                approveUsers
                isPrivate
            }
            userPermissions {
                sendMessages
            }
            getGroupUsers {
                hasMore
                groupUsers {
                    id
                    isDMEnabled
                    name
                    profilePicId
                    userName
                    groupPermission {
                        isAdmin
                        isRestricted
                    }
                }
            }
        }
    }
`;

export const Add_Group_Members = gql`
    mutation AddGroupUsers($chatId: String, $groupId: String!, $userIds: [String!]!) {
        addGroupUsers(
            input: {
                chatId: $chatId
                groupId: $groupId
                userIds: $userIds
            }
        ) {
            message
        }
    }
`;

export const Get_Group_ImageUploadUrl = gql`
    query GetGroupImageUploadUrl($input: GetGroupImageUploadUrlInput!) {
        getGroupImageUploadUrl(input: $input) {
            key
            url
        }
    }
`;
