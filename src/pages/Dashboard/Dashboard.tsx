import React from "react";
import DashboardStatCard, { type Stat } from "../../components/UI/DashboardStatCard";
import DashboardProgressCard from "../../components/UI/DashboardProgressCard";
import InfoTable from "../../components/UI/InfoTable";

// Image Imports
import TotalUser from "../../assets/img/TotalUser.png";
import NewUser from "../../assets/img/NewUser.png";
import ActiveUser from "../../assets/img/ActiveUser.png";
import Visits from "../../assets/img/Visits.png";
import TotalReports from "../../assets/img/TotalReports.png";

// Stats
const stats: Stat[] = [
    {
        title: "Total User",
        value: "40,689",
        change: "8.5%",
        time: "from yesterday",
        icon: TotalUser,
        trend: "up",
    },
    {
        title: "New User",
        value: "15,675",
        change: "8.5%",
        time: "from yesterday",
        icon: NewUser,
        trend: "down",
    },
    {
        title: "Active Users",
        value: "25,267",
        change: "8.5%",
        time: "from yesterday",
        icon: ActiveUser,
        trend: "up",
    },
    {
        title: "Visits",
        value: "3,921",
        change: "8.5%",
        time: "from yesterday",
        icon: Visits,
        trend: "up",
    },
    {
        title: "Total Reports",
        value: "102",
        change: "8.5%",
        time: "from yesterday",
        icon: TotalReports,
        trend: "down",
    },
];

// Progress
const progressData = [
    {
        title: "Event Progress",
        items: [
            { label: "Upcoming Events", value: 3, color: "#F3642A" },
            { label: "Ongoing Events", value: 9, color: "#FFBB38" },
            { label: "Live Events", value: 12, color: "#94E9B8" },
        ],
    },
    {
        title: "User Verification",
        items: [
            { label: "Pending Users", value: 3, color: "#00B69B" },
            { label: "Unverified Users", value: 9, color: "#FFBB38" },
            { label: "Verified Users", value: 12, color: "#FF0000" },
        ],
    },
    {
        title: "Reports",
        items: [
            { label: "Total Reports", value: 3, color: "#FFBB38" },
            { label: "Pending Reports", value: 9, color: "#FF0000" },
            { label: "Resolved Cases", value: 12, color: "#00B69B" },
        ],
    },
    {
        title: "User Data",
        items: [
            { label: "Active Users", value: 3, color: "#F3642A" },
            { label: "Event Category", value: 9, color: "#FFBB38" },
            { label: "Student Chapters", value: 12, color: "#94E9B8" },
        ],
    },
];

const Dashboard: React.FC = () => {
    return (
        <div className="min-h-screen bg-background-default pl-8 pr-8">
            <div className="mx-auto">

                {/* ------------------ Overview Header ------------------ */}
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-subheading-semibold text-primary">Overview</h2>
                    <select className="bg-background-default hover:bg-background-active text-default px-4 py-2 rounded-lg font-gilroy-medium outline-none cursor-pointer">
                        <option>Today</option>
                        <option>Yesterday</option>
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                    </select>
                </div>

                {/* ------------------ Stats Cards ------------------ */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
                    {stats.map((stat, index) => (
                        <DashboardStatCard key={index} stat={stat} />
                    ))}
                </div>

                {/* ------------------ Progress Cards ------------------ */}
                <h2 className="text-subheading-semibold text-primary mb-3">Progress</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {progressData.map((data, i) => (
                        <DashboardProgressCard key={i} data={data} />
                    ))}
                </div>

                {/* ------------------ Info Table ------------------ */}
                <h2 className="text-subheading-semibold text-primary mt-5 mb-3">User Info</h2>
                <InfoTable />
            </div>
        </div>
    );
};

export default Dashboard;