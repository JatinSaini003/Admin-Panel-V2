import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useQuery, useMutation } from "@apollo/client";

// Queries & Mutations
import {
    Get_User_Info,
    Get_Posts,
    GET_LIKED_POSTS,
    GET_USER_REGISTERED_EVENTS,
    GET_USER_JOINED_CLUBS
} from "../../queries/userQueries";

//Images
import DefaultAvatar from "../../assets/img/avatar.png";

// Icons
import { MapPin, Phone, Mail, School, User } from "lucide-react";

// Components
import {
    Input,
    Profile,
    Post,
    ClubCard,
    EventCard,
    GroupCard,
    // HorizontalScrollWrapper,
    Carousel
} from "../../components/UI/Reusable/index";
import { ScaleLoader } from "react-spinners";


// Mocked Groups
const collegeArray = [
    {
        id: 1,
        college: "Amity University",
        totalUsers: 90,
        name: "Amity (2022-2023)",
    },
];

const UserDetails = () => {
    const { studentId } = useParams();
    const [userDetails, setUserDetails] = useState<any>(null);
    const [userImage, setUserImage] = useState<string>("");
    const [clubsArray, setClubsArray] = useState<any[]>([]);
    const [postsArray, setPostsArray] = useState<any[]>([]);
    const [likedPostsArray, setLikedPostsArray] = useState<any[]>([]);
    const [eventArray, setEventArray] = useState<any[]>([]);

    // ------------------ User Info ------------------
    const { data, loading, error } = useQuery(Get_User_Info, {
        variables: { userId: studentId },
    });

    useEffect(() => {
        const user = data?.getUserInfo?.user;
        setUserDetails(user);
        setUserImage(user?.profilePicId || "");
    }, [data]);

    // ------------------ Clubs ------------------
    const { data: clubsData, loading: clubsLoading } = useQuery(GET_USER_JOINED_CLUBS, {
        variables: { limit: 20, page: 1, userId: studentId },
        skip: !studentId,
    });

    useEffect(() => {
        const clubs = clubsData?.getUserJoinedClubs?.clubs;
        if (clubs) setClubsArray(clubs);
    }, [clubsData]);

    // ------------------ Events ------------------
    const { data: eventsData, loading: eventsLoading } = useQuery(GET_USER_REGISTERED_EVENTS, {
        variables: { input: { userId: studentId } },
        skip: !studentId,
    });

    useEffect(() => {
        const events = eventsData?.getUserRegisteredEvents?.events;
        if (events) setEventArray(events);
    }, [eventsData]);

    // ------------------ Posts ------------------
    const [getPosts, { data: postsData, loading: postsLoading }] = useMutation(Get_Posts);

    useEffect(() => {
        if (studentId) {
            getPosts({
                variables: {
                    input: {
                        userId: studentId,
                        page: 1,
                        limit: 20,
                        userPostsOnly: true,
                    },
                },
            });
        }
    }, [studentId, getPosts]);

    useEffect(() => {
        if (postsData?.getPosts?.posts) {
            setPostsArray(postsData.getPosts.posts);
        }
    }, [postsData]);


    // ------------------ Liked Posts ------------------
    const { data: likedPostsData, loading: likedPostsLoading } = useQuery(GET_LIKED_POSTS, {
        variables: { userId: studentId },
        skip: !studentId,
    });

    useEffect(() => {
        if (likedPostsData?.getLikedPosts?.posts) {
            setLikedPostsArray(likedPostsData.getLikedPosts.posts);
        }
    }, [likedPostsData]);


    // ------------------ Loading & Error ------------------
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <ScaleLoader color="#0070FF" />
            </div>
        );
    }

    if (error) return <p className="text-red-500">Error fetching user info</p>;


    // ------------------ Render ------------------
    return (
        <div className="bg-background-default text-default px-8">
            {/* ------------ Personal Info Section ------------ */}
            <div>

                {/* ------------ Heading and User Profile Picture ------------ */}
                <div>
                    <h2 className="text-subheading-semibold text-primary mb-4 font-medium">Personal Details</h2>
                    <Profile
                        image={userImage || DefaultAvatar}
                        heading={userDetails?.name || ""}
                        subHeading="Profile Picture"
                    />
                </div>

                {/* ------------ User Data Inputs Fields ------------ */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mb-10">
                    <Input label="Full Name" name="name" icon={User} value={userDetails?.name ?? ""} disabled />
                    <Input label="Username" name="username" icon={User} value={userDetails?.userName ?? ""} disabled />
                    <Input label="Location" name="location" icon={MapPin} value={userDetails?.location ?? "India"} disabled />
                    <Input label="Phone Number" name="phoneNumber" icon={Phone} value={userDetails?.phoneNumber ?? ""} disabled />
                    <Input label="Email ID" name="email" icon={Mail} value={userDetails?.email ?? ""} disabled />
                    <Input label="College/University" name="college" icon={School} value={userDetails?.college ?? ""} disabled />
                    <div className="col-span-full"><Input label="Bio" name="bio" value={userDetails?.bio ?? ""} disabled type="textarea" /></div>
                </div>
            </div>

            {/* ------------ Horizontal Separation Line ------------ */}
            {/* <div className="border border-border-muted my-10"></div> */}


            {/* ------------ User Activity Section ------------ */}
            <div>
                <h2 className="text-subheading-semibold text-primary mb-5 font-medium">User Activities</h2>

                {/* ------------ Clubs ------------ */}
                <section className="mb-10">
                    <h2 className="text-description-medium text-default">Joined Clubs</h2>
                    {clubsLoading ? (
                        <div className="flex justify-center items-center py-10">
                            <ScaleLoader color="#0070FF" />
                        </div>
                    ) : clubsArray.length === 0 ? (
                        <p className="text-center text-muted">User has not joined any clubs.</p>
                    ) : (
                        <Carousel
                            items={clubsArray}
                            renderItem={(club) => <ClubCard key={club.id} club={club} />}
                            className="mt-6"
                            type="StudentClubs"
                            exploreLink="Explore-clubs"
                            buttonLabel="Manage"
                        />
                    )}
                </section>

                {/* ------------ Posts ------------ */}
                <section className="mb-10">
                    <h2 className="text-description-medium text-default">Posts</h2>
                    {postsLoading ? (
                        <div className="flex justify-center items-center py-10">
                            <ScaleLoader color="#0070FF" />
                        </div>
                    ) : postsArray.length === 0 ? (
                        <p className="text-center text-muted">No posts found for this user.</p>
                    ) : (
                        <Carousel
                            items={postsArray}
                            renderItem={(post) => <Post key={post.id} post={post} />}
                            className="mt-6"
                            type="posts"
                            exploreLink="Explore-posts"
                            buttonLabel="Manage"
                        />
                    )}
                </section>

                {/* ------------ Liked Posts ------------ */}
                <section className="mb-10">
                    <h2 className="text-description-medium text-default">Liked Posts</h2>
                    {likedPostsLoading ? (
                        <div className="flex justify-center items-center py-10">
                            <ScaleLoader color="#0070FF" />
                        </div>
                    ) : likedPostsArray.length === 0 ? (
                        <p className="text-center text-muted">No liked posts by this user.</p>
                    ) : (
                        <Carousel
                            items={likedPostsArray}
                            renderItem={(Likedpost) => <Post key={Likedpost.id} post={Likedpost} />}
                            className="mt-6"
                            type="likedposts"
                            exploreLink="Explore-likedposts"
                            buttonLabel="Manage"
                        />
                    )}
                </section>

                {/* ------------ Events ------------ */}
                <section className="mb-10">
                    <h2 className="text-description-medium text-default">Participated Events</h2>
                    {eventsLoading ? (
                        <div className="flex justify-center items-center py-10">
                            <ScaleLoader color="#0070FF" />
                        </div>
                    ) : eventArray.length === 0 ? (
                        <p className="text-center text-muted">No events joined by user.</p>
                    ) : (
                        <Carousel
                            items={eventArray}
                            renderItem={(event) => <EventCard event={event} />}
                            className="mt-6"
                            type="events"
                            exploreLink="Explore-events"
                            buttonLabel="See All"
                        />
                    )}
                </section>

                {/* ------------ Groups (Mocked) ------------ */}
                <section className="mb-10">
                    <h2 className="text-description-medium text-default">Joined Groups</h2>
                    {collegeArray.length === 0 ? (
                        <p className="text-center text-muted">No groups joined by user.</p>
                    ) : (
                        <Carousel
                            items={collegeArray}
                            renderItem={(group) => <GroupCard college={group} />}
                            className="mt-6"
                            type="groups"
                            exploreLink="Explore-groups"
                            buttonLabel="Manage"
                        />
                    )}
                </section>

            </div>
        </div>
    );
};

export default UserDetails;
