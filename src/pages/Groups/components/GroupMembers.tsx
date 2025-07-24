import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
// import { toast } from "react-toastify";

import { Get_Group_Details } from "../../../queries/groupQueries";
import MemberCard from "../../../components/UI/Reusable/MemberCard";
import { ConfirmationPopup } from "../../../components/UI/Reusable";

// Interfaces for typing
interface Member {
    id: string;
    name: string;
    profilePicId: string;
    userName: string;
}

function GroupMembers() {
    const navigate = useNavigate();
    const { groupId } = useParams<{ groupId: string }>();

    const [members, setMembers] = useState<Member[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedMember, setSelectedMember] = useState<string | null>(null);

    // Query to fetch club members
    const {
        data,
        loading,
        error,
        // refetch,
    } = useQuery(Get_Group_Details, {
        variables: { groupId: groupId ?? "" },
        skip: !groupId,
    });

    useEffect(() => {
        if (data?.getGroupDetails?.getGroupUsers?.groupUsers) {
            setMembers(data.getGroupDetails.getGroupUsers.groupUsers);
        }
    }, [data]);

    // Mutation to remove member
    // const [removeEventMember] = useMutation(Remove_Event_Member);

    // const handleRemoveGroupMember = async (userId: string) => {
    //     try {
    //         const response = await removeEventMember({
    //             variables: { eventId, userId },
    //         });

    //         if (response?.data?.removeEventMember?.id) {
    //             await refetch();
    //             toast.success("Member removed successfully");
    //         } else {
    //             toast.error("Failed to remove member");
    //         }
    //     } catch (err: any) {
    //         console.error("Mutation error:", err.message);
    //         toast.error("Something went wrong while removing the member");
    //     }
    // };

    const openConfirmation = (memberId: string) => {
        setSelectedMember(memberId);
        setShowPopup(true);
    };

    const confirmRemove = async () => {
        if (selectedMember) {
            // await handleRemoveClubMember(selectedMember);
        }
        setShowPopup(false);
        setSelectedMember(null);
    };

    const cancelRemove = () => {
        setShowPopup(false);
        setSelectedMember(null);
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
                            key={member.id}
                            member={{
                                id: member.id,
                                name: member.name,
                                userName: member.userName,
                                profilePicId: member.profilePicId
                            }}
                            onViewProfile={() => navigate(`/user-details/${member.id}`)}
                            onRemove={() => openConfirmation(member.id)}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-center text-muted font-medium mt-10">
                    No Event Members Found
                </p>
            )}

            {showPopup && selectedMember && (
                <ConfirmationPopup
                    isOpen={showPopup}
                    message={`Are you sure you want to remove this user?`}
                    confirmLabel="Yes, Remove"
                    cancelLabel="No"
                    onConfirm={confirmRemove}
                    onCancel={cancelRemove}
                />
            )}
        </div>
    );
}

export default GroupMembers;
