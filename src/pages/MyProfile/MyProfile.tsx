import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/client";
import { UPDATE_ADMIN_PROFILE, Remove_Admin_ProfilePic } from "../../queries/adminQueries";
import { useUploadImage } from "../../hooks/useUploadImage";
import { useAuth } from "../../auth/useAuth";

// Components
import { Input, Profile, ConfirmationPopup } from "../../components/UI/Reusable";
import ImageUploadModal from "../../components/UI/Reusable/ImageUploadModal";

// Image
import Upload from "../../assets/img/Upload.png";

// Icons
import { User, Mail, Phone } from "lucide-react";

const MyProfile = () => {
    const { user, refetchProfile } = useAuth();
    const navigate = useNavigate();

    const { uploadImage } = useUploadImage();
    const [updateAdminProfile] = useMutation(UPDATE_ADMIN_PROFILE);
    const [removeAdminProfilePic] = useMutation(Remove_Admin_ProfilePic);

    // UI States
    const [editMode, setEditMode] = useState(false);
    const [profileImage, setProfileImage] = useState(user?.profilePicId || Upload);
    const [showPassword, setShowPassword] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const [showImageModal, setShowImageModal] = useState(false);
    const [uploadedPhotoKey, setUploadedPhotoKey] = useState<string | null>(null);
    const [imageMarkedForRemoval, setImageMarkedForRemoval] = useState(false);

    const {
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            newPassword: ""
        }
    });

    const formValues = watch();

    // Prefill form
    useEffect(() => {
        if (user) {
            const defaultValues = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phoneNumber,
                newPassword: ""
            };
            setProfileImage(user?.profilePicId || Upload);
            reset(defaultValues);
        }
    }, [user, reset]);

    // Remove Image Handler
    const handleRemoveImage = () => {
        setProfileImage(Upload);
        setUploadedPhotoKey(null);
        setImageMarkedForRemoval(true);
    };

    // Submit Handler
    const onSubmit = async (formData: any) => {
        try {
            let profilePicId: string | undefined = user?.profilePicId;
            let shouldUpdateImage = false;

            // CASE 1: New image uploaded
            if (uploadedPhotoKey) {
                profilePicId = uploadedPhotoKey;
                shouldUpdateImage = true;
            }

            // CASE 2: Image removed
            if (imageMarkedForRemoval) {
                await removeAdminProfilePic();
                profilePicId = undefined;
                shouldUpdateImage = true;
            }

            const updatedData: Record<string, any> = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: formData.phone,
            };

            if (shouldUpdateImage) {
                updatedData.profilePicId = profilePicId;
            }

            if (formData.newPassword) {
                updatedData.password = formData.newPassword;
            }

            const { data } = await updateAdminProfile({
                variables: { input: updatedData }
            });

            const updatedUser = data?.updateAdminProfile?.user;
            if (updatedUser) {
                toast.success("Profile updated successfully!");
                setShowPopup(true);
                setEditMode(false);
                setImageMarkedForRemoval(false);
                setUploadedPhotoKey(null);
                await refetchProfile();
            } else {
                toast.error(data?.updateAdminProfile?.message || "Update failed.");
            }
        } catch {
            toast.error("Update failed. Try again later.");
        }
    };

    return (
        <div className="bg-background-default text-default px-8">
            <div>
                <h2 className="text-subheading-semibold text-primary mb-4">Personal Details</h2>

                {/* Profile Section */}
                <div className="mb-5">
                    <Profile
                        image={profileImage}
                        heading={`${user?.firstName} ${user?.lastName}`}
                        subHeading="PNG, JPG under 5 MB"
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
                                    onClick={handleRemoveImage}
                                >
                                    Remove Photo
                                </button>
                            </>
                        }
                    />
                </div>

                {/* Image Upload Modal */}
                {showImageModal && (
                    <ImageUploadModal
                        uploadType="profile"
                        onClose={() => setShowImageModal(false)}
                        onImageSave={async (file: File) => {
                            try {
                                const { key } = await uploadImage(file);
                                setUploadedPhotoKey(key);

                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    setProfileImage(reader.result as string);
                                };
                                reader.readAsDataURL(file);

                                toast.success("Profile photo uploaded.");
                                setImageMarkedForRemoval(false);
                            } catch {
                                toast.error("Failed to upload profile image.");
                            } finally {
                                setShowImageModal(false);
                            }
                        }}
                    />
                )}

                {/* Profile Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Input
                            label="First Name"
                            name="First Name"
                            placeholder="Enter First Name"
                            icon={User}
                            disabled={!editMode}
                            value={formValues.firstName}
                            onChange={(e) => setValue("firstName", e.target.value)}
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message as string}
                        />
                        <Input
                            label="Last Name"
                            name="Last Name"
                            placeholder="Enter Last Name"
                            icon={User}
                            disabled={!editMode}
                            value={formValues.lastName}
                            onChange={(e) => setValue("lastName", e.target.value)}
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message as string}
                        />
                        <Input
                            label="Email ID"
                            name="Email ID"
                            placeholder="Enter Email"
                            icon={Mail}
                            disabled
                            value={formValues.email}
                        />
                        <Input
                            label="Phone Number"
                            name="Phone Number"
                            placeholder="Enter Phone Number"
                            icon={Phone}
                            disabled={!editMode}
                            value={formValues.phone}
                            onChange={(e) => setValue("phone", e.target.value)}
                            error={!!errors.phone}
                            helperText={errors.phone?.message as string}
                        />
                    </div>

                    <hr className="border-border-muted my-8" />

                    {/* Password Section */}
                    <div>
                        <h2 className="text-subheading-semibold text-primary mb-1.5">
                            Passwords & Security
                        </h2>
                        <p className="text-muted mb-6">Update your password securely.</p>

                        <div className="grid grid-cols-1 lg:grid-cols-1 mb-4">
                            <Input
                                label="New Password"
                                name="New Password"
                                placeholder="Enter New Password"
                                type="password"
                                showPassword={showPassword}
                                onTogglePasswordVisibility={() =>
                                    !editMode ? null : setShowPassword((p) => !p)
                                }
                                disabled={!editMode}
                                value={formValues.newPassword}
                                onChange={(e) => setValue("newPassword", e.target.value)}
                                error={!!errors.newPassword}
                                helperText={errors.newPassword?.message as string}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 mt-6">
                            {!editMode ? (
                                <button
                                    type="button"
                                    onClick={() => setEditMode(true)}
                                    className="bg-primary text-white px-6 py-2 rounded-md text-sm hover:bg-primary-dark transition"
                                >
                                    Edit Profile
                                </button>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setEditMode(false)}
                                        disabled={isSubmitting}
                                        className="bg-background-active text-white px-6 py-2 rounded-md text-sm hover:bg-gray-600 transition disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-primary text-white px-6 py-2 rounded-md text-sm hover:bg-primary-dark transition disabled:opacity-50"
                                    >
                                        Update
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </form>
            </div>

            {/* Confirmation Popup */}
            <ConfirmationPopup
                isOpen={showPopup}
                message="Your profile has been updated successfully!"
                confirmLabel="Go to Dashboard"
                onConfirm={() => {
                    setShowPopup(false);
                    navigate("/");
                }}
                onCancel={() => setShowPopup(false)}
            />
        </div>
    );
};

export default MyProfile;
