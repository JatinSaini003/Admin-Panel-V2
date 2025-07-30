import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import {
    getReportedPostOfAStudent,
    getPostReports,
    DeleteReportedPost,
    getReportingUsers,
} from "../../../queries/reportQueries";
import ReportPost from "./ReportPost";
import { toast } from "react-toastify";
import { ConfirmationPopup } from "../../../components/UI/Reusable";

// ============================
// Types
// ============================

interface PostType {
    id: string;
    createdAt: string;
    description?: string;
    title?: string;
    images?: string[];
    totalLikes?: number;
    totalComments?: number;
    totalReposts?: number;
    user: {
        id: string;
        name: string;
        avatar?: string;
        userName: string;
    };
}

interface Report {
    id: string;
    postId: string;
    reason: string;
    reportCategory: string;
    reportId: string;
    userId: string;
}

interface PostsData {
    getReportedPostsOfaStudent: {
        posts: PostType[];
    };
}

interface PostsVars {
    id: string;
}

interface ReportsData {
    getPostReports: {
        reports: Report[];
    };
}

interface ReportsVars {
    postId: string;
    limit?: number;
    page?: number;
}

// ============================
// Component
// ============================

const ReportActions: React.FC = () => {
    const { studentId, postId } = useParams<{ studentId: string; postId: string }>();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const navigate = useNavigate();

    // ============================
    // GraphQL Queries
    // ============================

    const { data: postsData, loading: postLoading, error: postError } = useQuery<PostsData, PostsVars>(
        getReportedPostOfAStudent,
        {
            variables: { id: studentId! },
            fetchPolicy: "network-only",
        }
    );

    const { data: reportsData, loading: reportLoading, error: reportError } = useQuery<ReportsData, ReportsVars>(
        getPostReports,
        {
            variables: { postId: postId!, limit: 10, page: 1 },
            fetchPolicy: "network-only",
        }
    );

    const [deletePost, { loading: delLoading }] = useMutation(DeleteReportedPost, {
        variables: { id: postId },
        refetchQueries: [
            { query: getPostReports, variables: { postId: postId! } },
            { query: getReportedPostOfAStudent, variables: { id: studentId! } },
            { query: getReportingUsers }
        ],
    });

    // ============================
    // Handler: Delete Post
    // ============================

    const handleDelete = async () => {
        try {
            await deletePost();
            toast.success("Post deleted successfully.");
            setIsConfirmOpen(false);
        } catch (err) {
            console.log(err)
            toast.error("Failed to delete post.");
            navigate(-1);
        }
    };

    // ============================
    // Render Logic
    // ============================

    if (postLoading || reportLoading)
        return <div className="p-8 text-center text-white">Loading...</div>;

    if (postError || reportError)
        return <div className="p-8 text-center text-red-500">Error loading data.</div>;

    const post = postsData?.getReportedPostsOfaStudent.posts.find((p) => p.id === postId);
    const reports = reportsData?.getPostReports.reports || [];

    if (!post)
        return <div className="p-8 text-center text-gray-400">No reported post found.</div>;

    // ============================
    // JSX
    // ============================

    return (
        <div className="min-h-screen bg-background-default text-default px-8">
            <div className="flex flex-col md:flex-row gap-6">

                {/* === Left Panel: Actions & Reports === */}
                <div className="md:w-2/3 space-y-6">
                    <h2 className="text-body-regular">Take Action</h2>

                    <div className="flex flex-wrap gap-4">
                        {/* Disabled Action Buttons */}
                        {["✅ Mark as Resolved", "⚠️ Warn User", "🚫 Suspend User"].map((label) => (
                            <button
                                key={label}
                                className="bg-background-light hover:bg-background-light text-gray-400 px-4 py-2 rounded opacity-50 cursor-not-allowed"
                                disabled
                            >
                                {label}
                            </button>
                        ))}

                        {/* Active Delete Button */}
                        <button
                            onClick={() => setIsConfirmOpen(true)}
                            disabled={delLoading}
                            className="bg-background-light hover:bg-background-active px-4 py-2 rounded text-white"
                        >
                            ❌ Delete Post
                        </button>
                    </div>

                    {/* Report Status Section */}
                    <h3 className="mt-8 text-body-regular">Report Status</h3>
                    <div className="flex flex-wrap gap-4">
                        <div className="bg-background-light px-4 py-2 rounded text-white flex items-center gap-2 opacity-50 cursor-not-allowed">
                            ⏳ <span className="text-gray-300">Pending</span>
                        </div>
                        <div className="bg-background-light px-4 py-2 rounded text-white flex items-center gap-2 opacity-50 cursor-not-allowed">
                            🚫 <span className="text-red-400">Action Taken</span>
                        </div>
                        <div className="bg-background-light px-4 py-2 rounded text-white flex items-center gap-2 opacity-50 cursor-not-allowed">
                            ✅ <span className="text-green-400">Resolved</span>
                        </div>
                    </div>

                    {/* Reports List */}
                    <h3 className="mt-8 text-body-regular">All Reports on this Post</h3>
                    {reports.length === 0 ? (
                        <p className="text-gray-400">No reports found.</p>
                    ) : (
                        <div className="space-y-3">
                            {reports.map((report) => (
                                <div
                                    key={report.id}
                                    className="bg-[#1A2D38] border border-gray-600 rounded px-4 py-3"
                                >
                                    <p>
                                        <strong>Reason:</strong> {report.reason}
                                    </p>
                                    <p>
                                        <strong>Category:</strong> {report.reportCategory}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        Report ID: {report.reportId}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* === Right Panel: Post Preview === */}
                <div className="md:w-1/3">
                    <h2 className="text-xl font-semibold mb-4">Post Preview</h2>
                    <ReportPost
                        post={{
                            user: post.user,
                            createdAt: post.createdAt,
                            title: post.title,
                            description: post.description,
                            images: post.images,
                            totalLikes: post.totalLikes,
                            totalComments: post.totalComments,
                            totalReposts: post.totalReposts,
                        }}
                    />
                </div>
            </div>

            {/* === Confirmation Modal === */}
            <ConfirmationPopup
                isOpen={isConfirmOpen}
                message="Are you sure you want to delete this post?"
                onConfirm={handleDelete}
                onCancel={() => setIsConfirmOpen(false)}
                confirmLabel="Delete"
                cancelLabel="Cancel"
            />
        </div>
    );
};

export default ReportActions;
