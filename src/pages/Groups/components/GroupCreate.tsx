import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client";

// Assets & Components
import Upload from "../../../assets/img/Upload.png";
import Profile from "../../../components/UI/Reusable/Profile";
import Input from "../../../components/UI/Reusable/Input";
import ConfirmationPopup from "../../../components/UI/Reusable/ConfirmationPopup";
import ImageUploadModal from "../../../components/UI/Reusable/ImageUploadModal";

// Queries & Mutations
import {
    CREATE_GROUP,
    Update_Group,
    Get_Group_ImageUploadUrl
} from "../../../queries/groupQueries";


interface GroupFormData {
    name: string;
    description: string;
    createdOn: string;
}

function GroupCreate() {
    const location = useLocation();
    const navigate = useNavigate();
    const isEditMode = location.state?.mode === "edit";
    const editData = location.state?.clubData || null;
    const selectedMemberIds: string[] = location.state?.selectedMemberIds || [];

    const [showImageModal, setShowImageModal] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [groupThumbnail, setGroupThumbnail] = useState<string>(Upload);
    const [uploadedPhotoKey, setUploadedPhotoKey] = useState<string | null>(null);
    const [actionType, setActionType] = useState<"create" | "update">("create");

    const [createGroup] = useMutation(CREATE_GROUP);
    const [updateGroup] = useMutation(Update_Group);
    const [getUploadUrl] = useLazyQuery(Get_Group_ImageUploadUrl, {
        fetchPolicy: "no-cache",
    });

    const {
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        setValue,
        watch,
    } = useForm<GroupFormData>();
    const formValues = watch();

    useEffect(() => {
        if (isEditMode && editData) {
            setGroupThumbnail(editData.photoId || Upload);
            setUploadedPhotoKey(null);
            reset({
                name: editData.name,
                description: editData.description,
            });
        }
    }, [isEditMode, editData, reset]);

    const uploadToS3AndPreview = async (file: File) => {
        const type = file.type.split("/")[1];
        const { data } = await getUploadUrl({ variables: { input: { fileType: type } } });
        const { url, key } = data.getGroupImageUploadUrl;

        await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
        });
        setUploadedPhotoKey(key);
        // console.log(uploadedPhotoKey)

        const reader = new FileReader();
        reader.onloadend = () => {
            setGroupThumbnail(reader.result as string);
            toast.success("Club Thumbnail uploaded.");
        };
        reader.readAsDataURL(file);
    };


    const handleImageSave = async (file: File) => {
        uploadToS3AndPreview(file).catch(() => {
            toast.error("Failed to upload image.");
        });
    };

    const onSubmit = async (formData: GroupFormData) => {
        if (!isEditMode && groupThumbnail === Upload) {
            toast.error("Group thumbnail is required.");
            return;
        }

        const payload: any = {
            name: formData.name,
            description: formData.description,
        };

        if (selectedMemberIds.length > 0) {
            payload.userIds = selectedMemberIds;
        }

        if (uploadedPhotoKey) {
            payload.photoId = uploadedPhotoKey;
        }

        try {
            if (isEditMode) {
                await updateGroup({
                    variables: { input: { ...payload, id: editData.id } },
                });
                toast.success("Group Updated Successfully");
                setActionType("update");
            } else {
                console.log("payload data : ", payload)
                await createGroup({ variables: { input: payload } });
                toast.success("Group Created Successfully");
                setActionType("create");
            }

            setUploadedPhotoKey(null);
            reset();
            setShowConfirmation(true);
        } catch (e: any) {
            toast.error(`${isEditMode ? "Update" : "Creation"} failed. ${e.message}`);
        }
    };

    return (
        <div className="bg-background-default text-default px-8">
            <h2 className="text-primary text-subheading-semibold mb-4">Group Details</h2>

            <Profile
                image={groupThumbnail}
                heading="Group Thumbnail"
                subHeading="PNG, JPG under 512 KB"
                actionButtons={
                    <>
                        <button
                            className="px-4 py-3 border border-primary text-primary rounded hover:bg-primary hover:text-white"
                            onClick={() => setShowImageModal(true)}
                        >
                            Upload Photo
                        </button>
                        <button
                            className="px-4 py-3 text-red-500 border border-red-500 rounded hover:bg-red-600 hover:text-white"
                            onClick={() => {
                                setGroupThumbnail(Upload);
                                setUploadedPhotoKey(null);
                            }}
                        >
                            Remove Photo
                        </button>
                    </>
                }
            />

            {showImageModal && (
                <ImageUploadModal
                    uploadType="group"
                    onClose={() => setShowImageModal(false)}
                    onImageSave={handleImageSave}
                />
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Input
                        label="Group Name"
                        name="name"
                        placeholder="Enter Group Name"
                        required
                        type="text"
                        value={formValues.name}
                        onChange={(e) => setValue("name", e.target.value)}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />

                    <Input
                        label="Description"
                        name="description"
                        placeholder="Enter Description"
                        required
                        type="textarea"
                        value={formValues.description}
                        onChange={(e) => setValue("description", e.target.value)}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                    />
                </div>

                <div className="flex justify-between mt-10">
                    <button
                        onClick={() =>
                            navigate("/group/create/add-members", {
                                state: { selectedMemberIds },
                            })
                        }
                        type="button"
                        className="px-8 py-2.5 border border-primary text-primary rounded-md hover:bg-primary hover:text-white"
                    >
                        + Add Members
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-2.5 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
                    >
                        {isEditMode ? "Update Group" : "Create Group"}
                    </button>
                </div>
            </form>

            {selectedMemberIds.length > 0 && (
                <p className="text-sm text-green-500 mt-3">
                    {selectedMemberIds.length} member{selectedMemberIds.length !== 1 && "s"} selected
                </p>
            )}

            {showConfirmation && (
                <ConfirmationPopup
                    isOpen={showConfirmation}
                    message={`Group ${actionType === "update" ? "Updated" : "Created"}`}
                    confirmLabel="View All Groups"
                    cancelLabel="Stay"
                    onConfirm={() => navigate("/groups")}
                    onCancel={() => setShowConfirmation(false)}
                />
            )}
        </div>
    );
}

export default GroupCreate;
