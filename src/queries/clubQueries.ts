import { gql } from "@apollo/client";

export const CREATE_CLUB = gql`
mutation CreateClub($input: CreateClubInput!) {
  createClub(input: $input) {
      id
      category
      imageUrl
      name
  }
}
`;

export const Get_Club_Categories = gql`
  query GetClubCategories {
    getClubCategories {
      categories {
        category
        slug
      }
    }
  }
`;

export const Get_Club_Details = gql`
  query GetClubDetails($id: String!) {
    getClubDetails(input: { id: $id }) {
      category
      description
      id
      imageUrl
      isDeleted
      name
      status
      totalMembers
      isJoined
      createdAt
      slug
    }
  }
`;


export const Get_Club_ImageUploadUrl = gql`
  query GetClubImageUploadUrl($input: GetClubImageUploadUrlInput!) {
    getClubImageUploadUrl(input: $input) {
      key
      url
    }
  }
`;

export const Get_Club_Members = gql`
  query GetClubMembers($input: GetClubMembersInput!) {
    getClubMembers(input: $input) {
      hasMore
      members {
        college
        id
        name
        profilePicId
        totalClubJoined
        mutualClubs
        userName
      }
    }
  }
`;

export const GET_CLUBS = gql`
  query GetClubs($category: String, $limit: Int, $page: Int) {
    getClubs(input: { category: $category, limit: $limit, page: $page }) {
      clubs {
        category
        description
        id
        imageUrl
        isDeleted
        name
        status
        isJoined
      }
      hasMore
    }
  }
`;

export const Update_Club = gql`
  mutation UpdateClub($input: UpdateClubInput!) {
    updateClub(input: $input) {
      category
      id
      imageUrl
      name
    }
  }
`;

export const Delete_Club = gql`
  mutation DeleteClub($input: DeleteClubInput!) {
    deleteClub(input: $input) {
      id
    }
  }
`;

export const Remove_Club_Member = gql`
  mutation RemoveClubMember($clubId: String!, $userId: String!) {
    removeClubMember(clubId: $clubId, userId: $userId) {
      id
      isJoined
    }
  }
`;