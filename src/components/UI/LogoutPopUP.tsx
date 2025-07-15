import React from "react";
import { useNavigate } from "react-router-dom";
import { clearToken } from "../../auth/authUtils";


/**
 * Props for LogoutPopUP component
 */
interface LogoutPopUPProps {
    openLogOutPopup: boolean;
    setOpenLogOutPopup: React.Dispatch<React.SetStateAction<boolean>>;
}


/**
 * LogoutPopUP - Confirmation modal for logging out
 */
const LogoutPopUP: React.FC<LogoutPopUPProps> = ({
    openLogOutPopup,
    setOpenLogOutPopup,
}) => {
    const navigate = useNavigate();


    /**
     * Handle "Log me out" click
     */
    const handleLogOut = () => {
        setOpenLogOutPopup(false);
        clearToken();
        navigate("/login");
    };


    /**
     * Handle "Stay logged in" click
     */
    const handleStayIn = () => {
        setOpenLogOutPopup(false);
    };

    if (!openLogOutPopup) return null;

    return (
        <div className="fixed inset-0 z-10 bg-black/50 flex justify-center items-center">
            <div className="flex flex-col items-center bg-background-active rounded-lg shadow-lg overflow-hidden">
                <span className="text-subheading-regular text-default text-center font-gilroy-medium p-7">
                    Are you sure you want to Logout?
                </span>
                <div className="w-full grid grid-cols-2 border-t border-muted">
                    <button
                        className="py-3 text-muted text-description-medium hover:text-default hover:bg-primary transition-colors"
                        onClick={handleLogOut}
                    >
                        Log me out
                    </button>
                    <button
                        className="py-3 text-muted text-description-medium border-l border-muted hover:text-default hover:bg-primary transition-colors"
                        onClick={handleStayIn}
                    >
                        Stay logged in
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutPopUP;
