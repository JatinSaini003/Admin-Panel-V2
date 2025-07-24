import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Get_Verification_Requests, HANDLE_VERIFICATION_REQUEST } from "../../queries/verificationQueries";
import Lottie from "lottie-react";
import Hammer from "../../assets/Loader/Hammer.json";
import { useGlobalSearch } from "../../search/SearchContext";


type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED";

interface User {
    name: string;
    userName: string;
}

interface VerificationRequest {
    id: string;
    userId: string;
    user: User;
    documentType: string;
    documentId: string;
    status: VerificationStatus;
}


/**
 * Component: PendingVerification
 * Displays a table of all pending student verification requests.
 * Allows admin to verify or reject users based on document uploads.
 */
const PendingVerification: React.FC = () => {
    const { searchQuery } = useGlobalSearch();
    const [students, setStudents] = useState<VerificationRequest[]>([]);

    const { data, loading, error, refetch } = useQuery(Get_Verification_Requests, {
        variables: { limit: 50, page: 1, searchQuery },
        fetchPolicy: "network-only",
    });

    const [handleRequest] = useMutation(HANDLE_VERIFICATION_REQUEST, {
        refetchQueries: [
            { query: Get_Verification_Requests, variables: { limit: 50, page: 1, searchQuery } },
        ],
        awaitRefetchQueries: true,
    });

    useEffect(() => {
        if (data?.getVerificationRequests?.requests) {
            setStudents(data.getVerificationRequests.requests);
        }
    }, [data]);

    const handleAction = (id: string, status: VerificationStatus) => {
        handleRequest({
            variables: {
                input: { id, status },
            },
        });
        refetch();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Lottie animationData={Hammer} loop />
            </div>
        );
    }

    if (error) {
        return (
            <p className="text-red-500 p-8 font-medium">
                Error fetching data. Please try again later.
            </p>
        );
    }

    return (
        <div className="bg-background-default text-default px-8">
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-primary font-Gilroy-SemiBold text-[17px]">
                        All Pending Verifications
                    </h2>
                </div>

                {/* Table */}
                <div className="overflow-y-auto scrollbar-hide">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white">
                                {["Full Name", "Username", "Documents Uploaded", "Actions"].map(
                                    (heading, index) => (
                                        <th
                                            key={heading}
                                            className={`p-4 text-left font-Gilroy-SemiBold text-white text-[16px] ${index % 2 === 0 ? "bg-primary" : "bg-primary/95"
                                                }`}
                                        >
                                            {heading}
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr
                                    key={student.id}
                                    className="border-b border-white transition-colors"
                                >
                                    <td className="p-3 pl-5 bg-[#142D3C] font-Gilroy-Regular text-[14px]">
                                        {student.user?.name}
                                    </td>
                                    <td className="p-3 pl-5 font-Gilroy-Regular text-[14px]">
                                        {student.user?.userName}
                                    </td>
                                    <td className="p-3 pl-5 bg-[#142D3C] font-Gilroy-Regular text-[14px]">
                                        <div className="flex justify-between items-center">
                                            <span className="underline">
                                                {student.documentType}
                                            </span>
                                            <a
                                                href={student.documentId}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="underline text-[#0070FF]"
                                            >
                                                View
                                            </a>
                                        </div>
                                    </td>
                                    <td className="p-3 pl-5 font-Gilroy-Regular text-[14px]">
                                        {student.status === "PENDING" ? (
                                            <div className="flex justify-between">
                                                <button
                                                    onClick={() => handleAction(student.id, "APPROVED")}
                                                    className="text-green-400 underline cursor-pointer"
                                                >
                                                    Verify
                                                </button>
                                                <button
                                                    onClick={() => handleAction(student.id, "REJECTED")}
                                                    className="text-[#FF4D4D] underline cursor-pointer"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between">
                                                <span
                                                    className={
                                                        student.status === "APPROVED"
                                                            ? "text-green-400"
                                                            : "text-danger"
                                                    }
                                                >
                                                    {student.status === "APPROVED"
                                                        ? "Verified"
                                                        : "Rejected"}
                                                </span>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PendingVerification;
