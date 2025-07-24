import { useState, type KeyboardEvent } from "react";
import { Outlet, useLocation, useMatches, useNavigate } from "react-router-dom";
import { Search, ChevronDown, ChevronLeft } from "lucide-react";
import { useAuth } from "../../auth/useAuth";
import { type RouteMeta } from "../../routes/route.types";
import { navItems } from "../../routes/NavbarRoutes/NavbarRoutes";
import NavItem from "../UI/NavItem";
import ConfirmationPopup from "../UI/Reusable/ConfirmationPopup";

// Image imports
import PeerHubLogo from "../../assets/img/PeerHubLogo.png";
import PeerHubSmallLogo from "../../assets/img/peerhub-small-logo.png";
import AdminImage from "../../assets/img/AdminImage.png";
import { clearToken } from "../../auth/authUtils";
import { useGlobalSearch } from "../../search/SearchContext";


/**
 * Dashboard Layout Component
 */
function DashboardLayout() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const location = useLocation();
    const [_, setActiveMenu] = useState(location.pathname);
    const [openLogOutPopup, setOpenLogOutPopup] = useState(false);
    const matches = useMatches();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Global Search State
    const { searchQuery, setSearchQuery } = useGlobalSearch();

    const handleSearchSubmit = () => {
        // console.log("Search triggered from DashboardLayout:", searchQuery, "Page:", location.pathname);
        // Pages will use searchQuery via context and run refetch logic accordingly
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSearchSubmit();
        }
    };

    /**
     * Fetching meta data of respective routes.
     * Defined as handle in the routes.
     */
    const currentRoute: RouteMeta = (matches[matches.length - 1]?.handle as RouteMeta) || {};

    const groupedNavs = {
        PROFILE: navItems.filter((item) => item.group === "PROFILE"),
        MAIN: navItems.filter((item) => item.group === "MAIN"),
        OTHERS: navItems.filter((item) => item.group === "OTHERS"),
        LOGOUT: navItems.filter((item) => item.group === "LOGOUT"),
    };

    // Handle actions for the logout buttons
    const handleLogout = () => {
        clearToken();
        setOpenLogOutPopup(false);
        navigate("/login");
    };

    const handleStayLoggedIn = () => {
        setOpenLogOutPopup(false);
    };

    return (
        <div className="flex h-screen bg-background-default text-default">
            {/* -------------------- Sidebar -------------------- */}
            <aside
                className={`flex rounded-lg flex-col bg-background-light transition-all duration-300 ml-6 mt-6 mb-3 mr-1 ${isSidebarCollapsed ? "w-[3.75rem]" : "w-[14.375rem]"
                    }`}>

                {/* -------------------- Logo -------------------- */}
                <div className="p-4 pb-7">
                    {isSidebarCollapsed ? (
                        <img
                            src={PeerHubSmallLogo}
                            alt="PeerHubSmallLogo"
                            className="h-[1.5rem] w-[6.75rem]"
                        />
                    ) : (
                        <img
                            src={PeerHubLogo}
                            alt="PeerHubLogo"
                            className="h-[1.5rem] w-[6.75rem]"
                        />
                    )}
                </div>

                {/* -------------------- Profile Link -------------------- */}
                <div className="border-b border-border-default pb-4">
                    {groupedNavs.PROFILE.map((item) => (
                        <NavItem
                            key={item.path}
                            {...item}
                            collapsed={isSidebarCollapsed}
                            setActiveMenu={setActiveMenu}
                        />
                    ))}
                </div>

                {/* -------------------- Main -------------------- */}
                <div className={`border-b border-border-default pb-4 ${isSidebarCollapsed ? "py-6" : ""}`}>
                    {!isSidebarCollapsed && (
                        <p className="px-4 py-3 text-caption text-muted">MAIN</p>
                    )}
                    {groupedNavs.MAIN.map((item) => (
                        <NavItem
                            key={item.path}
                            {...item}
                            collapsed={isSidebarCollapsed}
                            setActiveMenu={setActiveMenu}
                        />
                    ))}
                </div>

                {/* -------------------- Others -------------------- */}
                <div className={`${isSidebarCollapsed ? "py-6" : ""}`}>
                    {!isSidebarCollapsed && (
                        <p className="px-4 py-3 text-caption text-muted">OTHERS</p>
                    )}
                    {groupedNavs.OTHERS.map((item) => (
                        <NavItem
                            key={item.path}
                            {...item}
                            collapsed={isSidebarCollapsed}
                            setActiveMenu={setActiveMenu}
                        />
                    ))}
                </div>

                {/* -------------------- Logout -------------------- */}
                <div className="mt-auto">
                    {groupedNavs.LOGOUT.map((item) => (
                        <NavItem
                            key={item.path}
                            {...item}
                            collapsed={isSidebarCollapsed}
                            setActiveMenu={setActiveMenu}
                            openLogOutPopup={openLogOutPopup}
                            setOpenLogOutPopup={setOpenLogOutPopup}
                        />
                    ))}
                </div>

                {/* -------------------- Toggle -------------------- */}
                <button
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className={`p-2 m-2 rounded-full hover:bg-background-active transition-all ${isSidebarCollapsed ? "" : "self-end"
                        }`}
                >
                    <ChevronDown
                        className={`h-5 w-5 text-muted transition-transform ${isSidebarCollapsed ? "-rotate-90" : "rotate-90"
                            }`}
                    />
                </button>
            </aside>

            {/* -------------------- Main Content -------------------- */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* -------------------- Header -------------------- */}
                <header className="flex items-center justify-between mx-8 pt-6 h-[6.375rem] border-b border-border-default bg-background-default">
                    {/* -------------------- Right Section -------------------- */}
                    <div className="flex items-center gap-2">
                        {currentRoute.backButton && (
                            <button
                                onClick={() => navigate(-1)}
                                aria-label="Go back"
                                className="p-2 rounded hover:bg-background-light transition"
                            >
                                <ChevronLeft className="h-5 w-5 text-default" />
                            </button>
                        )}
                        <div>
                            <h1 className="text-heading text-default">
                                {currentRoute.pageName || "Dashboard"}
                            </h1>
                            {currentRoute.pageDescription && (
                                <p className="text-caption text-muted">
                                    {currentRoute.pageDescription}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* -------------------- Left Section -------------------- */}
                    <div className="flex items-center space-x-8">
                        {/* -------------------- Search -------------------- */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
                            <input
                                type="search"
                                placeholder="Search"
                                className="w-[15.625rem] h-[3rem] pl-10 bg-background-active border-border-muted font-gilroy-regular text-muted placeholder:text-muted focus:outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        {/* -------------------- Profile -------------------- */}
                        <div className="flex space-x-3">
                            <img
                                src={user?.profilePicId || AdminImage}
                                alt="Admin"
                                className="h-[3rem] w-[3rem] rounded-full"
                            />
                            <div className="hidden md:block">
                                <p className="text-description-medium">
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p className="text-caption text-muted">
                                    {user?.__typename}
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* -------------------- Route Page -------------------- */}
                <main className="flex-1 overflow-auto bg-background-default pt-4 pb-8">
                    <Outlet />
                </main>
            </div>

            {/* -------------------- Logout Popup -------------------- */}
            {openLogOutPopup && (
                <ConfirmationPopup
                    isOpen={openLogOutPopup}
                    message="Are you sure you want to logout?"
                    confirmLabel="Log me out"
                    cancelLabel="Stay logged in"
                    onConfirm={handleLogout}
                    onCancel={handleStayLoggedIn}
                />
            )}
        </div>
    );
}



export default DashboardLayout;