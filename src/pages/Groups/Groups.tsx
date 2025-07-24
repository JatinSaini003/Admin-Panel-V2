import { ApolloClient, useQuery } from "@apollo/client";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Delete_Group, Get_All_Groups } from "../../queries/groupQueries";
import CreateItem from "../../components/UI/Reusable/CreateItem";
import GroupCard from "../../components/UI/Reusable/GroupCard";
import { Carousel } from "../../components/UI/Reusable";
import { ScaleLoader } from "react-spinners";
import { toast } from "react-toastify";

// -------------------------
// Type Definitions
// -------------------------
interface Group {
    id: string;
    name: string;
    college: string;
    totalUsers: number;
    avatar?: string;
    description?: string;
}

// Deletes a Group by ID
export const handleDeleteGroup = async (id: string, client: ApolloClient<object>, refetch: () => Promise<void>) => {
    try {
        const response = await client.mutate({
            mutation: Delete_Group,
            variables: {
                groupId: id,
            },
        });
        // console.log(response)

        if (response?.data?.deleteGroup?.message) {
            toast.success("Group deleted successfully");
            if (refetch) await refetch();
        }
    } catch (err) {
        // console.error("Error deleting group:", err);
        toast.error("Failed to delete group");
    }
};

// -------------------------
// Groups Page Component
// -------------------------
const Groups: React.FC = () => {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("search")?.toLowerCase().trim() || "";

    const [page] = useState(1);
    const [limit] = useState(10); // You can paginate later

    const { data, loading } = useQuery(Get_All_Groups, {
        variables: { page, limit },
        fetchPolicy: "network-only",
    });

    const allGroups: Group[] = useMemo(() => {
        return (
            data?.getAllGroups?.groups?.map((group: any) => ({
                id: group.id,
                name: group.name,
                college: group.collegeId,
                avatar: group.avatar,
                Members: group.totalUsers,
                description: group.description,
            })) || []
        );
    }, [data]);

    const filteredGroups = useMemo(() => {
        if (!searchQuery) return allGroups;
        return allGroups.filter(
            (group) =>
                group.name?.toLowerCase().includes(searchQuery) ||
                group.college?.toLowerCase().includes(searchQuery) ||
                group.description?.toLowerCase().includes(searchQuery)
        );
    }, [searchQuery, allGroups]);

    return (
        <div className="bg-background-default text-default px-8">
            <div className="flex flex-col gap-9">
                {/* Section 1: Create Group */}
                <section>
                    <h1 className="text-default font-Gilroy text-[20px] pb-3">
                        Create a Group
                    </h1>
                    <CreateItem name="Create a Group" variant="groups" />
                </section>

                {/* Section 2: Ongoing Groups */}
                <section>
                    <h1 className="text-default font-Gilroy text-[20px] pb-3">
                        Ongoing Groups
                    </h1>
                    {loading ? (
                        <div className="pt-4 min-h-[250px] flex justify-center items-center">
                            <ScaleLoader color="#0070FF" />
                        </div>
                    ) : filteredGroups.length === 0 ? (
                        <p className="text-center text-muted font-semibold">
                            No Ongoing Groups Available
                        </p>
                    ) : (
                        <Carousel
                            items={filteredGroups}
                            renderItem={(group) => (
                                <GroupCard key={group.id} college={group} />
                            )}
                            type="ongoingGroups"
                            exploreLink="/group/ongoing-groups"
                            buttonLabel="See All"
                        />
                    )}
                </section>
            </div>
        </div>
    );
};

export default Groups;
