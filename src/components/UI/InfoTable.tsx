import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import Hammer from "../../assets/Loader/Hammer.json";
import { useQuery } from "@apollo/client";
import { GET_ALL_USER_LIST } from "../../queries/userQueries";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useGlobalSearch } from "../../search/SearchContext";


// ----- User type definition -----
interface User {
    id: string;
    name: string;
    userName: string;
    college: string;
    email: string;
    phoneNumber: string;
}

// ----- Props definition for InfoTable -----
interface InfoTableProps {
    limit?: number;
}


const InfoTable: React.FC<InfoTableProps> = ({ limit = 10 }) => {
    const navigate = useNavigate();
    const { searchQuery } = useGlobalSearch();

    // ----- Local state -----
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userLists, setUserLists] = useState<User[]>([]);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<number[]>([1]); // List of pages based on has more flag
    const [collegeSearch, setCollegeSearch] = useState("");
    const [selectedCollege, setSelectedCollege] = useState<string | null>(null);

    // ----- GraphQL data fetching -----
    const { data, loading, error, refetch } = useQuery(GET_ALL_USER_LIST, {
        variables: {
            page,
            limit,
            search: searchQuery,
            filter: {
                college: selectedCollege || null
            }
        },
        fetchPolicy: "cache-and-network",
    });

    // when college changes, reset page
    useEffect(() => {
        setPage(1);
    }, [selectedCollege]);

    // Refetch whenever searchQuery changes
    useEffect(() => {
        const delay = setTimeout(() => {
            refetch({ page: 1, limit, search: searchQuery });
            setPage(1); // Reset pagination on new search
        }, 300);

        return () => clearTimeout(delay);
    }, [searchQuery]);

    // ----- Discover new pages if 'hasMore' is true -----
    useEffect(() => {
        const currentList = data?.getAllUserList?.userList || [];
        const more = data?.getAllUserList?.hasMore;

        if (more && currentList.length > 0) {
            const nextPage = page + 1;

            setHasMore((prev) =>
                prev.includes(nextPage) ? prev : [...prev, nextPage]
            );
        }
    }, [data, page]);



    // ----- Update user list on data fetch -----
    useEffect(() => {
        if (!data?.getAllUserList?.userList) return;

        const allUsers = data.getAllUserList.userList;

        if (selectedCollege) {
            const filtered = allUsers.filter((user: User) =>
                user.college.toLowerCase().includes(selectedCollege.toLowerCase())
            );
            setUserLists(filtered);
        } else {
            setUserLists(allUsers);
        }
    }, [data, selectedCollege]);



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
        refetch({ page: newPage, limit, search: searchQuery });
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
        <div className="overflow-visible shadow relative rounded-lg border border-border-muted/20">
            <table className="min-w-full text-left border-collapse">

                {/* ----- Table Header ----- */}
                <thead className="bg-primary text-white text-sm font-gilroy-semibold">
                    <tr>
                        <th className="py-3.5 pl-4 pr-3 sm:pl-6">S.No</th>
                        <th className="px-3 py-3.5">Full Name</th>
                        <th className="px-3 py-3.5">Username</th>
                        <th className="px-3 py-3.5">
                            <div className="flex items-center gap-1 relative z-20">
                                <span>
                                    {selectedCollege ? `College: ${selectedCollege}` : "College/University"}
                                </span>
                                <button type="button" onClick={toggleDropdown} className="text-white">
                                    {isDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>

                                {/* ----- Dropdown UI ----- */}
                                {isDropdownOpen && (
                                    <div className="absolute top-full mt-2 left-0 z-50 bg-background-light border border-muted text-default text-sm rounded-md shadow-xl w-[220px] overflow-visible">
                                        {/* Search Input */}
                                        <div className="px-3 py-2">
                                            <input
                                                type="text"
                                                placeholder="Search college..."
                                                className="w-full px-2 py-1 text-sm border rounded bg-background-muted text-white placeholder:text-muted"
                                                value={collegeSearch}
                                                onChange={(e) => setCollegeSearch(e.target.value)}
                                            />
                                        </div>

                                        {/* College List */}
                                        <ul className="max-h-40 overflow-y-auto divide-y divide-border-default">
                                            {/* Reset Option */}
                                            <li
                                                className="px-4 py-2 hover:bg-background-active cursor-pointer text-muted"
                                                onClick={() => {
                                                    setSelectedCollege(null);
                                                    setCollegeSearch("");
                                                    setIsDropdownOpen(false);
                                                }}
                                            >
                                                All Colleges
                                            </li>

                                            {/* Filtered Colleges */}
                                            {[...new Set((data?.getAllUserList?.userList as User[] || []).map((u) => u.college))]
                                                .filter((college) =>
                                                    college.toLowerCase().includes(collegeSearch.toLowerCase())
                                                )
                                                .sort()
                                                .map((college, idx) => (
                                                    <li
                                                        key={idx}
                                                        className={`px-4 py-2 cursor-pointer hover:bg-background-active ${selectedCollege === college ? "bg-primary text-white" : ""
                                                            }`}
                                                        onClick={() => {
                                                            setSelectedCollege(college);
                                                            setCollegeSearch("");
                                                            setIsDropdownOpen(false);

                                                            refetch({
                                                                variable: {
                                                                    search: searchQuery,
                                                                    filter: {
                                                                        college: selectedCollege || null
                                                                    }
                                                                },
                                                            })
                                                        }}
                                                    >
                                                        {college}
                                                    </li>
                                                ))}

                                            {/*No Match Message */}
                                            {[...new Set((data?.getAllUserList?.userList as User[] || []).map((u) => u.college))]
                                                .filter((college) =>
                                                    college.toLowerCase().includes(collegeSearch.toLowerCase())
                                                ).length === 0 && (
                                                    <li className="px-4 py-2 text-muted text-sm text-center">
                                                        No colleges found.
                                                    </li>
                                                )}
                                        </ul>
                                    </div>
                                )}
                            </div>

                        </th>
                        <th className="px-3 py-3.5">Email ID</th>
                        <th className="px-3 py-3.5 text-nowrap">Phone Number</th>
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
            {hasMore.length > 1 && (
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
            )}
        </div>
    );
};

export default InfoTable;