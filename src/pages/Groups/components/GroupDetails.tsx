import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery, useMutation } from "@apollo/client";

// Queries
import { Get_Group_Details, Update_Group } from "../../../queries/groupQueries";

// Components
import {
    Input,
    Profile,
} from "../../../components/UI/Reusable/index";

// Loaders
import { ScaleLoader } from "react-spinners";

// Icons
import { BookOpen, User } from "lucide-react";
import { toast } from "react-toastify";

const GroupDetails = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();

    const [group, setGroup] = useState<any>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<any>({});

    const [UpdateGroup, { loading: isUpdating }] = useMutation(Update_Group);

    // ------------------ Event Details ------------------
    const { data: GroupData, loading, error } = useQuery(Get_Group_Details, {
        variables: { groupId: groupId },
    });

    useEffect(() => {
        if (GroupData?.getGroupDetails) {
            const details = GroupData.getGroupDetails;
            // console.log(details)
            const formattedGroup = {
                ...details,
                // createdOn: details.createdAt
            };
            setGroup(formattedGroup);
            setFormData(formattedGroup);
        }
    }, [GroupData]);


    const handleUpdate = async () => {
        try {
            await UpdateGroup({
                variables: {
                    id: group.id,
                    input: {
                        groupId: groupId,
                        name: formData.name,
                        description: formData.description,
                    },
                },
            });
            toast.success("Group details updated successfully");
            setIsEditing(false);
        } catch (err) {
            toast.error("updation failed");
            // console.error("Update failed:", err);
        }
    };

    const handleCancel = () => {
        setFormData({ ...group });
        setIsEditing(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <ScaleLoader color="#0070FF" />
            </div>
        );
    }

    if (error) return <p className="text-red-500">Error fetching Group details</p>;

    return (
        <div className="bg-background-default text-default px-8">
            {/* ------------ Club Info Section ------------ */}
            <div>
                <h2 className="text-subheading-semibold text-primary mb-4 font-medium">
                    Group Details
                </h2>
                <Profile
                    image={group?.photoId || ""}
                    heading={group?.name || ""}
                    subHeading="Group Thumbnail"
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
                                onClick={() => navigate(`/group/details/${group.id}/members`)}
                            >
                                View All Members
                            </button>
                        </>
                    }
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Input
                        label="Group Name"
                        name="name"
                        icon={User}
                        placeholder="Enter Event Name"
                        required
                        type="text"
                        disabled={!isEditing}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />

                    <Input
                        label="Description"
                        name="description"
                        icon={BookOpen}
                        placeholder="Enter Description"
                        required
                        type="textarea"
                        disabled={!isEditing}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />

                    {/* <Input
                        label="Created On"
                        name="createdOn"
                        icon={Calendar}
                        required
                        type="text"
                        disabled={true}
                        value={formData.createdOn}
                        onChange={(e) => setFormData({ ...formData, createdOn: e.target.value })}
                    /> */}

                </div>

                {/* <div className="grid mt-4">

                </div> */}


                {isEditing && (
                    <div className="flex gap-4 mt-8 justify-end">
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

        </div>
    );
};

export default GroupDetails;