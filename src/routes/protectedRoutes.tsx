import type { CustomRoute } from "./route.types";
import DashboardLayout from "../components/layout/DashboardLayout";
import Dashboard from "../components/Dashboard/Dashboard";
import MyProfile from "../components/MyProfile/MyProfile";
import Clubs from "../components/Club/Club";


/**
 * Protected Routes first verifies the user's authentication
 */
const protectedRoutes: CustomRoute[] = [
    {
        path: "/",
        element: <DashboardLayout />,
        requiresAuth: true,
        children: [
            {
                path: "",
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
            // Add more routes here...
        ],
    },
];

export default protectedRoutes;
