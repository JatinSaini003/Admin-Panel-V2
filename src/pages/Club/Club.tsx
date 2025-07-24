import { useEffect } from "react";
import { useQuery, NetworkStatus, ApolloClient } from "@apollo/client";
// import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import { Carousel, ClubCard, CreateItem } from "../../components/UI/Reusable";

import { GET_CLUBS, Delete_Club } from "../../queries/clubQueries";

import { ScaleLoader } from "react-spinners";

interface Club {
    id: string;
    imageUrl: string;
    name: string;
}

interface GetClubsResponse {
    getClubs: {
        clubs: Club[];
        hasMore: boolean;
    };
}

// Deletes a Club by ID
export const handleDeleteClub = async (id: string, client: ApolloClient<object>, refetch: () => Promise<void>) => {
    try {
        const response = await client.mutate({
            mutation: Delete_Club,
            variables: {
                input: { id },
            },
        });

        if (response?.data?.deleteClub?.id) {
            toast.success("Club deleted successfully");
            if (refetch) await refetch();
        }
    } catch (err) {
        // console.error("Error deleting club:", err);
        toast.error("Failed to delete club");
    }
};

const Club = () => {
    // const navigate = useNavigate();

    const { data, loading, error, refetch, networkStatus } = useQuery<GetClubsResponse>(GET_CLUBS, {
        variables: {
            category: "",
            limit: 10,
            status: "ACTIVE",
        },
        notifyOnNetworkStatusChange: true,
    });

    const clubData = data?.getClubs?.clubs ?? [];

    useEffect(() => {
        refetch({ category: "", limit: 10 });
    }, [refetch]);

    // Show full-screen loader on initial load
    if (loading && networkStatus === NetworkStatus.loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-background-default">
                <ScaleLoader color="#0070FF" />
            </div>
        );
    }


    // Navigate to edit details
    // const handleEdit = (id: string) => {
    //     navigate(`/club/details/${id}`);
    // };

    if (error) {
        return (
            <p className="text-error p-8 text-description-regular">
                Error fetching clubs
            </p>
        );
    }

    const loadingClubs = loading || networkStatus === NetworkStatus.setVariables;

    return (
        <div className="bg-background-default text-default px-8">
            <div className="flex flex-col gap-9">
                {/* Create Club Section */}
                <section>
                    <h1 className="text-subheading-semibold text-default pb-3">
                        Create Clubs
                    </h1>
                    <CreateItem name="Create a Club" variant="clubs" />
                </section>

                {/* Ongoing Clubs Section */}
                <section>
                    <div className="flex justify-between items-center">
                        <h1 className="text-subheading-semibold text-default pb-3">
                            Ongoing Clubs
                        </h1>
                    </div>

                    {/* Conditional Loader or Club Grid */}
                    {loadingClubs ? (
                        <div className="pt-4 min-h-[250px] flex justify-center items-center">
                            <ScaleLoader color="#0070FF" />
                        </div>
                    ) : clubData?.length === 0 ? (
                        <p className="text-center text-muted">There are no ongoing clubs.</p>
                    ) : (
                        <Carousel
                            items={clubData}
                            renderItem={(club) => <ClubCard key={club.id} club={club} />}
                            className="mt-6"
                            type="ongoingClubs"
                            exploreLink="ongoing-clubs"
                            buttonLabel="Manage"
                        />
                    )}
                </section>
            </div>
        </div>
    );
};

export default Club;
