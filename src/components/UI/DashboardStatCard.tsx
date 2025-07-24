import React from "react";
import Up from "../../assets/img/Up.png";
import Down from "../../assets/img/Down.png";
import { MoonLoader } from "react-spinners";

export interface Stat {
    title: string;
    value: string;
    change: string;
    time: string;
    icon: string;
    trend: "up" | "down";
}

const DashboardStatCard: React.FC<{ stat: Stat; loading: boolean }> = ({ stat, loading }) => {
    return (
        <div className="bg-background-default py-6 rounded-xl border border-border-muted min-h-[10rem] flex flex-col justify-center">
            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <MoonLoader color="#0070FF" size={30} />
                </div>
            ) : (
                <>
                    {/* Top Section */}
                    <div className="flex justify-between items-start px-6 mb-4">
                        <div>
                            <h3 className="text-caption text-muted font-gilroy-medium mb-1">
                                {stat.title}
                            </h3>
                            <p className="text-heading text-default">
                                {stat.value}
                            </p>
                        </div>
                        <div className="p-3 rounded-3xl bg-primary/20 w-[3.625rem] h-[3.625rem] flex items-center justify-center">
                            <img
                                src={stat.icon}
                                alt={`${stat.title}-icon`}
                                className="h-[1.25rem] w-[1.75rem]"
                            />
                        </div>
                    </div>

                    {/* Trend Section */}
                    <div className="flex items-start space-x-2 overflow-hidden flex-col ">
                        <div className="flex ml-6 gap-2">
                            <img
                                src={stat.trend === "up" ? Up : Down}
                                className="w-[20px] h-[12px] shrink-0 mt-1 "
                                alt={stat.trend}
                            />
                            <span className={`text-caption ${stat.trend === "up" ? "text-primary" : "text-danger"}`}>
                                {stat.change}
                            </span>
                        </div>

                        <div>
                            <span className="text-caption text-muted truncate ml-4">
                                {`${stat.trend === "up" ? "up" : "down"} ${stat.time}`}
                            </span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DashboardStatCard;
