import { useState } from "react";
import { Outlet, useLocation, useMatches } from "react-router-dom";
import { Search, ChevronDown } from "lucide-react";
import { useAuth } from "../../auth/useAuth";
import { type RouteMeta } from "../../routes/route.types";
import { navItems } from "../../routes/NavbarRoutes/NavbarRoutes";
import NavItem from "../UI/NavItem";
import LogoutPopUP from "../../components/UI/LogoutPopUP";

// Image imports
import PeerHubLogo from "../../assets/img/PeerHubLogo.png";
import PeerHubSmallLogo from "../../assets/img/peerhub-small-logo.png";
import AdminImage from "../../assets/img/AdminImage.png";


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

                    {/* -------------------- Left Section -------------------- */}
                    <div className="flex items-center space-x-8">
                        {/* -------------------- Search -------------------- */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
                            <input
                                type="search"
                                placeholder="Search"
                                className="w-[15.625rem] h-[3rem] pl-10 bg-background-active border-border-muted font-gilroy-regular text-muted placeholder:text-muted focus:outline-none"
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
                <LogoutPopUP
                    openLogOutPopup={openLogOutPopup}
                    setOpenLogOutPopup={setOpenLogOutPopup}
                />
            )}
        </div>
    );
}



export default DashboardLayout;