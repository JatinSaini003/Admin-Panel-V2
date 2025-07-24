import { PieChart } from "@mui/x-charts/PieChart";
import Box from "@mui/material/Box";
import { useState } from "react";
import { MoonLoader } from "react-spinners";

// ------------------ Types ------------------
type ProgressItem = {
    label: string;
    value: number;
    color: string;
};

type DashboardProgressCardProps = {
    data: {
        title: string;
        items: ProgressItem[];
    };
    loading: boolean;
};

// ------------------ Legend suppressor ------------------
const EmptyLegend = () => null;

// ------------------ Donut Chart ------------------
const CustomPieChart: React.FC<{ items: ProgressItem[] }> = ({ items }) => {
    const [radius] = useState(50);

    return (
        <div className="w-full flex justify-center">
            <Box className="w-full max-w-[220px]">
                <PieChart
                    series={[
                        {
                            data: items,
                            innerRadius: radius,
                            outerRadius: 80,
                            cx: "50%",
                            cy: 90,
                        },
                    ]}
                    width={220}
                    height={180}
                    slots={{ legend: EmptyLegend }}
                />
            </Box>
        </div>
    );
};

// ------------------ Progress Card ------------------
const DashboardProgressCard: React.FC<DashboardProgressCardProps> = ({ data, loading }) => {
    return (
        <div className="bg-background-default border border-border-muted rounded-xl p-4 flex flex-col items-center shadow-sm min-h-[16rem] justify-center">
            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <MoonLoader color="#0070FF" size={30} />
                </div>
            ) : (
                <>
                    {/* Title */}
                    <h2 className="text-subheading-semibold text-default mb-2">
                        {data.title}
                    </h2>

                    {/* Chart */}
                    <CustomPieChart items={data.items} />

                    {/* Legend */}
                    <div className="w-full mt-4 space-y-2">
                        {data.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between text-caption">
                                <div className="flex items-center">
                                    <span
                                        className="inline-block w-[10px] h-[10px] rounded-full mr-2"
                                        style={{ backgroundColor: item.color }}
                                    ></span>
                                    <span className="text-default font-gilroy-medium">{item.label}</span>
                                </div>
                                <span className="text-default font-gilroy-medium">
                                    {String(item.value).padStart(2, "0")}
                                </span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default DashboardProgressCard;
