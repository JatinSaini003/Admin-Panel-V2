import React from "react";
import { useNavigate } from "react-router-dom";
import ReportPost from "./ReportPost";

const ReportDetails: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 z-10 min-h-screen p-4 bg-black/50 flex justify-center items-center">
            <div className="flex flex-col gap-4 border border-white bg-[#0B1E29] w-[688px] h-[460px] p-10">
                <div className="grid md:grid-cols-2 gap-4">
                    {/* Left: Post */}
                    <ReportPost />

                    {/* Right: Info Section */}
                    <div className="space-y-4">
                        {/* Reported By */}
                        <div className="bg-[#243139] p-3 shadow-xl border border-white">
                            <span className="text-white pb-1 font-medium text-sm">
                                Reported by
                            </span>
                            <div className="flex items-center gap-3 mt-2">
                                <img
                                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
                                    alt="Reporter"
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <p className="text-white text-lg font-semibold">
                                        Daksh Malhotra
                                    </p>
                                    <p className="text-[#BEBAB9] text-sm">Amity University</p>
                                </div>
                            </div>
                        </div>

                        {/* Reported On */}
                        <div className="bg-[#243139] p-3 shadow-xl border border-white">
                            <span className="text-white text-sm font-medium">Reported on</span>
                            <p className="text-white text-xl font-medium mt-1">
                                March 10, 2025
                            </p>
                        </div>

                        {/* Report Status */}
                        <div className="bg-[#243139] p-3 shadow-xl border border-white">
                            <span className="text-white text-sm font-medium">Report Status</span>
                            <p className="text-white text-xl font-medium mt-1">Pending</p>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={() => navigate("/report-details")}
                    className="mx-auto w-[180px] bg-[#f85f36] hover:bg-[#e54d26] text-white text-lg font-medium py-3 px-8 transition-colors duration-200"
                >
                    Take Action
                </button>
            </div>
        </div>
    );
};

export default ReportDetails;
