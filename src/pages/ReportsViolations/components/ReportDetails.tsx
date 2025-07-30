import React from "react";
import { useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { getReportedPostOfAStudent } from "../../../queries/reportQueries";
import ReportPost from "./ReportPost";

interface ReportedPost {
    id: string;
    title?: string;
    description?: string;
    createdAt: string;
    user: {
        id: string;
        name: string;
        avatar?: string;
        userName: string;
    };
    reason?: string;
    reportCategory?: string;
}

interface QueryData {
    getReportedPostsOfaStudent: {
        hasMore: boolean;
        posts: ReportedPost[];
    };
}

interface QueryVars {
    id: string;
}

interface ReportDetailsProps {
    studentId: string;
    onClose: () => void;
}

const ReportDetails: React.FC<ReportDetailsProps> = ({ studentId, onClose }) => {
    const { loading, error, data, refetch } = useQuery<QueryData, QueryVars>(
        getReportedPostOfAStudent,
        {
            variables: { id: studentId },
            fetchPolicy: "network-only",
            notifyOnNetworkStatusChange: true,
        }
    );

    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4">
            <div className="bg-background-default w-full max-w-6xl max-h-[90vh] overflow-auto p-8 rounded-lg space-y-8 shadow-xl">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-white text-2xl font-semibold">Reported Posts</h2>
                    <button
                        onClick={() => refetch()}
                        className="text-sm text-primary hover:underline"
                    >
                        Refresh
                    </button>
                </div>

                {/* Status states */}
                {loading && (
                    <div className="text-muted text-center py-12">Loading reported posts...</div>
                )}
                {error && (
                    <div className="text-danger text-center py-12">Error: {error.message}</div>
                )}
                {!loading && !error && data?.getReportedPostsOfaStudent.posts.length === 0 && (
                    <div className="text-muted text-center py-12">No reported posts found.</div>
                )}

                {/* Posts List */}
                {!loading && !error && data?.getReportedPostsOfaStudent.posts.map((post) => (
                    <div
                        key={post.id}
                        className="grid md:grid-cols-2 gap-6 p-4 rounded-lg bg-background-active transition cursor-pointer"
                        onClick={() => navigate(`${studentId}/post/${post.id}`)}
                    >
                        {/* Post preview */}
                        <div className="pr-4">
                            <ReportPost post={post} />
                        </div>

                        {/* Report Details */}
                        <div className="text-white space-y-4 text-sm">
                            <div>
                                <span className="text-gray-400 font-medium">Reported By:</span>
                                <p className="text-base">{post.user.name} (@{post.user.userName})</p>
                            </div>
                            <div>
                                <span className="text-gray-400 font-medium">Category:</span>
                                <p>{post.reportCategory || "—"}</p>
                            </div>
                            <div>
                                <span className="text-gray-400 font-medium">Reason:</span>
                                <p>{post.reason || "—"}</p>
                            </div>
                            <div>
                                <span className="text-gray-400 font-medium">Reported On:</span>
                                <p>
                                    {new Date(post.createdAt).toLocaleDateString(undefined, {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Close Button */}
                <div className="flex justify-end pt-4">
                    <button
                        onClick={onClose}
                        className="bg-[#f85f36] hover:bg-[#e54d26] text-white font-medium py-2 px-6 rounded-md transition duration-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportDetails;
