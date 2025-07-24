import React, { useState } from "react";
import Camera from "../../../assets/img/Camera.png";
import { Cross } from "lucide-react";

type UploadType = "profile" | "club" | "group" | "event";

interface ImageUploadModalProps {
    uploadType: UploadType;
    onClose: () => void;
    onImageSave: (file: File) => void;
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
    // uploadType,
    onClose,
    onImageSave,
}) => {
    const [tempImagePreview, setTempImagePreview] = useState<string | null>(null);
    const [tempImageFile, setTempImageFile] = useState<File | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!allowedTypes.includes(file.type)) {
            setErrorMsg("Only JPG, PNG, or JPEG formats are allowed.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setErrorMsg("File size should be under 5MB.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setTempImagePreview(reader.result as string);
            setTempImageFile(file);
            setErrorMsg(null);
        };
        reader.readAsDataURL(file);
    };

    const handleSaveImage = () => {
        if (tempImageFile) {
            onImageSave(tempImageFile);
            handleCloseModal();
        }
    };

    const handleCloseModal = () => {
        setTempImagePreview(null);
        setTempImageFile(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center">
            {/* Close Icon */}
            <Cross size={20} className="absolute top-[14rem] left-[52rem] h-5 w-5 rotate-45 cursor-pointer" onClick={handleCloseModal} />

            <div className="border-4 border-[#F3642A] w-[360px] min-h-[220px] flex flex-col justify-center items-center bg-[#2C3B44] rounded-md shadow-lg p-6 gap-4">
                {!tempImagePreview ? (
                    <>
                        {/* Default Upload Box */}
                        <div className="rounded-full border border-[#BEBAB9] h-[90px] w-[90px] flex justify-center items-center overflow-hidden">
                            <img
                                src={Camera}
                                alt="Upload"
                                className="h-full w-full object-cover"
                            />
                        </div>

                        <label
                            htmlFor="image-upload"
                            className="px-4 py-2 border border-white text-white hover:bg-white hover:text-[#2C3B44] rounded-md transition duration-200 font-medium cursor-pointer"
                        >
                            Upload Photo
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            id="image-upload"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        {errorMsg && (
                            <p className="text-red-400 text-sm mt-1">{errorMsg}</p>
                        )}
                    </>
                ) : (
                    <>
                        {/* Preview Box */}
                        <img
                            src={tempImagePreview}
                            alt="Preview"
                            className="w-24 h-24 rounded-full object-cover border-2 border-white"
                        />

                        <div className="flex gap-3 mt-2">
                            <button
                                onClick={handleSaveImage}
                                className="bg-primary text-white px-4 py-1.5 rounded hover:bg-primary-dark text-sm"
                            >
                                Save Image
                            </button>
                            <button
                                onClick={() => {
                                    setTempImagePreview(null);
                                    setTempImageFile(null);
                                }}
                                className="text-white border border-white px-4 py-1.5 rounded hover:bg-white hover:text-[#2C3B44] text-sm"
                            >
                                Choose Another
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ImageUploadModal;
