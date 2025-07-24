import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";

// Assets & Components
import Upload from "../../../assets/img/Upload.png";
import Profile from "../../../components/UI/Reusable/Profile";
import Input from "../../../components/UI/Reusable/Input";
import ConfirmationPopup from "../../../components/UI/Reusable/ConfirmationPopup";
import ImageUploadModal from "../../../components/UI/Reusable/ImageUploadModal";

// Queries & Mutations
import {
    Get_Club_Categories,
    CREATE_CLUB,
    Update_Club,
    Get_Club_ImageUploadUrl,
} from "../../../queries/clubQueries";

interface ClubFormData {
    name: string;
    description: string;
    category: string;
}

interface ClubCategory {
    slug: string;
    category: string;
}

function ClubCreate() {
    const location = useLocation();
    const navigate = useNavigate();
    const isEditMode = location.state?.mode === "edit";
    const editData = location.state?.clubData || null;

    const [showImageModal, setShowImageModal] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [ClubThumbnail, setClubThumbnail] = useState<string>(Upload);
    const [categoryOptions, setCategoryOptions] = useState<ClubCategory[]>([]);
    const [uploadedPhotoKey, setUploadedPhotoKey] = useState<string | null>(null);
    const [_, setUpdatedEditThumbnail] = useState<string | null>(null);
    const [actionType, setActionType] = useState<"create" | "update">("create");

    const { data: categoriesData } = useQuery(Get_Club_Categories);
    const [createClub] = useMutation(CREATE_CLUB);
    const [updateClub] = useMutation(Update_Club);
    const [getUploadUrl] = useLazyQuery(Get_Club_ImageUploadUrl, {
        fetchPolicy: "no-cache",
    });

    const {
        // register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        setValue,
        watch,
    } = useForm<ClubFormData>();
    const formValues = watch();

    useEffect(() => {
        if (categoriesData?.getClubCategories?.categories) {
            setCategoryOptions(categoriesData.getClubCategories.categories);
        }
    }, [categoriesData]);

    useEffect(() => {
        if (isEditMode && editData) {
            setClubThumbnail(editData.imageUrl);
            setUploadedPhotoKey(null);
            setUpdatedEditThumbnail(null);
            reset({
                name: editData.name,
                description: editData.description,
                category: editData.slug,
            });
        }
    }, [isEditMode, editData, reset]);

    const uploadToS3AndPreview = async (file: File) => {
        const type = file.type.split("/")[1];
        const { data } = await getUploadUrl({ variables: { input: { fileType: type } } });
        const { url, key } = data.getClubImageUploadUrl;

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
            setClubThumbnail(reader.result as string);
            toast.success("Club Thumbnail uploaded.");
        };
        reader.readAsDataURL(file);
    };

    const handleImageSave = (file: File) => {
        uploadToS3AndPreview(file).catch(() => {
            toast.error("Failed to upload image.");
        });
    };

    const onSubmit = async (formData: ClubFormData) => {
        if (!isEditMode && ClubThumbnail === Upload) {
            toast.error("Club thumbnail is required.");
            return;
        }

        const categoryOption = categoryOptions.find((c) => c.slug === formData.category);
        if (!categoryOption) {
            toast.error("Invalid category.");
            return;
        }

        const payload: any = {
            name: formData.name,
            description: formData.description,
            category: categoryOption.category,
        };

        if (uploadedPhotoKey) {
            payload.imageUrl = uploadedPhotoKey;
        }

        try {
            if (isEditMode) {
                await updateClub({
                    variables: { input: { ...payload, id: editData.id } },
                });
                toast.success("Club Updated Successfully");
                setActionType("update");
            } else {
                // console.log("Payload being sent to server:", payload);
                await createClub({ variables: { input: payload } });
                toast.success("Club Created Successfully");
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
        <div className="bg-background-default text-default px-8 py-6">
            <h2 className="text-primary text-subheading-semibold mb-4">Clubs Details</h2>

            {/* Profile Thumbnail */}
            <Profile
                image={ClubThumbnail}
                heading="Club Thumbnail"
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
                                setClubThumbnail(Upload);
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

            {/* Club Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Input
                        label="Club Name"
                        name="name"
                        placeholder="Enter Club Name"
                        required
                        type="text"
                        value={formValues.name}
                        onChange={(e) => setValue("name", e.target.value)}
                        error={!!errors.name}
                        helperText={errors.name?.message as string}
                    />

                    <Input
                        label="Category"
                        name="category"
                        placeholder="Select Category"
                        required
                        type="dropdown"
                        value={formValues.category}
                        onChange={(e) => {
                            setValue("category", e.target.value);
                        }}
                        error={!!errors.category}
                        helperText={errors.category?.message as string}
                        MenuOptions={categoryOptions.map((c) => c.slug)}
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
                        {isEditMode ? "Update Club" : "Create Club"}
                    </button>
                </div>
            </form>

            {/* Confirmation Popup */}
            {showConfirmation && (
                <ConfirmationPopup
                    isOpen={showConfirmation}
                    message={`Club ${actionType === "update" ? "Updated" : "Created"}`}
                    confirmLabel="View All Clubs"
                    cancelLabel="Stay"
                    onConfirm={() => navigate("/clubs")}
                    onCancel={() => setShowConfirmation(false)}
                />
            )}
        </div>
    );
}

export default ClubCreate;
