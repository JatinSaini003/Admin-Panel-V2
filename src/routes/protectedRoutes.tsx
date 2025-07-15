import type { CustomRoute } from "./route.types";
import DashboardLayout from "../components/layout/DashboardLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import MyProfile from "../pages/MyProfile/MyProfile";
import Clubs from "../pages/Club/Club";
import RouteError from "../utils/ErrorHandlers/RouteError";


/**
 * Protected Routes first verifies the user's authentication
 */
const protectedRoutes: CustomRoute[] = [
    {
        path: "/",
        element: <DashboardLayout />,
        errorElement: <RouteError />,
        requiresAuth: true,
        children: [
            {
                index: true,
                element: <Dashboard />,
                meta: {
                    pageName: "Dashboard",
                    pageDescription: "Welcome to your admin panel",
                },
            },
            {
                path: "profile",
                element: <MyProfile />,
                meta: {
                    pageName: "My Profile",
                    pageDescription: "Manage your account details and preferences"
                },
            },
            {
                path: "clubs",
                element: <Clubs />,
                meta: {
                    pageName: "Clubs",
                    pageDescription: "Create, manage, and oversee club activities",
                },
            },
            {
                path: "events",
                element: <Clubs />,
                meta: {
                    pageName: "Events",
                    pageDescription: "Organize, track, and manage event details",
                },
            },
            {
                path: "groups",
                element: <Clubs />,
                meta: {
                    pageName: "Groups",
                    pageDescription: "Manage student communities and group activities",
                },
            },
            {
                path: "user-info",
                element: <Clubs />,
                meta: {
                    pageName: "User Info",
                    pageDescription: "View and manage user details, status, and activity",
                },
            },
            {
                path: "pending-verifications",
                element: <Clubs />,
                meta: {
                    pageName: "Pending Verifications",
                    pageDescription: "Review all pending submissions awaiting approval or action.",
                },
            },
            {
                path: "reports-violations",
                element: <Clubs />,
                meta: {
                    pageName: "Reports & Violations",
                    pageDescription: "Track reported issues and take necessary actions.",
                },
            },
        ],
    },
];

export default protectedRoutes;
