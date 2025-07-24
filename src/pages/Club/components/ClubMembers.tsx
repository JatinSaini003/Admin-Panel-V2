import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { Get_Club_Members, Remove_Club_Member } from "../../../queries/clubQueries";
import MemberCard from "../../../components/UI/Reusable/MemberCard";

// Interfaces for typing
interface Member {
    id: string;
    name: string;
    profilePicId: string;
    college: string;
}

interface ClubMembersData {
    getClubMembers: {
        members: Member[];
    };
}

interface ClubMembersVars {
    input: {
        clubId: string;
    };
}

function ClubMembers() {
    const navigate = useNavigate();
    const { clubId } = useParams<{ clubId: string }>();

    const [members, setMembers] = useState<Member[]>([]);

    // Query to fetch club members
    const {
        data,
        loading,
        error,
        refetch,
    } = useQuery<ClubMembersData, ClubMembersVars>(Get_Club_Members, {
        variables: { input: { clubId: clubId ?? "" } },
        skip: !clubId,
    });

    useEffect(() => {
        if (data?.getClubMembers?.members) {
            setMembers(data.getClubMembers.members);
        }
    }, [data]);

    // Mutation to remove member
    const [removeClubMember] = useMutation(Remove_Club_Member);

    const handleRemoveClubMember = async (userId: string) => {
        try {
            const response = await removeClubMember({
                variables: { clubId, userId },
            });

            if (response?.data?.removeClubMember?.id) {
                await refetch();
                toast.success("Member removed successfully");
            } else {
                toast.error("Failed to remove member");
            }
        } catch (err: any) {
            console.error("Mutation error:", err.message);
            toast.error("Something went wrong while removing the member");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-white">
                Loading Members...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 mt-10">
                Failed to load members. Please try again later.
            </div>
        );
    }

    return (
        <div className="bg-background-default px-8 text-white">
            <h2 className="text-xl font-semibold mb-6">List of Members</h2>

            {members.length > 0 ? (
                <div className="space-y-4">
                    {members.map((member) => (
                        <MemberCard
                            member={{
                                id: member.id,
                                name: member.name,
                                university: member.college,
                                profilePicId: member.profilePicId
                            }}
                            onViewProfile={() => navigate(`/user-details/${member.id}`)}
                            onRemove={() => handleRemoveClubMember(member.id)}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-center text-muted font-medium mt-10">
                    No Club Members Found
                </p>
            )}
        </div>
    );
}

export default ClubMembers;
