import React from "react";
import { useNavigate } from "react-router";
import Plus from "../../../assets/img/Plus.png";

interface CreateItemProps {
    name: string;
    variant: "clubs" | "events" | "groups";
}

/**
 * Custom Create Card component for creating Clubs, Events or Groups
 */
const CreateItem: React.FC<CreateItemProps> = ({ name, variant }) => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        switch (variant) {
            case "clubs":
                navigate("/clubs/create");
                break;
            case "events":
                navigate("/event/create");
                break;
            case "groups":
                navigate("/group/create");
                break;
            default:
            // console.warn("Invalid variant provided to CustomCreate");
        }
    };

    return (
        <div
            className="flex flex-col justify-center items-center h-48 w-48 border border-border-muted bg-background-light rounded-xl p-4 cursor-pointer hover:bg-background-active transition-colors"
            onClick={handleNavigate}
        >
            <img
                src={Plus}
                alt="Add"
                className="h-[53px] w-[50px] pt-2"
            />
            <h3 className="text-description-medium text-default pt-6 text-center">
                {name}
            </h3>
        </div>
    );
};

export default CreateItem;
