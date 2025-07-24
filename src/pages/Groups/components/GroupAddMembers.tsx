import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GET_ALL_USER_LIST } from "../../../queries/userQueries";
import { useGlobalSearch } from "../../../search/SearchContext";
import { useQuery } from "@apollo/client";
import { useLocation } from "react-router-dom";

interface Student {
    id: string;
    name: string;
    userName: string;
    college: string;
    email: string;
    phoneNumber: string;
}

function GroupAddMember() {
    const { searchQuery } = useGlobalSearch();
    const navigate = useNavigate();
    const location = useLocation();
    const selectedMemberIdsFromState = location.state?.selectedMemberIds || [];


    const { data } = useQuery(GET_ALL_USER_LIST, {
        variables: {
            page: 1,
            limit: 100,
            search: searchQuery || "",
        },
    });

    // Use memo to ensure a stable reference
    const users: Student[] = useMemo(
        () => data?.getAllUserList?.userList || [],
        [data]
    );

    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
    const [selectAll, setSelectAll] = useState(false);

    // Keep selectAll in sync when users or selectedUsers change
    useEffect(() => {
        setSelectAll(selectedUsers.size === users.length && users.length > 0);
    }, [selectedUsers, users]);

    useEffect(() => {
        if (selectedMemberIdsFromState.length > 0) {
            setSelectedUsers(new Set(selectedMemberIdsFromState));
        }
    }, [selectedMemberIdsFromState]);


    const toggleUser = (userId: string) => {
        const newSelected = new Set(selectedUsers);
        if (newSelected.has(userId)) {
            newSelected.delete(userId);
        } else {
            newSelected.add(userId);
        }
        setSelectedUsers(newSelected);
    };

    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedUsers(new Set());
        } else {
            setSelectedUsers(new Set(users.map((user) => user.id)));
        }
        setSelectAll(!selectAll);
    };

    const handleAddToGroup = () => {
        const selectedIds = Array.from(selectedUsers);
        navigate("/group/create", { state: { selectedMemberIds: selectedIds } });
    };

    return (
        <div className="bg-background-default px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-slate-800 shadow-xl flex flex-col h-[550px] overflow-hidden">
                    <div className="overflow-y-auto scrollbar-hide flex-1">
                        <table className="w-full">
                            <thead className="bg-[#F3642A] text-white">
                                <tr className="border-b border-white">
                                    <th className="p-4">
                                        <button
                                            onClick={toggleSelectAll}
                                            className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${selectAll
                                                ? "bg-blue-500"
                                                : "border-2 border-white hover:border-blue-400"
                                                }`}
                                        >
                                            {selectAll && <Check className="w-4 h-4 text-white" />}
                                        </button>
                                    </th>
                                    <th className="p-4 text-left text-white text-[16px]">
                                        Full Name
                                    </th>
                                    <th className="p-4 text-left text-white text-[16px]">
                                        Username
                                    </th>
                                    <th className="p-4 text-left text-white text-[16px]">
                                        College
                                    </th>
                                    <th className="p-4 text-left text-white text-[16px]">
                                        Email
                                    </th>
                                    <th className="p-4 text-left text-white text-[16px]">
                                        Phone
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-b border-white hover:bg-slate-700/50 transition-colors"
                                    >
                                        <td className="p-4">
                                            <button
                                                onClick={() => toggleUser(user.id)}
                                                className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${selectedUsers.has(user.id)
                                                    ? "bg-blue-500"
                                                    : "border-2 border-white bg-white hover:border-blue-400"
                                                    }`}
                                            >
                                                {selectedUsers.has(user.id) && (
                                                    <Check className="w-4 h-4 text-white" />
                                                )}
                                            </button>
                                        </td>
                                        <td className="p-4 text-white text-[14px]">{user.name}</td>
                                        <td className="p-4 text-white text-[14px]">
                                            {user.userName}
                                        </td>
                                        <td className="p-4 text-white text-[14px]">
                                            {user.college}
                                        </td>
                                        <td className="p-4 text-white text-[14px]">
                                            {user.email}
                                        </td>
                                        <td className="p-4 text-white text-[14px]">
                                            {user.phoneNumber}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-slate-700 flex justify-between items-center bg-slate-800">
                        <div className="text-slate-300 text-sm">
                            {selectedUsers.size} user{selectedUsers.size !== 1 ? "s" : ""} selected
                        </div>
                        <button
                            onClick={handleAddToGroup}
                            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Add to Group
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GroupAddMember;
