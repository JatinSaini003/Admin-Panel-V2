import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery, useMutation } from "@apollo/client";

// Queries
import { Get_Club_Details, Update_Club } from "../../../queries/clubQueries";
import { Get_Events } from "../../../queries/eventQueries";
import { Get_Posts } from "../../../queries/userQueries";

// Components
import {
    Input,
    Profile,
    Post,
    EventCard,
    Carousel
} from "../../../components/UI/Reusable/index";

// Loaders
import { ScaleLoader } from "react-spinners";

// Icons
import { Tag, BookOpen, Calendar } from "lucide-react";
import { toast } from "react-toastify";

const ClubDetails = () => {
    const { clubId } = useParams();
    const navigate = useNavigate();

    const [club, setClub] = useState<any>(null);
    const [events, setEvents] = useState<any[]>([]);
    const [posts, setPosts] = useState<any[]>([]);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<any>({});

    const [UpdateClub, { loading: isUpdating }] = useMutation(Update_Club);

    // ------------------ Club Details ------------------
    const { data: clubData, loading, error } = useQuery(Get_Club_Details, {
        variables: { id: clubId },
    });

    useEffect(() => {
        if (clubData?.getClubDetails) {
            const details = clubData.getClubDetails;
            const formattedClub = {
                ...details,
                createdAt: new Date(details.createdAt).toISOString().split("T")[0],
            };
            setClub(formattedClub);
            setFormData(formattedClub);
        }
    }, [clubData]);

    // ------------------ Events ------------------
    const { data: eventsData, loading: eventsLoading } = useQuery(Get_Events, {
        variables: { input: { clubId: clubId, status: "UPCOMING" } },
        skip: !clubId,
    });

    useEffect(() => {
        if (eventsData?.getEvents?.events) {
            setEvents(eventsData.getEvents.events);
        }
    }, [eventsData]);

    // ------------------ Posts ------------------
    const [getPosts, { data: postsData, loading: postsLoading }] = useMutation(Get_Posts);

    useEffect(() => {
        if (clubId) {
            getPosts({
                variables: {
                    input: {
                        clubId: clubId,
                    },
                },
            });
        }
    }, [clubId, getPosts]);

    useEffect(() => {
        if (postsData?.getPosts?.posts) {
            setPosts(postsData.getPosts.posts);
        }
    }, [postsData]);


    const handleUpdate = async () => {
        try {
            await UpdateClub({
                variables: {
                    id: club.id,
                    input: {
                        id: clubId,
                        name: formData.name,
                        category: formData.category,
                        description: formData.description,
                    },
                },
            });
            toast.success("Club details updated successfully");
            setIsEditing(false);
        } catch (err) {
            toast.error("updation failed");
            // console.error("Update failed:", err);
        }
    };

    const handleCancel = () => {
        setFormData({ ...club });
        setIsEditing(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <ScaleLoader color="#0070FF" />
            </div>
        );
    }

    if (error) return <p className="text-red-500">Error fetching club details</p>;

    return (
        <div className="bg-background-default text-default px-8">
            {/* ------------ Club Info Section ------------ */}
            <div>
                <h2 className="text-subheading-semibold text-primary mb-4 font-medium">
                    Club Details
                </h2>
                <Profile
                    image={club?.imageUrl || ""}
                    heading={club?.name || ""}
                    subHeading="Club Thumbnail"
                    actionButtons={
                        <>
                            <button
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-3 rounded text-sm"
                                onClick={() => setIsEditing((prev) => !prev)}
                            >
                                {isEditing ? "Cancel Edit" : "Edit Club"}
                            </button>
                            <button
                                className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-3 rounded text-sm"
                                onClick={() => navigate(`/clubs/details/${club.id}/members`)}
                            >
                                View All Members
                            </button>
                        </>
                    }
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mb-4">
                    <Input
                        label="Club Name"
                        name="name"
                        icon={BookOpen}
                        value={formData.name ?? ""}
                        disabled={!isEditing}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Input
                        label="Category"
                        name="category"
                        icon={Tag}
                        value={formData.category ?? ""}
                        disabled={!isEditing}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                    <Input
                        label="Created on"
                        name="createdOn"
                        icon={Calendar}
                        value={formData.createdAt ?? ""}
                        disabled
                    />
                    <div className="col-span-full">
                        <Input
                            label="Description"
                            name="description"
                            value={formData.description ?? ""}
                            disabled={!isEditing}
                            type="textarea"
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                </div>

                {isEditing && (
                    <div className="flex gap-4 mb-10">
                        <button
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                            onClick={handleUpdate}
                            disabled={isUpdating}
                        >
                            {isUpdating ? "Updating..." : "Update"}
                        </button>
                        <button
                            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            {/* ------------ Club Activities ------------ */}
            <div>
                <h2 className="text-subheading-semibold text-primary mb-5 font-medium">
                    Club Activities
                </h2>

                {/* ------------ Posts ------------ */}
                <section className="mb-10">
                    <h2 className="text-description-medium text-default">Posts</h2>
                    {postsLoading ? (
                        <div className="flex justify-center items-center py-10">
                            <ScaleLoader color="#0070FF" />
                        </div>
                    ) : posts.length === 0 ? (
                        <p className="text-center text-muted">No posts found.</p>
                    ) : (
                        <Carousel
                            items={posts}
                            renderItem={(post) => <Post key={post.id} post={post} />}
                            className="mt-6"
                            type="clubPosts"
                            exploreLink="Explore-club-posts"
                            buttonLabel="Manage"
                        />
                    )}
                </section>

                {/* ------------ Events ------------ */}
                <section className="mb-10">
                    <h2 className="text-description-medium text-default">Events</h2>
                    {eventsLoading ? (
                        <div className="flex justify-center items-center py-10">
                            <ScaleLoader color="#0070FF" />
                        </div>
                    ) : events.length === 0 ? (
                        <p className="text-center text-muted">No Events found.</p>
                    ) : (
                        <Carousel
                            items={events}
                            renderItem={(event) => <EventCard event={event} />}
                            className="mt-6"
                            type="clubEvents"
                            exploreLink="Explore-club-events"
                            buttonLabel="See All"
                        />
                    )}
                </section>
            </div>
        </div>
    );
};

export default ClubDetails;