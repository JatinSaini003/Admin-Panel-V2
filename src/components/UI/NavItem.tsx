// Types import
import type { NavItemType } from "../../routes/route.types";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * NavItemType extended for NavItem Component
 */
interface NavItemProps extends NavItemType {
    collapsed: boolean;
    setActiveMenu: React.Dispatch<React.SetStateAction<string>>;
    openLogOutPopup?: boolean;
    setOpenLogOutPopup?: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * NavItem Component
 */
const NavItem: React.FC<NavItemProps> = ({
    label,
    path,
    icon,
    collapsed,
    setActiveMenu,
    setOpenLogOutPopup,
}) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = location.pathname === path;

    const handleClick = () => {
        if (label === "Logout") {
            setOpenLogOutPopup?.(true);
        } else {
            setActiveMenu(path);
            navigate(path);
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`flex items-center w-full p-2 px-4 hover:bg-background-active ${isActive ? "bg-background-active border-l-4 border-l-primary" : ""}`}>
            <img
                src={isActive ? icon.active : icon.inactive}
                alt={label}
                className="h-[1.25rem] w-[1.25rem] mr-3"
            />
            {!collapsed && (
                <span className={`font-gilroyRegular ${isActive ? "text-primary" : "text-default"}`}>
                    {label}
                </span>
            )}
        </button>
    );
};

export default NavItem;
