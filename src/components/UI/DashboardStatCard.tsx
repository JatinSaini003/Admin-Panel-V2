import React from "react";
import Up from "../../assets/img/Up.png";
import Down from "../../assets/img/Down.png";


/**
 * Type for a single stat item
 */
export interface Stat {
    title: string;
    value: string;
    change: string;
    time: string;
    icon: string;
    trend: "up" | "down";
}


/**
 * Single stat card in dashboard
 */
const DashboardStatCard: React.FC<{ stat: Stat }> = ({ stat }) => {
    return (
        <div className="bg-background-default py-6 rounded-xl border border-border-muted">
            <div className="flex justify-between items-start px-6 mb-4">

                {/* -------------------- Description -------------------- */}
                <div>
                    <h3 className="text-caption text-muted font-gilroy-medium mb-1">
                        {stat.title}
                    </h3>
                    <p className="text-heading text-default">
                        {stat.value}
                    </p>
                </div>

                {/* -------------------- Stat Card Logo -------------------- */}
                <div className="p-3 rounded-3xl bg-primary/20 w-[3.625rem] h-[3.625rem] flex items-center justify-center">
                    <img src={stat.icon} alt={`${stat.title}-icon`} className="h-[1.25rem] w-[1.75rem]" />
                </div>
            </div>

            {/* -------------------- Trend Section -------------------- */}
            <div className="flex items-center space-x-2 px-6 overflow-hidden">
                <img
                    src={stat.trend === "up" ? Up : Down}
                    className="w-[20px] h-[12px] shrink-0"
                    alt={stat.trend}
                />
                <span
                    className={`text-caption ${stat.trend === "up" ? "text-primary" : "text-danger"} shrink-0`}
                >
                    {stat.change}
                </span>
                <span className="text-caption text-muted truncate grow">
                    {`${stat.trend === 'up' ? "up" : "down"} ${stat.time}`}
                </span>
            </div>
        </div>
    );
};

export default DashboardStatCard;