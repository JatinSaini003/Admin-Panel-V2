import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery, useMutation } from "@apollo/client";

// Queries
import { Get_EventDetails, Update_Event } from "../../../queries/eventQueries";

// Components
import {
    Input,
    Profile,
} from "../../../components/UI/Reusable/index";

// Loaders
import { ScaleLoader } from "react-spinners";

// Icons
import { BookOpen, User, BookOpenCheck, MapPinHouse, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";

const EventDetails = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState<any>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<any>({});

    const [UpdateEvent, { loading: isUpdating }] = useMutation(Update_Event);

    // ------------------ Event Details ------------------
    const { data: eventData, loading, error } = useQuery(Get_EventDetails, {
        variables: { id: eventId },
    });

    useEffect(() => {
        if (eventData?.getEventDetails) {
            const details = eventData.getEventDetails;
            const formattedEvent = {
                ...details,
                startDateTime: details.startDateTime ? details.startDateTime.split("T")[0] || "" : "",
                endDateTime: details.endDateTime ? details.endDateTime.split("T")[0] || "" : "",
            };
            setEvent(formattedEvent);
            setFormData(formattedEvent);
        }
    }, [eventData]);


    const handleUpdate = async () => {
        try {
            await UpdateEvent({
                variables: {
                    id: event.id,
                    input: {
                        id: eventId,
                        name: formData.name,
                        domain: formData.domain,
                        venue: formData.venue,
                        startDateTime: new Date(formData.startDateTime).toISOString(),
                        endDateTime: formData.endDateTime ? new Date(formData.endDateTime).toISOString() : "",
                        scheduleTime: formData.scheduleTime,
                        mode: formData.mode,
                        description: formData.description,
                        location: formData.location,
                    },
                },
            });
            toast.success("Event details updated successfully");
            setIsEditing(false);
        } catch (err) {
            toast.error("updation failed");
            // console.error("Update failed:", err);
        }
    };

    const handleCancel = () => {
        setFormData({ ...event });
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
                    Event Details
                </h2>
                <Profile
                    image={event?.imageId || ""}
                    heading={event?.name || ""}
                    subHeading="Event Thumbnail"
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
                                onClick={() => navigate(`/event/details/${event.id}/members`)}
                            >
                                View All Members
                            </button>
                        </>
                    }
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <Input
                        label="Event Name"
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
                        label="Domain"
                        name="domain"
                        icon={BookOpenCheck}
                        placeholder="Select Category"
                        required
                        type="text"
                        disabled={!isEditing}
                        value={formData.domain}
                        onChange={(e) => {
                            setFormData({ ...formData, domain: e.target.value });
                        }}
                    />

                    <Input
                        label="Venue"
                        name="venue"
                        icon={MapPinHouse}
                        placeholder="Enter Venue"
                        required
                        type="text"
                        disabled={!isEditing}
                        value={formData.venue}
                        onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5">
                    <Input
                        label="Event Start Date"
                        name="startDateTime"
                        placeholder="Enter Event start Date"
                        required
                        type="date"
                        disabled={!isEditing}
                        value={formData.startDateTime}
                        onChange={(e) => setFormData({ ...formData, startDateTim: e.target.value })}
                    />

                    <Input
                        label="Event End Date (Optional)"
                        name="endDateTime"
                        placeholder="Enter Event End Date"
                        // required
                        type="date"
                        disabled={!isEditing}
                        value={formData.endDateTime || ""}
                        onChange={(e) => setFormData({ ...formData, endDateTime: e.target.value })}
                    />

                    <Input
                        label="Timing"
                        name="scheduleTime"
                        placeholder="Enter Timing"
                        required
                        type="time"
                        disabled={!isEditing}
                        value={formData.scheduleTime}
                        onChange={(e) => {
                            setFormData({ ...formData, scheduleTime: e.target.value });
                        }}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
                    <Input
                        label="Mode"
                        name="mode"
                        icon={ChevronDown}
                        placeholder="Enter Mode"
                        required
                        type="dropdown"
                        disabled={!isEditing}
                        value={formData.mode}
                        onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                        MenuOptions={["CAMPUS", "VIRTUAL"]}
                    />

                    <Input
                        label="Location (Optional)"
                        name="location"
                        icon={ChevronDown}
                        placeholder="Enter Location"
                        // required
                        type="dropdown"
                        disabled={!isEditing}
                        value={formData.location || ""}
                        onChange={(e) => {
                            setFormData({ ...formData, location: e.target.value });
                        }}
                    // MenuOptions={locationLoading ? ["Loading..."] : locationOptions}
                    />
                </div>

                <div className="grid mt-4">
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
                </div>


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

export default EventDetails;