import { useMemo } from "react";
import Love from "../../../assets/img/Love.png";
import Chat from "../../../assets/img/Chat.png";
import Repost from "../../../assets/img/Repost.png";
import send from "../../../assets/img/send.png";
import save from "../../../assets/img/save.png";
import defaultAvatar from "../../../assets/img/avatar.png";

interface Post {
    id: string;
    createdAt: string;
    isLiked?: boolean;
    isSaved?: boolean;
    club?: { name: string };
    user?: { name: string; profilePicId?: string };
    repostedByUser?: { name: string };
    title?: string;
    description?: string;
    totalLikes?: number;
    totalComments?: number;
    totalReposts?: number;
    images?: string[];
}

const CustomPost: React.FC<{ post: Post }> = ({ post }) => {
    const isRepost = !!post.repostedByUser;
    const postCreator = useMemo(() => post.user, [post]);

    const getTimeAgo = (createdAt: string) => {
        const createdDate = new Date(createdAt);
        const now = new Date();
        const diff = Math.floor((now.getTime() - createdDate.getTime()) / 1000);
        if (diff < 60) return "few seconds ago";
        if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
        if (diff < 172800) return "1 day ago";
        return `${Math.floor(diff / 86400)} days ago`;
    };


    return (
        <div className="w-80 h-96 bg-background-light border border-default text-default rounded-md overflow-hidden flex flex-col">
            {/* Repost Header */}
            {isRepost && (
                <div className="text-xs px-3 py-2 border-b border-muted">
                    🔁 Reposted by <span className="font-semibold">{post.repostedByUser?.name}</span>
                </div>
            )}

            {/* User Info */}
            <div className="flex gap-1 p-3 items-start">
                <img
                    src={postCreator?.profilePicId || defaultAvatar}
                    alt="avatar"
                    className="h-[35px] w-[35px] rounded-full object-cover"
                />
                <div className="w-full">
                    <div className="flex items-center truncate w-full text-ellipsis whitespace-nowrap">
                        <span className="text-default font-Gilroy-SemiBold truncate">{postCreator?.name}</span>
                        <span className="text-muted text-small ml-2 truncate">• {getTimeAgo(post.createdAt)}</span>
                    </div>
                    <h3 className="text-muted text-caption truncate">{post.club?.name || ""}</h3>
                    <p className="text-muted text-caption">{post.title}</p>
                </div>
            </div>

            {/* Image or Placeholder */}
            <div className="w-full h-40 px-3">
                {post.images?.length ? (
                    <img
                        src={post.images[0]}
                        alt="post-image"
                        className="w-full h-full object-cover rounded-md"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-background-active rounded-md text-muted text-caption italic">
                        Text Post
                    </div>
                )}
            </div>

            {/* Description */}
            <div className="px-3 pt-2 text-caption text-default line-clamp-3">
                {post.description || "No description provided."}
            </div>

            {/* Post Stats */}
            <div className="flex flex-wrap justify-between gap-y-2 px-3 py-2 mt-auto">
                {[{ icon: Love, count: post.totalLikes }, { icon: Chat, count: post.totalComments }, { icon: Repost, count: post.totalReposts }].map(
                    ({ icon, count }, idx) => (
                        <div key={idx} className="flex items-center border border-muted px-2 py-1 gap-1">
                            <img src={icon} alt="icon" className="h-[18px] w-[18px]" />
                            <span className="text-caption text-muted">{count || 0}</span>
                        </div>
                    )
                )}
                <div className="flex border border-muted">
                    <div className="px-2 py-1 border-r border-muted">
                        <img src={send} className="w-[18px] h-[18px]" alt="send" />
                    </div>
                    <div className="px-2 py-1">
                        <img src={save} className="w-[18px] h-[18px]" alt="save" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomPost;
