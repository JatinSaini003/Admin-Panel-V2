import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useQuery, useMutation, useApolloClient, ApolloClient } from "@apollo/client";
import { Link } from "react-router-dom";
import {
    GET_USER_JOINED_CLUBS,
    Get_Posts,
    GET_LIKED_POSTS,
    GET_USER_REGISTERED_EVENTS,
    Delete_Post
} from "../../../queries/userQueries";
import { GET_CLUBS } from "../../../queries/clubQueries";
import { Get_All_Groups } from "../../../queries/groupQueries";
import { handleDeleteClub } from "../../../pages/Club/Club";
import { handleDeleteGroup } from "../../../pages/Groups/Groups";
import { handleEventDelete } from "../../../pages/Events/Event";
import { ConfirmationPopup } from "./index"
import { useGlobalSearch } from "../../../search/SearchContext";

// Components
import { Post, EventCard, GroupCard, Pagination } from "./";
import { ScaleLoader } from "react-spinners";
import { Get_Events } from "../../../queries/eventQueries";
import { toast } from "react-toastify";

const FullListPage = () => {
    const client = useApolloClient(); // Get Apollo Client instance
    const location = useLocation();
    const { searchQuery } = useGlobalSearch();
    const { studentId, clubId } = useParams();
    const type = location.state?.type || "";
    // console.log(type)
    const itemsPerPage = 50;

    const [page, setPage] = useState(1);
    const [items, setItems] = useState<any[]>([]);
    const [hasMore, setHasMore] = useState(false);

    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

    const openDeleteConfirmation = (itemId: string) => {
        setSelectedItemId(itemId);
        setShowConfirmation(true);
    };

    // Deletes a post
    const handleDeletePost = async (
        id: string,
        client: ApolloClient<any>,
        onSuccess?: () => Promise<void>
    ) => {
        try {
            await client.mutate({
                mutation: Delete_Post,
                variables: { id: id },
            });
            if (onSuccess) await onSuccess();
            toast.success("Post deleted successfully");
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("Failed to delete post");
        }
    };

    const confirmDelete = async () => {
        if (!selectedItemId) return;

        const runRefetch = async () => {
            let result;
            switch (type) {
                case "upcoming-events":
                case "cancelled-events":
                case "completed-events":
                    result = await filteredEventsRefetch({ page });
                    setItems(result?.data?.getEvents?.events ?? []);
                    setHasMore(result?.data?.getEvents?.hasMore ?? false);
                    break;

                case "ongoingClubs":
                    result = await ongoingRefetch({ page });
                    setItems(result?.data?.getClubs?.clubs ?? []);
                    setHasMore(result?.data?.getClubs?.hasMore ?? false);
                    break;

                case "clubPosts":
                    result = await getPosts({
                        variables: {
                            input: {
                                clubId,
                                page,
                                limit: itemsPerPage,
                                search: searchQuery
                            },
                        },
                    });
                    setItems(result?.data?.getPosts?.posts ?? []);
                    setHasMore(result?.data?.getPosts?.hasMore ?? false);
                    break;

                case "posts":
                    result = await getPosts({
                        variables: {
                            input: {
                                userId: studentId,
                                page,
                                limit: itemsPerPage,
                                userPostsOnly: true,
                                search: searchQuery
                            },
                        },
                    });
                    setItems(result?.data?.getPosts?.posts ?? []);
                    setHasMore(result?.data?.getPosts?.hasMore ?? false);
                    break;

                case "ongoingGroups":
                    result = await groupRefetch({ page });
                    setItems(result?.data?.getAllGroups?.groups ?? []);
                    setHasMore(result?.data?.getAllGroups?.hasMore ?? false);
                    break;

                default: []
            }
        };

        switch (type) {
            case "upcoming-events":
            case "cancelled-events":
            case "completed-events":
                await handleEventDelete(selectedItemId, client, runRefetch);
                break;

            case "ongoingClubs":
                await handleDeleteClub(selectedItemId, client, runRefetch);
                break;

            case "clubPosts":
                await handleDeletePost(selectedItemId, client, runRefetch);
                break;

            case "posts":
                await handleDeletePost(selectedItemId, client, runRefetch);
                break;

            case "ongoingGroups":
                await handleDeleteGroup(selectedItemId, client, runRefetch);
                break;

            default: []
        }

        setSelectedItemId(null);
        setShowConfirmation(false);
    };


    const cancelDelete = () => {
        setSelectedItemId(null);
        setShowConfirmation(false);
    };

    // Queries
    const { data: ongoingClubData, loading: ongoingClubLoading, error: ongoingClubError, refetch: ongoingRefetch } = useQuery(GET_CLUBS, {
        variables: {
            category: "",
            page,
            limit: itemsPerPage,
            status: "ACTIVE",
            search: searchQuery,
        },
        fetchPolicy: "network-only",
        notifyOnNetworkStatusChange: true,
        skip: type !== "ongoingClubs",
    });

    const { data: clubsData, loading: clubLoading, error: clubError, refetch: clubsRefetch } = useQuery(GET_USER_JOINED_CLUBS, {
        variables: { userId: studentId, page, limit: itemsPerPage, search: searchQuery },
        skip: !studentId || type !== "StudentClubs",
        fetchPolicy: "network-only"
    });

    const { data: eventsData, loading: eventLoading, error: eventError, refetch: eventsRefetch } = useQuery(GET_USER_REGISTERED_EVENTS, {
        variables: { input: { userId: studentId, page, limit: itemsPerPage, search: searchQuery } },
        skip: !studentId || type !== "events",
        fetchPolicy: "network-only"
    });

    const { data: filteredEventsData, loading: filteredEventsLoading, error: filteredEventsError, refetch: filteredEventsRefetch } = useQuery(Get_Events, {
        variables: { input: { status: type.replace("-events", "").toUpperCase(), page, limit: itemsPerPage, search: searchQuery } },
        skip: !["upcoming-events", "cancelled-events", "completed-events"].includes(type),
        fetchPolicy: "network-only"
    });

    const { data: clubeventsData, loading: clubeventsLoading, refetch: clubEventsRefetch } = useQuery(Get_Events, {
        variables: { input: { clubId: clubId, status: "UPCOMING", page, limit: itemsPerPage, search: searchQuery } },
        skip: !clubId,
        fetchPolicy: "network-only"
    });

    const { data: likedPostsData, loading: LikedPostLoading, error: LikedPostError, refetch: LikedPostsRefetch } = useQuery(GET_LIKED_POSTS, {
        variables: { userId: studentId, page, limit: itemsPerPage, search: searchQuery },
        skip: !studentId || type !== "likedposts",
        fetchPolicy: "network-only"
    });

    const { data: groupData, loading: groupLoading, error: groupError, refetch: groupRefetch } = useQuery(Get_All_Groups, {
        variables: { page, limit: itemsPerPage },
        skip: type !== "ongoingGroups",
        fetchPolicy: "network-only"
    });

    const [getPosts, { loading: postLoading, error: postError }] = useMutation(Get_Posts);

    const fetchData = async () => {
        switch (type) {
            case "ongoingClubs":
                const clubRefetchResult = await ongoingRefetch({ page, search: searchQuery });
                setItems(clubRefetchResult.data?.getClubs?.clubs ?? []);
                setHasMore(clubRefetchResult.data?.getClubs?.hasMore ?? false);
                break;

            case "clubPosts":
                if (!clubId) break;
                const clubPostResult = await getPosts({
                    variables: {
                        input: {
                            clubId,
                            page,
                            limit: itemsPerPage,
                            search: searchQuery
                        },
                    },
                });
                setItems(clubPostResult?.data?.getPosts?.posts ?? []);
                setHasMore(clubPostResult?.data?.getPosts?.hasMore ?? false);
                break;

            case "StudentClubs":
                const studentClubRefetchResult = await clubsRefetch({ page, search: searchQuery });
                setItems(studentClubRefetchResult.data?.getUserJoinedClubs?.clubs ?? []);
                setHasMore(studentClubRefetchResult.data?.getUserJoinedClubs?.hasMore ?? false);
                break;

            case "events":
                const eventRefetchResult = await eventsRefetch({ page, search: searchQuery });
                setItems(eventRefetchResult.data?.getUserRegisteredEvents?.events ?? []);
                setHasMore(eventRefetchResult.data?.getUserRegisteredEvents?.hasMore ?? false);
                break;

            case "clubEvents":
                const clubEventRefetchResult = await clubEventsRefetch({ page, search: searchQuery });
                setItems(clubEventRefetchResult.data?.getEvents?.events ?? []);
                setHasMore(clubEventRefetchResult.data?.getEvents?.hasMore ?? false);
                break;

            case "upcoming-events":
            case "cancelled-events":
            case "completed-events":
                const filteredEvents = await filteredEventsRefetch({ page, search: searchQuery });
                setItems(filteredEvents.data?.getEvents?.events ?? []);
                setHasMore(filteredEvents.data?.getEvents?.hasMore ?? false);
                break;

            case "likedposts":
                const likedPostRefetchResult = await LikedPostsRefetch({ page, search: searchQuery });
                setItems(likedPostRefetchResult.data?.getLikedPosts?.posts ?? []);
                setHasMore(likedPostRefetchResult.data?.getLikedPosts?.hasMore ?? false);
                break;

            case "posts":
                const res = await getPosts({
                    variables: {
                        input: {
                            userId: studentId,
                            page,
                            limit: itemsPerPage,
                            userPostsOnly: true,
                            search: searchQuery
                        },
                    },
                });

                const uniquePosts = res.data.getPosts.posts.filter(
                    (post: any, index: any, self: any) =>
                        index === self.findIndex((p: any) => p.id === post.id)
                );

                setItems(uniquePosts ?? []);
                setHasMore(res?.data?.getPosts?.hasMore ?? false);
                break;

            case "ongoingGroups":
                const groupRefetchResult = await groupRefetch({ page });
                setItems(groupRefetchResult?.data?.getAllGroups?.groups ?? []);
                setHasMore(groupRefetchResult?.data?.getAllGroups?.hasMore ?? false);
                break;

            default:
                setItems([]);
                setHasMore(false);
                break;
        }
    };

    // Refetches the data when the type/page changes.
    useEffect(() => {
        fetchData();
    }, [type, page]);


    useEffect(() => {
        const fetchData = async () => {
            // if (!studentId) return;

            switch (type) {
                case "ongoingClubs":
                    if (ongoingClubData?.getClubs?.clubs) {
                        setItems(ongoingClubData?.getClubs?.clubs);
                        // console.log(items)
                        setHasMore(ongoingClubData?.getClubs?.hasMore);
                    }
                    break;

                case "clubPosts":
                    if (!clubId) break;
                    const clubPostRes = await getPosts({
                        variables: {
                            input: {
                                clubId,
                                page,
                                limit: itemsPerPage,
                                search: searchQuery
                            }
                        }
                    });
                    if (clubPostRes?.data?.getPosts?.posts) {
                        setItems(clubPostRes.data.getPosts.posts);
                        setHasMore(clubPostRes.data.getPosts.hasMore);
                    }
                    break;

                case "StudentClubs":
                    if (clubsData?.getUserJoinedClubs?.clubs) {
                        setItems(clubsData.getUserJoinedClubs.clubs);
                        setHasMore(clubsData.getUserJoinedClubs.hasMore);
                    }
                    break;

                case "events":
                    if (eventsData?.getUserRegisteredEvents?.events) {
                        setItems(eventsData.getUserRegisteredEvents.events);
                        setHasMore(eventsData.getUserRegisteredEvents.hasMore);
                    }
                    break;

                case "upcoming-events":
                case "cancelled-events":
                case "completed-events":
                    if (filteredEventsData?.getEvents?.events) {
                        setItems(filteredEventsData?.getEvents?.events);
                        setHasMore(filteredEventsData?.getEvents?.hasMore);
                    }
                    break;

                case "clubEvents":
                    if (clubeventsData?.getEvents?.events) {
                        setItems(clubeventsData?.getEvents?.events);
                        setHasMore(clubeventsData?.getEvents?.hasMore);
                    }
                    break;

                case "likedposts":
                    if (likedPostsData?.getLikedPosts?.posts) {
                        setItems(likedPostsData.getLikedPosts.posts);
                        setHasMore(likedPostsData.getLikedPosts.hasMore);
                    }
                    break;

                case "posts":
                    const res = await getPosts({
                        variables: {
                            input: {
                                userId: studentId,
                                page,
                                limit: itemsPerPage,
                                userPostsOnly: true,
                                search: searchQuery
                            }
                        }
                    });

                    if (res?.data?.getPosts?.posts) {
                        const uniquePosts = res.data.getPosts.posts.filter(
                            (post: any, index: any, self: any) =>
                                index === self.findIndex((p: any) => p.id === post.id)
                        );
                        setItems(uniquePosts);
                        setHasMore(res.data.getPosts.hasMore);
                    }
                    break;

                case "ongoingGroups":
                    if (groupData?.getAllGroups?.groups) {
                        setItems(groupData.getAllGroups.groups);
                        setHasMore(groupData.getAllGroups.hasMore);
                    }
                    break;

                default:
                    setItems([]);
                    break;
            }
        };

        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type, studentId, page, clubsData, eventsData, likedPostsData, searchQuery]);


    const handleAction = (label: string, item: any) => {
        alert(`${label} clicked for item ID: ${item.id}`);
    };

    if (clubLoading || eventLoading || LikedPostLoading || postLoading || ongoingClubLoading || clubeventsLoading || filteredEventsLoading || groupLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <ScaleLoader color="#0070FF" />
            </div>
        )
    }

    if (clubError || eventError || LikedPostError || postError || ongoingClubError || filteredEventsError || groupError) return <p className="text-red-500">Error fetching Data</p>;

    const renderItem = (item: any) => {
        switch (type) {
            case "ongoingClubs":
                return (
                    <Link to={`/clubs/details/${item.id}`} key={item.id}>
                        <div key={item.id} className="flex bg-background-light p-4 rounded-lg border border-border-default shadow-sm">
                            <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded object-cover mr-4" />
                            <div className="flex flex-col justify-between flex-grow">
                                <div>
                                    <h3 className="text-base font-semibold text-default">{item.name}</h3>
                                    <p className="text-muted text-sm">{item.category}</p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault(); // Prevent <Link> navigation
                                        e.stopPropagation(); // Stop bubbling up the click
                                        openDeleteConfirmation(item.id);
                                    }}
                                    className="mt-2 bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded w-fit"
                                >
                                    Delete Club
                                </button>
                            </div>
                        </div>
                    </Link>
                );

            case "StudentClubs":
                return (
                    <div key={item.id} className="flex bg-background-light p-4 rounded-lg border border-border-default shadow-sm">
                        <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded object-cover mr-4" />
                        <div className="flex flex-col justify-between flex-grow">
                            <div>
                                <h3 className="text-base font-semibold text-default">{item.name}</h3>
                                <p className="text-muted text-sm">{item.category}</p>
                            </div>
                            <button
                                onClick={() => handleAction("Remove Club", item)}
                                className="mt-2 bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded w-fit"
                            >
                                Remove from Club
                            </button>
                        </div>
                    </div>
                );

            case "clubPosts":
                return (
                    <div key={item.id} className="flex w-fit flex-col h-full border border-border-default rounded-md p-2 bg-background-light shadow-sm">
                        <Post post={item} />
                        <div className="flex justify-end gap-2 mt-3">
                            <button
                                onClick={() => openDeleteConfirmation(item.id)}
                                className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                );

            case "posts":
                return (
                    <div key={item.id} className="flex w-fit flex-col h-full border border-border-default rounded-md p-2 bg-background-light shadow-sm">
                        <Post key={item.id} post={item} />
                        <div className="flex justify-end gap-2 mt-3">
                            <button
                                onClick={() => openDeleteConfirmation(item.id)}
                                className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                );

            case "likedposts":
                return (
                    <div key={item.id} className="flex flex-col w-fit h-full border border-border-default rounded-md p-2 bg-background-light shadow-sm">
                        <Post post={item} />
                        <div className="flex justify-end mt-3">
                            <button
                                onClick={() => handleAction("Unlike Post", item)}
                                className="px-3 py-1 text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                            >
                                Unlike
                            </button>
                        </div>
                    </div>
                );

            case "upcoming-events":
            case "cancelled-events":
            case "completed-events":
            case "clubEvents":
                return (
                    <Link to={`/event/details/${item.id}`} key={item.id}>
                        <div key={item.id} className="flex flex-col h-full border border-border-default rounded-md p-4 bg-background-light shadow-sm">
                            <EventCard event={item} />
                            <div className="flex justify-end mt-3">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault(); // Prevent <Link> navigation
                                        e.stopPropagation(); // Stop bubbling up the click
                                        openDeleteConfirmation(item.id);
                                    }}
                                    className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded"
                                >
                                    Delete Event
                                </button>
                            </div>
                        </div>
                    </Link>
                );

            case "events":
                return (
                    <div key={item.id} className="flex flex-col h-full border border-border-default rounded-md p-4 bg-background-light shadow-sm">
                        <EventCard event={item} />
                        <div className="flex justify-end mt-3">
                            <button
                                onClick={() => handleAction("Remove Event", item)}
                                className="px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded"
                            >
                                Remove from History
                            </button>
                        </div>
                    </div>
                );

            case "ongoingGroups":
                return (
                    <Link to={`/group/details/${item.id}`} key={item.id}>
                        <div key={item.id} className="flex flex-col w-fit h-full border border-border-default rounded-md p-4 bg-background-light shadow-sm">
                            <GroupCard college={item} />
                            <div className="flex justify-end mt-3">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault(); // Prevent <Link> navigation
                                        e.stopPropagation(); // Stop bubbling up the click
                                        openDeleteConfirmation(item.id);
                                    }}
                                    className="px-3 py-1 text-xs bg-red-500 hover:bg-danger text-white rounded"
                                >
                                    Delete Group
                                </button>
                            </div>
                        </div>
                    </Link>
                );

            default:
                return null;
        }
    };

    return (
        <div className="w-full bg-background-default text-default overflow-x-hidden">
            <div className="mx-auto px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {items.map((item) => renderItem(item))}
                </div>

                <div className="flex justify-center">
                    <Pagination
                        page={page}
                        setPage={setPage}
                        hasMore={hasMore}
                    />
                </div>
            </div>

            {showConfirmation && (
                <ConfirmationPopup
                    isOpen={showConfirmation}
                    message="Are you sure you want to delete this?"
                    confirmLabel="Yes"
                    cancelLabel="No"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}

        </div>
    );
};

export default FullListPage;
