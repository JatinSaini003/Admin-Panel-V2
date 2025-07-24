import React from "react";

// Images
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

        if (diffInSeconds < 60) return "few seconds ago";
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 172800) return "1 day ago";
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    };

    return (
        <div className="w-full sm:w-[300px] bg-[#243139] text-white overflow-hidden border border-[#FFFFFF] rounded-sm">
            {/* Repost Info */}
            {isRepost && (
                <div className="text-xs text-[#A0A0A0] px-3 py-2 border-b border-[#555]">
                    🔁 Reposted by <span className="font-semibold">{repostedBy?.name}</span>
                </div>
            )}

            {/* User Header */}
            <div className="flex items-start p-3 gap-3">
                <img
                    src={
                        postCreator?.avatar ||
                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
                    }
                    alt="Profile"
                    className="w-[35px] h-[35px] rounded-full object-cover mt-1"
                />
                <div className="flex flex-col w-[calc(100%-50px)]">
                    <div className="flex items-center gap-2 w-full">
                        <h3
                            className="font-Gilroy-SemiBold text-[#FFEEE6] max-w-[130px] truncate"
                            title={postCreator?.name}
                        >
                            {postCreator?.name}
                        </h3>
                        <span className="text-[#8D8D8D] text-[12px] whitespace-nowrap">
                            • {getTimeAgo(post?.createdAt)}
                        </span>
                    </div>
                    <p className="text-gray-400 text-sm break-words">{post?.title}</p>
                </div>
            </div>

            {/* Post Image */}
            {post.images?.length ? (
                // render images if present
                post.images.map((img, index) => (
                    <img key={index} src={img} alt={`Post image ${index}`} />
                ))
            ) : (
                // fallback UI if no images
                <p className="text-gray-400">No images available</p>
            )}

            {/* Description */}
            <div className="px-3 pt-1.5">
                <p className="text-[#FFEEE6] text-sm break-words">
                    {post?.description || "No description provided."}
                </p>
            </div>

            {/* Interaction Buttons */}
            <div className="flex justify-between px-3 pt-2 pb-3 flex-wrap gap-y-2">
                <div className="flex items-center border border-[#BEBAB9] px-1.5 py-0.5 gap-[5px]">
                    <img src={Love} alt="Likes" className="h-[18px] w-[18px]" />
                    <span className="text-[14px] text-[#BEBAB9] font-Gilroy-Regular">
                        {post?.totalLikes ?? 0}
                    </span>
                </div>
                <div className="flex items-center border border-[#BEBAB9] px-1.5 py-0.5 gap-[5px]">
                    <img src={Chat} alt="Comments" className="h-[18px] w-[18px]" />
                    <span className="text-[14px] text-[#BEBAB9] font-Gilroy-Regular">
                        {post?.totalComments ?? 0}
                    </span>
                </div>
                <div className="flex items-center border border-[#BEBAB9] px-1.5 py-0.5 gap-[5px]">
                    <img src={Repost} alt="Reposts" className="h-[18px] w-[18px]" />
                    <span className="text-[14px] text-[#BEBAB9] font-Gilroy-Regular">
                        {post?.totalReposts ?? 0}
                    </span>
                </div>
                <div className="border border-[#BEBAB9] flex">
                    <div className="flex items-center justify-center px-1.5 py-1 gap-[5px] border-r border-r-[#BEBAB9]">
                        <img src={SendIcon} alt="Send" className="h-[18px] w-[18px]" />
                    </div>
                    <div className="flex items-center justify-center px-1.5 py-1 gap-[5px]">
                        <img src={SaveIcon} alt="Save" className="h-[18px] w-[18px]" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportPost;
