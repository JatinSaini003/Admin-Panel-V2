import { useLazyQuery } from "@apollo/client";
import { GET_PROFILE_PIC_UPLOAD_URL } from "../queries/getProfilePicUploadUrlQuery";

/**
 * Interface representing the expected result of the upload.
 */
interface UploadResponse {
    key: string;
    url: string;
}

/**
 * Reusable hook to upload images to a server via a signed URL.
 *
 * @returns uploadImage - Function to trigger upload
 *          data, loading, error - Apollo query states
 */
export const useUploadImage = () => {
    const [getUploadUrl, { data, loading, error }] = useLazyQuery(
        GET_PROFILE_PIC_UPLOAD_URL,
        { fetchPolicy: "no-cache" }
    );

    /**
     * Uploads a file using a signed URL from the server.
     *
     * @param file File object to upload
     * @returns Promise resolving to key and url
     */
    const uploadImage = async (file: File): Promise<UploadResponse> => {
        if (!file) {
            throw new Error("No file provided");
        }

        const fileType = file.type.split("/")[1];

        // Fetch signed URL from backend
        const result = await getUploadUrl({
            variables: { input: { fileType } },
        });

        const uploadInfo = result?.data?.getProfilePicUploadUrl;
        if (!uploadInfo) {
            throw new Error("Could not get upload URL.");
        }

        const { url, key } = uploadInfo;

        // Upload to signed URL using PUT
        const uploadResult = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": file.type,
            },
            body: file,
        });

        if (!uploadResult.ok) {
            throw new Error("Upload failed.");
        }

        return { key, url };
    };

    return {
        uploadImage,
        data,
        loading,
        error,
    };
};
