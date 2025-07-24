import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { useAuth } from "../../../auth/useAuth";

// Assets & Components
import Upload from "../../../assets/img/Upload.png";
import Profile from "../../../components/UI/Reusable/Profile";
import Input from "../../../components/UI/Reusable/Input";
import ConfirmationPopup from "../../../components/UI/Reusable/ConfirmationPopup";
import ImageUploadModal from "../../../components/UI/Reusable/ImageUploadModal";

// Queries & Mutations
import {
    Create_Event,
    Update_Event,
    Get_Event_Image_UploadUrl,
    GET_LOCATIONS
} from "../../../queries/eventQueries";

interface EventFormData {
    name: string;
    domain: string;
    startDateTime: string;
    endDateTime: string;
    venue: string;
    scheduleTime: string;
    mode: string;
    description: string;
    location: string;
}

function EventCreate() {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const isEditMode = location.state?.mode === "edit";
    const editData = location.state?.eventData || null;

    const [showImageModal, setShowImageModal] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [eventThumbnail, setEventThumbnail] = useState<string>(Upload);
    const [uploadedPhotoKey, setUploadedPhotoKey] = useState<string | null>(null);
    const [_, setUpdatedEditThumbnail] = useState<string | null>(null);
    const [actionType, setActionType] = useState<"create" | "update">("create");

    const [createEvent] = useMutation(Create_Event);
    const [updateEvent] = useMutation(Update_Event);
    const [getUploadUrl] = useLazyQuery(Get_Event_Image_UploadUrl, {
        fetchPolicy: "no-cache",
    });

    // Locations Data
    const { data: locationData, loading: locationLoading } = useQuery(GET_LOCATIONS, {
        variables: {
            input: {
                limit: 100,
                page: 1,
            },
        },
    });
    const locationOptions = locationData?.getLocations?.locations?.map((loc: any) => loc.name) ?? [];
    // console.log(locationOptions)

    const {
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        setValue,
        watch,
    } = useForm<EventFormData>();
    const formValues = watch();


    const uploadToS3AndPreview = async (file: File) => {
        const type = file.type.split("/")[1];
        const { data } = await getUploadUrl({ variables: { input: { fileType: type } } });
        const { url, key } = data.getEventImageUploadUrl;

        await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
        });
        setUploadedPhotoKey(key);
        // console.log(uploadedPhotoKey)

        const reader = new FileReader();
        reader.onloadend = () => {
            setUpdatedEditThumbnail(reader.result as string);
            setEventThumbnail(reader.result as string);
            toast.success("Event Thumbnail uploaded.");
        };
        reader.readAsDataURL(file);
    };

    const handleImageSave = (file: File) => {
        uploadToS3AndPreview(file).catch(() => {
            toast.error("Failed to upload image.");
        });
    };

    const onSubmit = async (formData: EventFormData) => {
        if (!isEditMode && eventThumbnail === Upload) {
            toast.error("Club thumbnail is required.");
            return;
        }

        const payload: any = {
            name: formData.name,
            domain: formData.domain,
            venue: formData.venue,
            startDateTime: new Date(formData.startDateTime).toISOString(),
            endDateTime: new Date(formData.endDateTime).toISOString(),
            scheduleTime: formData.scheduleTime,
            mode: formData.mode,
            description: formData.description,
            location: formData.location,
        };

        payload.addedBy = `${user?.firstName} ${user?.lastName}`;

        if (uploadedPhotoKey) {
            payload.imageId = uploadedPhotoKey;
        }

        try {
            if (isEditMode) {
                await updateEvent({
                    variables: { input: { ...payload, id: editData.id } },
                });
                toast.success("Event Updated Successfully");
                setActionType("update");
            } else {
                console.log("Payload being sent to server:", payload);
                await createEvent({ variables: { input: payload } });
                toast.success("Club Created Successfully");
                setActionType("create");
            }

            setUploadedPhotoKey(null);
            reset();
            setShowConfirmation(true);
        } catch (e: any) {
            toast.error(`${isEditMode ? "Update" : "Creation"} failed. ${e.message}`);
            console.log(e.message)
        }
    };

    return (
        <div className="bg-background-default text-default px-8">
            <h2 className="text-primary text-subheading-semibold mb-4">Event Details</h2>

            {/* Profile Thumbnail */}
            <Profile
                image={eventThumbnail}
                heading="Event Thumbnail"
                subHeading="PNG, JPG under 512 KB"
                actionButtons={
                    <>
                        <button
                            className="px-4 py-3 bg-transparent border border-primary text-primary text-sm rounded hover:bg-primary hover:text-default"
                            onClick={() => setShowImageModal(true)}
                        >
                            Upload Photo
                        </button>
                        <button
                            className="px-4 py-3 bg-transparent text-red-500 border border-red-500 text-sm rounded hover:bg-red-600 hover:text-default"
                            onClick={() => {
                                setEventThumbnail(Upload);
                                setUploadedPhotoKey(null);
                            }}
                        >
                            Remove Photo
                        </button>
                    </>
                }
            />

            {/* Image Upload Modal */}
            {showImageModal && (
                <ImageUploadModal
                    uploadType="club"
                    onClose={() => setShowImageModal(false)}
                    onImageSave={handleImageSave}
                />
            )}

            {/* Event Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <Input
                        label="Event Name"
                        name="name"
                        placeholder="Enter Event Name"
                        required
                        type="text"
                        value={formValues.name}
                        onChange={(e) => setValue("name", e.target.value)}
                        error={!!errors.name}
                        helperText={errors.name?.message as string}
                    />

                    <Input
                        label="Domain"
                        name="domain"
                        placeholder="Select Category"
                        required
                        type="text"
                        value={formValues.domain}
                        onChange={(e) => {
                            setValue("domain", e.target.value);
                        }}
                        error={!!errors.domain}
                        helperText={errors.domain?.message as string}
                    />

                    <Input
                        label="Venue"
                        name="venue"
                        placeholder="Enter Venue"
                        required
                        type="text"
                        value={formValues.venue}
                        onChange={(e) => setValue("venue", e.target.value)}
                        error={!!errors.venue}
                        helperText={errors.venue?.message as string}
                    />

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5">
                    <Input
                        label="Event Start Date"
                        name="startDateTime"
                        placeholder="Enter Event start Date"
                        required
                        type="date"
                        value={formValues.startDateTime}
                        onChange={(e) => setValue("startDateTime", e.target.value)}
                        error={!!errors.startDateTime}
                        helperText={errors.startDateTime?.message as string}
                    />

                    <Input
                        label="Event End Date (Optional)"
                        name="endDateTime"
                        placeholder="Enter Event End Date"
                        // required
                        type="date"
                        value={formValues.endDateTime || ""}
                        onChange={(e) => setValue("endDateTime", e.target.value)}
                        error={!!errors.endDateTime}
                        helperText={errors.endDateTime?.message as string}
                    />

                    <Input
                        label="Timing"
                        name="scheduleTime"
                        placeholder="Enter Timing"
                        required
                        type="time"
                        value={formValues.scheduleTime}
                        onChange={(e) => {
                            setValue("scheduleTime", e.target.value);
                        }}
                        error={!!errors.scheduleTime}
                        helperText={errors.scheduleTime?.message as string}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
                    <Input
                        label="Mode"
                        name="mode"
                        placeholder="Enter Mode"
                        required
                        type="dropdown"
                        value={formValues.mode}
                        onChange={(e) => setValue("mode", e.target.value)}
                        error={!!errors.mode}
                        helperText={errors.mode?.message as string}
                        MenuOptions={["CAMPUS", "VIRTUAL"]}
                    />

                    <Input
                        label="Location (Optional)"
                        name="location"
                        placeholder="Enter Location"
                        // required
                        type="dropdown"
                        value={formValues.location || ""}
                        onChange={(e) => {
                            setValue("location", e.target.value);
                        }}
                        error={!!errors.location}
                        helperText={errors.location?.message as string}
                        MenuOptions={locationLoading ? ["Loading..."] : locationOptions}
                    />
                </div>

                <div className="grid mt-4">
                    <Input
                        label="Description"
                        name="description"
                        placeholder="Enter Description"
                        required
                        type="textarea"
                        value={formValues.description}
                        onChange={(e) => setValue("description", e.target.value)}
                        error={!!errors.description}
                        helperText={errors.description?.message as string}
                    />
                </div>

                <div className="flex justify-end mt-5">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-2.5 bg-primary text-white rounded-md hover:bg-primary-dark font-Gilroy-Medium transition"
                    >
                        {isSubmitting
                            ? "Creating ..."
                            : isEditMode
                                ? "Update Event"
                                : "Create Event"}
                    </button>
                </div>
            </form>

            {/* Confirmation Popup */}
            {showConfirmation && (
                <ConfirmationPopup
                    isOpen={showConfirmation}
                    message={`Club ${actionType === "update" ? "Updated" : "Created"}`}
                    confirmLabel="View All Events"
                    cancelLabel="Stay"
                    onConfirm={() => navigate("/events")}
                    onCancel={() => setShowConfirmation(false)}
                />
            )}
        </div>
    );
}

export default EventCreate;
