import React, { createContext, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { ADMIN_LOGIN, GET_ADMIN_PROFILE } from "../queries/authQueries.ts";
import { getToken, setToken, clearToken } from "./authUtils";

type User = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    profilePicId: string;
    __typename?: string;
};

type AuthContextType = {
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    refetchProfile: () => Promise<void>;
};


/**
 * Creating Auth Context
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);


/**
 * AuthProvider manages user login state using GraphQL and cookies.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const [loginMutation] = useMutation(ADMIN_LOGIN);

    const [fetchProfile, { refetch }] = useLazyQuery(GET_ADMIN_PROFILE, {
        fetchPolicy: "network-only",
        onCompleted: (data) => {
            setUser(data.getAdminProfile.user);
            setLoading(false);
        },
        onError: () => {
            clearToken();
            setUser(null);
            setLoading(false);
        },
    });

    const refetchProfile = async () => {
        try {
            const { data } = await refetch(); // Explicit refetch
            if (data?.getAdminProfile?.user) {
                setUser(data.getAdminProfile.user);
            } else {
                // fallback: re-trigger the query manually
                await fetchProfile();
            }
        } catch {
            setUser(null);
            clearToken();
        }
    };

    /**
     * Handles login and token setting
     */
    const login = async (email: string, password: string) => {
        if (!email.endsWith("@peerhub.in")) {
            throw new Error("Only @peerhub.in emails are allowed.");
        }

        const { data } = await loginMutation({ variables: { email, password } });
        if (data?.adminLogin?.accessToken) {
            setToken(data.adminLogin.accessToken);
            await fetchProfile(); // Get full user info
        } else {
            throw new Error("Invalid login response.");
        }
    };

    /**
     * Logout clears token and user state
     */
    const logout = () => {
        clearToken();
        setUser(null);
    };

    /**
     * On mount, fetch profile if token exists
     */
    useEffect(() => {
        const token = getToken();
        if (token) {
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, logout, refetchProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
