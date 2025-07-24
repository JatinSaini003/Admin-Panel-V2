import React, { useState } from "react";
import ReportsDetails from "./components/ReportDetails";

// ----------------------------------------
// Types
// ----------------------------------------
type Report = {
    id: string;
    fullName: string;
    username: string;
    reportedBy: string;
};

type ReportType = "allReports" | "userReportedPosts" | "userReportedComments" | "userReportedProfiles";

// ----------------------------------------
// Dummy Reports Data (Temporary)
// ----------------------------------------
const reports: Report[] = [
    {
        id: "P001",
        fullName: "John Doe",
        username: "johndoe",
        reportedBy: "Jane Smith",
    },
    {
        id: "P002",
        fullName: "Alice Johnson",
        username: "alicej",
        reportedBy: "Bob Brown",
    },
    {
        id: "P003",
        fullName: "Michael Lee",
        username: "michaell",
        reportedBy: "Sarah Parker",
    },
];

// ----------------------------------------
// Main Component
// ----------------------------------------
const ReportsViolations: React.FC = () => {
    const [selectedType, setSelectedType] = useState<ReportType>("allReports");
    const [popupVisible, setPopupVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleFilterClick = (type: ReportType) => {
        setSelectedType(type);
        // TODO: filter logic or fetch new data
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        // TODO: implement search filter logic (optional)
    };

    return (
        <div className="bg-background-default text-default px-8">
            {/* Filter Buttons */}
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

            {/* Header + Search */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-[#F3642A] font-Gilroy-SemiBold text-xl">All Reports</h2>
                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pl-4 pr-4 py-2 bg-[#444444] text-[#BEBAB9] w-64 rounded-md focus:outline-none focus:ring focus:ring-[#F3642A]/40"
                />
            </div>

            {/* Table */}
            <div className="bg-[#1a2634] overflow-x-auto rounded-lg">
                <table className="w-full border border-white text-sm">
                    <thead className="border-b border-white">
                        <tr className="bg-[#f85f36] text-white">
                            <th className="px-6 py-3 bg-[#F74F0B] text-left font-semibold">Post ID</th>
                            <th className="px-6 py-3 bg-[#F3642A] text-left font-semibold">Full Name</th>
                            <th className="px-6 py-3 bg-[#F74F0B] text-left font-semibold">Username</th>
                            <th className="px-6 py-3 bg-[#F3642A] text-left font-semibold">Reported By</th>
                            <th className="px-6 py-3 bg-[#F74F0B] text-left font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {reports.map((report) => (
                            <tr key={report.id} className="border-b border-white text-gray-300">
                                <td className="px-6 py-3 bg-[#0B1E29]">{report.id}</td>
                                <td className="px-6 py-3 bg-[#142D3C]">{report.fullName}</td>
                                <td className="px-6 py-3 bg-[#0B1E29]">@{report.username}</td>
                                <td className="px-6 py-3 bg-[#142D3C]">{report.reportedBy}</td>
                                <td className="px-6 py-3 bg-[#0B1E29]">
                                    <button
                                        onClick={() => setPopupVisible(true)}
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

            {/* Report Details Popup */}
            {popupVisible && (
                <div className="z-50">
                    <ReportsDetails />
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={() => setPopupVisible(false)}
                            className="px-4 py-2 mt-2 bg-[#F3642A] text-white rounded hover:bg-[#f85f36] transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportsViolations;
