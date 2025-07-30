import React from "react";

// Icons
import Love from "../../../assets/img/Love.png";
import Chat from "../../../assets/img/Chat.png";
import Repost from "../../../assets/img/Repost.png";
import SendIcon from "../../../assets/img/send.png";
import SaveIcon from "../../../assets/img/save.png";

// Types
interface User {
    name: string;
    avatar?: string;
}

interface Post {
    user: User;
    repostedByUser?: User;
    createdAt: string;
    title?: string;
    description?: string;
    images?: string[];
    totalLikes?: number;
    totalComments?: number;
    totalReposts?: number;
}

interface ReportPostProps {
    post: Post;
}

const ReportPost: React.FC<ReportPostProps> = ({ post }) => {
    const isRepost = !!post?.repostedByUser;
    const postCreator = post.user;
    const repostedBy = post.repostedByUser;

    const getTimeAgo = (createdAt: string): string => {
        const createdDate = new Date(createdAt);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - createdDate.getTime()) / 1000);

        if (diffInSeconds < 60) return "a few seconds ago";
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 172800) return "1 day ago";
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    };

    return (
        <div className="w-full text-white bg-[#1A2A32] rounded-lg shadow-md">
            {/* Repost Info */}
            {isRepost && (
                <div className="text-xs text-[#AAAAAA] px-4 pt-2">
                    🔁 Reposted by <span className="font-medium">{repostedBy?.name}</span>
                </div>
            )}

            {/* Header */}
            <div className="flex items-start gap-3 p-4">
                <img
                    src={postCreator?.avatar || "https://placehold.co/40x40?text=User"}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col w-full">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-[#FFEEE6] truncate max-w-[140px]">
                            {postCreator?.name}
                        </h3>
                        <span className="text-xs text-[#B0B0B0] whitespace-nowrap">
                            {getTimeAgo(post.createdAt)}
                        </span>
                    </div>
                    {post.title && <p className="text-sm text-gray-400">{post.title}</p>}
                </div>
            </div>

            {/* Image Display */}
            {post.images?.length ? (
                <div className="w-full max-h-[300px] overflow-hidden">
                    <img
                        src={post.images[0]}
                        alt="Post Image"
                        className="w-full h-full object-cover rounded-b-lg"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src =
                                "https://placehold.co/500x300?text=Image+Unavailable";
                        }}
                    />
                </div>
            ) : (
                <div className="px-4 pb-2 text-gray-500 text-sm">No image attached.</div>
            )}

            {/* Description */}
            <div className="px-4 py-3">
                <p className="text-sm text-[#FFEEE6]">
                    {post.description || "No description provided."}
                </p>
            </div>

            {/* Footer / Reactions */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-[#333] text-[#BEBAB9] text-sm">
                <div className="flex items-center gap-2">
                    <img src={Love} alt="Like" className="w-4 h-4" />
                    {post.totalLikes ?? 0}
                </div>
                <div className="flex items-center gap-2">
                    <img src={Chat} alt="Comment" className="w-4 h-4" />
                    {post.totalComments ?? 0}
                </div>
                <div className="flex items-center gap-2">
                    <img src={Repost} alt="Repost" className="w-4 h-4" />
                    {post.totalReposts ?? 0}
                </div>
                <div className="flex gap-2 ml-auto">
                    <img src={SendIcon} alt="Send" className="w-4 h-4 cursor-pointer" />
                    <img src={SaveIcon} alt="Save" className="w-4 h-4 cursor-pointer" />
                </div>
            </div>
        </div>
    );
};

export default ReportPost;
