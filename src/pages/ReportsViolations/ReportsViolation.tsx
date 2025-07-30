import React, { useState } from "react";
import ReportsDetails from "./components/ReportDetails";
import { getReportingUsers } from "../../queries/reportQueries";
import { useQuery } from "@apollo/client";
import { ScaleLoader } from "react-spinners";

// ----------------------------------------
// Types
// ----------------------------------------

/**
 * Type for a user who reported posts
 */
type ReportingUser = {
    email: string;
    name: string;
    reportCount: number;
    userId: string;
    userName: string;
};

/**
 * Report type tabs
 */
type ReportType =
    | "allReports"
    | "userReportedPosts"
    | "userReportedComments"
    | "userReportedProfiles";

// ----------------------------------------
// Main Component
// ----------------------------------------

const ReportsViolations: React.FC = () => {
    // UI states
    const [selectedType, setSelectedType] = useState<ReportType>("allReports");
    const [popupVisible, setPopupVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    // Apollo Client: Fetch reporting users
    const { data, loading, error } = useQuery<{ getReportingUsers: ReportingUser[] }>(
        getReportingUsers,
        {
            fetchPolicy: "network-only", // ensures fresh data
        }
    );

    // Handle tab (report type) click
    const handleFilterClick = (type: ReportType) => {
        setSelectedType(type);
        // Optional: Add dynamic filtering logic for report types
    };

    // Search input change handler
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        // Optional: Add live search filtering logic
    };

    // Filtered data based on search (if search implemented)
    const filteredReports = data?.getReportingUsers?.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.userName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-background-default text-default px-8 py-6">
            {/* -------------------- */}
            {/* Report Type Filters */}
            {/* -------------------- */}
            <div className="mb-6 flex gap-4 flex-wrap">
                {(
                    [
                        { label: "All Reports", type: "allReports" },
                        { label: "Reported Posts", type: "userReportedPosts" },
                        { label: "Reported Comments", type: "userReportedComments" },
                        { label: "Reported Profiles", type: "userReportedProfiles" },
                    ] as { label: string; type: ReportType }[]
                ).map((btn) => (
                    <button
                        key={btn.type}
                        onClick={() => handleFilterClick(btn.type)}
                        className={`px-4 py-2 rounded-md font-medium text-sm transition duration-200 ${selectedType === btn.type
                            ? "bg-[#F3642A] text-white"
                            : "bg-[#1a2634] text-gray-300 hover:bg-[#26384e]"
                            }`}
                    >
                        {btn.label}
                    </button>
                ))}
            </div>

            {/* -------------------- */}
            {/* Header and Search */}
            {/* -------------------- */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-[#F3642A] font-Gilroy-SemiBold text-xl">All Reports</h2>
                <input
                    type="text"
                    placeholder="Search by name or username"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pl-4 pr-4 py-2 bg-[#444444] text-[#BEBAB9] w-64 rounded-md focus:outline-none focus:ring focus:ring-[#F3642A]/40"
                />
            </div>

            {/* -------------------- */}
            {/* Data Table */}
            {/* -------------------- */}
            <div className="bg-[#1a2634] overflow-x-auto rounded-lg">
                <table className="w-full border border-white text-sm">
                    <thead className="border-b border-white">
                        <tr className="bg-[#f85f36] text-white">
                            <th className="px-6 py-3 bg-[#F74F0B] text-left font-semibold">User ID</th>
                            <th className="px-6 py-3 bg-[#F3642A] text-left font-semibold">Full Name (Reported By)</th>
                            <th className="px-6 py-3 bg-[#F74F0B] text-left font-semibold">Username</th>
                            <th className="px-6 py-3 bg-[#F3642A] text-left font-semibold">Report Count</th>
                            <th className="px-6 py-3 bg-[#F74F0B] text-left font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {/* Loading State */}
                        {loading && (
                            <tr>
                                <td colSpan={5} className="h-40 text-center py-4 text-gray-400">
                                    <div className="flex justify-center items-center h-full">
                                        <ScaleLoader color="#0070FF" />
                                    </div>
                                </td>
                            </tr>
                        )}

                        {/* Error State */}
                        {error && (
                            <tr>
                                <td colSpan={5} className="h-40 text-center py-4 text-red-500">
                                    <div className="flex justify-center items-center h-full">
                                        Error loading data: {error.message}
                                    </div>
                                </td>
                            </tr>
                        )}

                        {/* Empty State */}
                        {!loading && filteredReports?.length === 0 && (
                            <tr>
                                <td colSpan={5} className="h-40 text-center py-4 text-gray-400">
                                    <div className="flex justify-center items-center h-full">
                                        No reports found.
                                    </div>
                                </td>
                            </tr>
                        )}

                        {/* Actual Data Rows */}
                        {filteredReports?.map((user) => (
                            <tr key={user.userId} className="text-gray-300">
                                <td className="px-6 py-3 bg-[#0B1E29]">{user.userId}</td>
                                <td className="px-6 py-3 bg-[#142D3C]">{user.name}</td>
                                <td className="px-6 py-3 bg-[#0B1E29]">@{user.userName}</td>
                                <td className="px-6 py-3 bg-[#142D3C]">{user.reportCount}</td>
                                <td className="px-6 py-3 bg-[#0B1E29]">
                                    <button
                                        onClick={() => {
                                            setSelectedUserId(user.userId);
                                            setPopupVisible(true)
                                        }}
                                        className="underline text-[#F3642A] hover:text-white transition duration-200"
                                    >
                                        View Report
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* -------------------- */}
            {/* Report Details Modal */}
            {/* -------------------- */}
            {popupVisible && (
                <div className="z-50">
                    {popupVisible && selectedUserId && (
                        <ReportsDetails studentId={selectedUserId}
                            onClose={() => {
                                setPopupVisible(false);
                                setSelectedUserId(null);
                            }}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default ReportsViolations;
