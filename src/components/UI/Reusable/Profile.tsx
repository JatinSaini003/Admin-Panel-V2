import defaultImage from "../../../assets/img/Person.png"

export interface CustomProfileProps {
    image?: string;
    heading: string;
    subHeading?: string;
    alt?: string;
    actionButtons?: React.ReactNode; // <-- NEW
}

const Profile: React.FC<CustomProfileProps> = ({
    image,
    heading,
    subHeading = "Profile Picture",
    alt = "profile-image",
    actionButtons,
}) => {
    return (
        <div className="flex items-center justify-between mb-5 pl-2">
            <div className="flex items-center gap-4">
                <img
                    src={image || defaultImage}
                    alt={alt}
                    className="w-20 h-20 rounded-full object-cover shadow-md"
                />
                <div className="flex flex-col">
                    <h3 className="text-default text-description-medium">{heading}</h3>
                    <p className="text-muted text-caption">{subHeading}</p>
                </div>
            </div>
            {actionButtons && <div className="flex gap-3">{actionButtons}</div>}
        </div>
    );
};

export default Profile