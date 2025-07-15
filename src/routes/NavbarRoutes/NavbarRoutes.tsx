// Type Imports
import type { NavItemType } from "../route.types";

// Image imports
import SMyProfile from "../../assets/img/SMyProfile.png";
import SDashBord from "../../assets/img/SDashBord.png";
import SClubs from "../../assets/img/SClubs.png";
import SEvents from "../../assets/img/SEvents.png";
import SGroups from "../../assets/img/SGroups.png";
import SUserInfo from "../../assets/img/SUserInfo.png";
import SVerification from "../../assets/img/SVerification.png";
import SReport from "../../assets/img/SReport.png";
import SLogout from "../../assets/img/SLogout.png";
import LMyProfile from "../../assets/img/LMyProfile.png";
import LDashBord from "../../assets/img/LDashBord.png";
import LClubs from "../../assets/img/LClubs.png";
import LEvents from "../../assets/img/LEvents.png";
import LGroups from "../../assets/img/LGroups.png";
import LUserInfo from "../../assets/img/LUserInfo.png";
import LVerification from "../../assets/img/LVerification.png";
import LReport from "../../assets/img/LReport.png";
import LLogout from "../../assets/img/LLogout.png";



/**
 * Navigation definitions
 */
export const navItems: NavItemType[] = [
    {
        label: "My Profile",
        path: "/profile",
        icon: {
            inactive: SMyProfile,
            active: LMyProfile,
        },
        group: "PROFILE",
    },
    {
        label: "Dashboard",
        path: "/",
        icon: {
            inactive: SDashBord,
            active: LDashBord,
        },
        group: "MAIN",
    },
    {
        label: "Clubs",
        path: "/clubs",
        icon: {
            inactive: SClubs,
            active: LClubs,
        },
        group: "MAIN",
    },
    {
        label: "Events",
        path: "/events",
        icon: {
            inactive: SEvents,
            active: LEvents,
        },
        group: "MAIN",
    },
    {
        label: "Groups",
        path: "/groups",
        icon: {
            inactive: SGroups,
            active: LGroups,
        },
        group: "MAIN",
    },
    {
        label: "User Info",
        path: "/user-info",
        icon: {
            inactive: SUserInfo,
            active: LUserInfo,
        },
        group: "OTHERS",
    },
    {
        label: "Pending Verifications",
        path: "/pending-verifications",
        icon: {
            inactive: SVerification,
            active: LVerification,
        },
        group: "OTHERS",
    },
    {
        label: "Reports & Violations",
        path: "/reports-violations",
        icon: {
            inactive: SReport,
            active: LReport,
        },
        group: "OTHERS",
    },
    {
        label: "Logout",
        path: "/logout",
        icon: {
            inactive: SLogout,
            active: LLogout,
        },
        group: "LOGOUT",
    },
];