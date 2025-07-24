import React from "react";

export interface Member {
    id: string;
    name: string;
    university?: string;
    profilePicId?: string;
    userName?: string;
}

interface MemberCardProps {
    member: Member;
    onViewProfile?: () => void;
    onRemove?: () => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, onViewProfile, onRemove }) => {
    return (
        <div className="flex items-center justify-between w-full px-5 py-3 rounded-xl bg-background-default">
            {/* Left: Profile Info */}
            <div className="flex items-center gap-4">
                <img
                    src={member.profilePicId || `https://api.dicebear.com/8.x/thumbs/svg?seed=${member.name}`}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex flex-col">
                    <span className="text-body-semibold text-default">{member.name}</span>
                    <span className="text-description-regular text-muted">{member.university}</span>
                </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex gap-2">
                {onViewProfile && (
                    <button
                        onClick={onViewProfile}
                        className="px-3 py-3 text-caption text-primary border border-primary rounded-md hover:bg-primary hover:text-default transition"
                    >
                        View Profile
                    </button>
                )}
                {onRemove && (
                    <button
                        onClick={onRemove}
                        className="px-3 py-1 text-caption text-red-600 border border-red-600 rounded-md hover:bg-red-600 hover:text-default transition"
                    >
                        Remove
                    </button>
                )}
            </div>
        </div>
    );
};

export default MemberCard;
