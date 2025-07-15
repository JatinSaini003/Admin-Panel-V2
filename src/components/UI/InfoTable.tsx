import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import Hammer from "../../assets/Loader/Hammer.json";
import { useQuery } from "@apollo/client";
import { GET_ALL_USER_LIST } from "../../queries/userQueries";
import { ChevronDown, ChevronUp } from "lucide-react";

// ----- User type definition -----
interface User {
    id: string;
    name: string;
    userName: string;
    college: string;
    email: string;
    phoneNumber: string;
}


const InfoTable: React.FC = () => {
    const navigate = useNavigate();

    // ----- Local state -----
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userLists, setUserLists] = useState<User[]>([]);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<number[]>([1]); // List of pages based on has more flag
    const limit = 10; // Items per page

    // ----- GraphQL data fetching -----
    const { data, loading, error, refetch } = useQuery(GET_ALL_USER_LIST, {
        variables: {
            page,
            limit,
            search: "",
        },
        fetchPolicy: "cache-and-network",
    });


    // ----- Discover new pages if 'hasMore' is true -----
    useEffect(() => {
        if (data?.getAllUserList?.hasMore) {
            setHasMore((prevPages) => {
                const nextPage = page + 1;
                return prevPages.includes(nextPage)
                    ? prevPages
                    : [...prevPages, nextPage];
            });
        }
    }, [data?.getAllUserList?.hasMore, page]);


    // ----- Update user list on data fetch -----
    useEffect(() => {
        if (data?.getAllUserList?.userList) {
            setUserLists(data.getAllUserList.userList);
        }
    }, [data]);


    // ----- Navigate to user detail page -----
    const handleRowClick = (studentId: string) => {
        navigate(`/user-details/${studentId}`);
    };


    // ----- Toggle dropdown sort menu -----
    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };


    // ----- Handle pagination navigation -----
    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || (newPage > hasMore.length && !data?.getAllUserList?.hasMore)) return;
        setPage(newPage);
        refetch({ page: newPage, limit, search: "" });
    };


    // ----- Render pagination buttons with ellipsis for large page sets -----
    const renderPagination = () => {
        const totalPages = hasMore.length;
        const maxVisible = 3;
        const paginationButtons: (number | string)[] = [];

        if (totalPages <= maxVisible) {
            paginationButtons.push(...hasMore);
        } else {
            paginationButtons.push(1); // Always show first

            if (page > 3) paginationButtons.push("...");

            const start = Math.max(2, page - 1);
            const end = Math.min(totalPages - 1, page + 1);

            for (let i = start; i <= end; i++) {
                if (i !== 1 && i !== totalPages) {
                    paginationButtons.push(i);
                }
            }

            if (page < totalPages - 2) paginationButtons.push("...");

            if (!paginationButtons.includes(totalPages)) {
                paginationButtons.push(totalPages);
            }
        }

        return paginationButtons.map((btn, index) => {
            if (btn === "...") {
                return (
                    <span key={`ellipsis-${index}`} className="text-white px-2">
                        ...
                    </span>
                );
            }

            const pageNumber = btn as number;
            const isActive = page === pageNumber;

            return (
                <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`text-sm px-3 py-1 rounded-md transition-colors duration-200 ${isActive
                        ? "bg-primary text-white"
                        : "bg-background-light border border-border-muted text-white hover:bg-background-muted"
                        }`}
                >
                    {pageNumber}
                </button>
            );
        });
    };


    // ----- Loading State -----
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Lottie animationData={Hammer} loop />
            </div>
        );
    }


    // ----- Error State -----
    if (error) {
        return (
            <p className="text-danger text-description-regular text-center py-8">
                Failed to load users.
            </p>
        );
    }

    return (
        <div className="overflow-hidden shadow relative rounded-lg border border-border-muted/20">
            <table className="min-w-full text-left border-collapse">

                {/* ----- Table Header ----- */}
                <thead className="bg-primary text-white text-sm font-gilroy-semibold">
                    <tr>
                        <th className="py-3.5 pl-4 pr-3 sm:pl-6">S.No</th>
                        <th className="px-3 py-3.5">Full Name</th>
                        <th className="px-3 py-3.5">Username</th>
                        <th className="px-3 py-3.5">
                            <div className="flex items-center gap-1 relative">
                                <span>College/University</span>
                                <button type="button" onClick={toggleDropdown} className="text-white">
                                    {isDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>

                                {/* ----- Dropdown placeholder UI ----- */}
                                {isDropdownOpen && (
                                    <div className="absolute top-7 left-0 bg-background-light border border-muted text-default text-sm rounded-md shadow-lg z-10 w-[180px]">
                                        <ul className="divide-y divide-border-default">
                                            <li className="px-4 py-2 hover:bg-background-active cursor-pointer">Sort A → Z</li>
                                            <li className="px-4 py-2 hover:bg-background-active cursor-pointer">Sort Z → A</li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </th>
                        <th className="px-3 py-3.5">Email ID</th>
                        <th className="px-3 py-3.5">Phone Number</th>
                    </tr>
                </thead>


                {/* ----- Table Body ----- */}
                <tbody className="divide-y divide-border-light bg-white font-gilroy-regular text-sm">
                    {userLists?.map((student, index) => (
                        <tr
                            key={student.id}
                            className="hover:bg-gray-50 cursor-pointer transition"
                            onClick={() => handleRowClick(student.id)}
                        >
                            <td className="py-4 pl-4 pr-3 text-default bg-background-default sm:pl-6">
                                {(page - 1) * limit + index + 1}
                            </td>
                            <td className="px-3 py-4 bg-background-muted text-white">{student.name}</td>
                            <td className="px-3 py-4 bg-background-default text-white">{student.userName}</td>
                            <td className="px-3 py-4 bg-background-muted text-white">{student.college}</td>
                            <td className="px-3 py-4 bg-background-default text-white">{student.email}</td>
                            <td className="px-3 py-4 bg-background-muted text-white">{student.phoneNumber}</td>
                        </tr>
                    ))}

                    {userLists.length === 0 && (
                        <tr>
                            <td colSpan={6} className="text-center py-4 text-muted">
                                No users found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>


            {/* ----- Pagination Footer ----- */}
            <div className="flex justify-between items-center px-4 py-3 border-t border-border-muted/20 bg-background-default">
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="text-sm px-3 py-1 rounded bg-primary text-white disabled:opacity-40"
                >
                    Previous
                </button>

                <div className="flex gap-2">{renderPagination()}</div>

                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={!data?.getAllUserList?.hasMore}
                    className="text-sm px-3 py-1 rounded bg-primary text-white disabled:opacity-40"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default InfoTable;