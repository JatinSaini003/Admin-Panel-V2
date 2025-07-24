import type { CustomRoute } from "./route.types";
import DashboardLayout from "../components/layout/DashboardLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import MyProfile from "../pages/MyProfile/MyProfile";
import Clubs from "../pages/Club/Club";
import RouteError from "../utils/ErrorHandlers/RouteError";
import UserDetails from "../pages/User-Info/UserDetails";
import UserInfo from "../pages/User-Info/UserInfo";
import FullListPage from "../components/UI/Reusable/FullListPage";
import ClubCreate from "../pages/Club/components/ClubCreate";
import ClubDetails from "../pages/Club/components/ClubDetails";
import ClubMembers from "../pages/Club/components/ClubMembers";
import Event from "../pages/Events/Event";
import EventCreate from "../pages/Events/components/EventCreate";
import EventDetails from "../pages/Events/components/EventDetails";
import EventMembers from "../pages/Events/components/EventMembers";
import Groups from "../pages/Groups/Groups";
import PendingVerification from "../pages/PendingVerifications/PendingVerifications";
import ReportsViolations from "../pages/ReportsViolations/ReportsViolation";
import GroupCreate from "../pages/Groups/components/GroupCreate";
import GroupAddMember from "../pages/Groups/components/GroupAddMembers";
import GroupDetails from "../pages/Groups/components/GroupDetails";
import GroupMembers from "../pages/Groups/components/GroupMembers";


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
                path: "clubs/create",
                element: <ClubCreate />,
                meta: {
                    pageName: "Create Club",
                    pageDescription: "Oversee club members, roles, and activities",
                    backButton: true
                },
            },
            {
                path: "clubs/ongoing-clubs",
                element: <FullListPage />,
                meta: {
                    pageName: "Ongoing Clubs",
                    pageDescription: "Oversee ongoing clubs and their details",
                    backButton: true
                },
            },
            {
                path: "clubs/details/:clubId",
                element: <ClubDetails />,
                meta: {
                    pageName: "Clubs",
                    pageDescription: "Oversee club members, roles, and activities",
                    backButton: true
                },
            },
            {
                path: "clubs/details/:clubId/Explore-club-posts",
                element: <FullListPage />,
                meta: {
                    pageName: "Explore Posts",
                    pageDescription: "View and manage club's posts",
                    backButton: true
                },
            },
            {
                path: "clubs/details/:clubId/members",
                element: <ClubMembers />,
                meta: {
                    pageName: "Club Members",
                    pageDescription: "Manage and oversee all members, roles, and permissions",
                    backButton: true
                },
            },
            {
                path: "events",
                element: <Event />,
                meta: {
                    pageName: "Events",
                    pageDescription: "Organize, track, and manage event details",
                },
            },
            {
                path: "event/create",
                element: <EventCreate />,
                meta: {
                    pageName: "Plan an Event",
                    pageDescription: "Manage event info, participants, and QR codes",
                    backButton: true
                },
            },
            {
                path: "events/upcoming",
                element: <FullListPage />,
                meta: {
                    pageName: "Upcoming Events",
                    pageDescription: "Oversee Upcoming Events and their details",
                    backButton: true
                },
            },
            {
                path: "event/details/:eventId",
                element: <EventDetails />,
                meta: {
                    pageName: "Events",
                    pageDescription: "Manage event info, participants, and QR codes",
                    backButton: true
                },
            },
            {
                path: "event/details/:eventId/members",
                element: <EventMembers />,
                meta: {
                    pageName: "Event Members",
                    pageDescription: "Manage and oversee all members, roles, and permissions",
                    backButton: true
                },
            },
            {
                path: "groups",
                element: <Groups />,
                meta: {
                    pageName: "Groups",
                    pageDescription: "Manage student communities and group activities",
                },
            },
            {
                path: "group/create",
                element: <GroupCreate />,
                meta: {
                    pageName: "Groups",
                    pageDescription: "Manage student communities and group activities",
                    backButton: true
                },
            },
            {
                path: "group/create/add-members",
                element: <GroupAddMember />,
                meta: {
                    pageName: "Add Members",
                    pageDescription: "Manage student communities and group activities",
                    backButton: true
                },
            },
            {
                path: "group/ongoing-groups",
                element: <FullListPage />,
                meta: {
                    pageName: "Groups",
                    pageDescription: "Oversee Upcoming Groups and their details",
                    backButton: true
                },
            },
            {
                path: "group/details/:groupId",
                element: <GroupDetails />,
                meta: {
                    pageName: "Groups",
                    pageDescription: "Manage Group info, participants, and QR codes",
                    backButton: true
                },
            },
            {
                path: "group/details/:groupId/members",
                element: <GroupMembers />,
                meta: {
                    pageName: "Group Members",
                    pageDescription: "Manage and oversee all members, roles, and permissions",
                    backButton: true
                },
            },
            {
                path: "user-info",
                element: <UserInfo />,
                meta: {
                    pageName: "User Info",
                    pageDescription: "View and manage user details, status, and activity",
                },
            },
            {
                path: "/user-details/:studentId",
                element: <UserDetails />,
                meta: {
                    pageName: "Member Details",
                    pageDescription: "View and manage user details, status, and activity",
                    backButton: true
                },
            },
            {
                path: "/user-details/:studentId/Explore-clubs",
                element: <FullListPage />,
                meta: {
                    pageName: "Explore Clubs",
                    pageDescription: "View and manage user's clubs",
                    backButton: true
                }
            },
            {
                path: "/user-details/:studentId/Explore-posts",
                element: <FullListPage />,
                meta: {
                    pageName: "Explore Posts",
                    pageDescription: "View and manage user's posts",
                    backButton: true
                }
            },
            {
                path: "/user-details/:studentId/Explore-likedposts",
                element: <FullListPage />,
                meta: {
                    pageName: "Explore Liked Posts",
                    pageDescription: "View and manage user's liked posts",
                    backButton: true
                }
            },
            {
                path: "/user-details/:studentId/Explore-events",
                element: <FullListPage />,
                meta: {
                    pageName: "Explore Events",
                    pageDescription: "View and manage user's events",
                    backButton: true
                }
            },
            {
                path: "/user-details/:studentId/Explore-groups",
                element: <FullListPage />,
                meta: {
                    pageName: "Explore Groups",
                    pageDescription: "View and manage user's groups",
                    backButton: true
                }
            },
            {
                path: "pending-verifications",
                element: <PendingVerification />,
                meta: {
                    pageName: "Pending Verifications",
                    pageDescription: "Review all pending submissions awaiting approval or action.",
                },
            },
            {
                path: "reports-violations",
                element: <ReportsViolations />,
                meta: {
                    pageName: "Reports & Violations",
                    pageDescription: "Track reported issues and take necessary actions.",
                },
            },
        ],
    },
];

export default protectedRoutes;
