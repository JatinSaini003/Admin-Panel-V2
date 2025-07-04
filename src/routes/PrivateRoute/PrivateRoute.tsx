import { Navigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import React from "react";

type Props = {
    allowedRoles?: string[];
    children: React.ReactNode;
};

const PrivateRoute: React.FC<Props> = ({ allowedRoles, children }) => {
    const { user, loading } = useAuth();

    if (loading) return <div className="text-default bg-background-default p-4">Loading...</div>;

    if (!user || !user.email.endsWith("@peerhub.in")) {
        return <Navigate to="/login" replace />;
    }

    // RBAC support for 
    if (allowedRoles && !allowedRoles.includes(user.__typename || "")) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
};

export default PrivateRoute;
