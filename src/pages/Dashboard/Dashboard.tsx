import React, { useState } from "react";
import DashboardStatCard, { type Stat } from "../../components/UI/DashboardStatCard";
import DashboardProgressCard from "../../components/UI/DashboardProgressCard";
import InfoTable from "../../components/UI/InfoTable";
import { useQuery } from "@apollo/client";
import { GetDashboardData } from "../../queries/GetDashboardData";

// Image Imports
import TotalUser from "../../assets/img/TotalUser.png";
import NewUser from "../../assets/img/NewUser.png";
import ActiveUser from "../../assets/img/ActiveUser.png";
import Visits from "../../assets/img/Visits.png";
import TotalReports from "../../assets/img/TotalReports.png";

// Helper
const getTimeLabel = (filter: string, label: string) => {
    switch (filter) {
        case "DAY":
            return label === "Yesterday" ? "from yesterday" : "from today";
        case "WEEK":
            return "in the last 7 days";
        case "MONTH":
            return "in the last 30 days";
        default:
            return "recently";
    }
};

const Dashboard: React.FC = () => {
    const [selectedFilter, setSelectedFilter] = useState("TODAY");
    const [selectedLabel, setSelectedLabel] = useState("Today");

    const { data, loading, refetch } = useQuery(GetDashboardData, {
        variables: { filters: { filterBy: selectedFilter } },
        notifyOnNetworkStatusChange: true,
    });
    // console.log("Data : ", data)

    const timeLabel = getTimeLabel(selectedFilter, selectedLabel);

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;

        let filter = "TODAY";
        if (value === "Last 7 days") filter = "LAST_WEEK";
        if (value === "Last 30 days") filter = "LAST_MONTH";
        if (value === "Last Year") filter = "LAST_YEAR";

        setSelectedLabel(value);
        setSelectedFilter(filter);

        refetch({ filters: { filterBy: filter } });
    };

    const stats: Stat[] = [
        {
            title: "Total Users",
            value: data?.getDashboardData.totalUsers?.toString() ?? "-",
            change: `${data?.getDashboardData.userGrowth?.growthPercentage ?? 0}%`,
            time: timeLabel,
            icon: TotalUser,
            trend: data?.getDashboardData.userGrowth?.isPositive ? "up" : "down",
        },
        {
            title: "New Users",
            value: data?.getDashboardData.totalUsers?.toString() ?? "-",
            change: `${data?.getDashboardData.userGrowth?.growthPercentage ?? 0}%`,
            time: timeLabel,
            icon: NewUser,
            trend: data?.getDashboardData.userGrowth?.isPositive ? "up" : "down",
        },
        {
            title: "Active Users",
            value: data?.getDashboardData.activeUsers?.toString() ?? "-",
            change: `${data?.getDashboardData.activeUserGrowth?.growthPercentage ?? 0}%`,
            time: timeLabel,
            icon: ActiveUser,
            trend: data?.getDashboardData.activeUserGrowth?.isPositive ? "up" : "down",
        },
        {
            title: "Visits",
            value: "—",
            change: "0%",
            time: timeLabel,
            icon: Visits,
            trend: "up",
        },
        {
            title: "Total Reports",
            value: data?.getDashboardData.totalReports?.toString() ?? "-",
            change: `${data?.getDashboardData.reportGrowth?.growthPercentage ?? 0}%`,
            time: timeLabel,
            icon: TotalReports,
            trend: data?.getDashboardData.reportGrowth?.isPositive ? "up" : "down",
        },
    ];

    const progressData = [
        {
            title: "Event Progress",
            items: [
                {
                    label: "Upcoming Events",
                    value: data?.getDashboardData.eventProgress?.UPCOMING ?? 0,
                    color: "#F3642A",
                },
                {
                    label: "Happened Events",
                    value: data?.getDashboardData.eventProgress?.HAPPENED ?? 0,
                    color: "#FFBB38",
                },
                {
                    label: "Cancelled Events",
                    value: data?.getDashboardData.eventProgress?.CANCELLED ?? 0,
                    color: "#94E9B8",
                },
            ],
        },
        {
            title: "User Verification",
            items: [
                {
                    label: "Pending Users",
                    value: data?.getDashboardData.userVerificationPie?.Pending ?? 0,
                    color: "#00B69B",
                },
                {
                    label: "Unverified Users",
                    value: data?.getDashboardData.userVerificationPie?.UnVerified ?? 0,
                    color: "#FFBB38",
                },
                {
                    label: "Verified Users",
                    value: data?.getDashboardData.userVerificationPie?.Verified ?? 0,
                    color: "#FF0000",
                },
            ],
        },
        {
            title: "Reports",
            items: [
                {
                    label: "Resolved Reports",
                    value: data?.getDashboardData.reportPie?.[0] ?? 0,
                    color: "#00B69B",
                },
                {
                    label: "Unresolved Reports",
                    value: data?.getDashboardData.reportPie?.[1] ?? 0,
                    color: "#FF0000",
                },
            ],
        },
        {
            title: "User Data",
            items: [
                {
                    label: "Active Users",
                    value: data?.getDashboardData.activeUsers ?? 0,
                    color: "#F3642A",
                },
                {
                    label: "Event Category",
                    value: data?.getDashboardData.totalEvents ?? 0,
                    color: "#FFBB38",
                },
                {
                    label: "Student Chapters",
                    value: data?.getDashboardData.totalStudentChapters ?? 0,
                    color: "#94E9B8",
                },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-background-default pl-8 pr-8">
            <div className="mx-auto">
                {/* Overview Header */}
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-subheading-semibold text-primary">Overview</h2>
                    <select
                        className="bg-background-default hover:bg-background-active text-default px-4 py-2 rounded-lg font-gilroy-medium outline-none cursor-pointer"
                        value={selectedLabel}
                        onChange={handleFilterChange}
                    >
                        <option>Today</option>
                        <option>Yesterday</option>
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>Last Year</option>
                    </select>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
                    {stats.map((stat, index) => (
                        <DashboardStatCard key={index} stat={stat} loading={loading} />
                    ))}
                </div>

                {/* Progress Cards */}
                <h2 className="text-subheading-semibold text-primary mb-3">Progress</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {progressData.map((data, i) => (
                        <DashboardProgressCard key={i} data={data} loading={loading} />
                    ))}
                </div>

                {/* Info Table */}
                <h2 className="text-subheading-semibold text-primary mt-5 mb-3">User Info</h2>
                <InfoTable />
            </div>
        </div>
    );
};

export default Dashboard;
