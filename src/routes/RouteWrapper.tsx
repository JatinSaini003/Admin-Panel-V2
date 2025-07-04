import React from "react";
import { useRoutes } from "react-router-dom";
import type { CustomRoute } from "./route.types";
import PrivateRoute from "./PrivateRoute/PrivateRoute";


/**
 * Recursively process route config and wrap with PrivateRoute if needed.
 */
const renderRoutes = (routes: CustomRoute[]): any =>
    routes.map(({ requiresAuth, roles, children, ...route }) => {
        const element = requiresAuth ? (
            <PrivateRoute allowedRoles={roles}>{route.element}</PrivateRoute>
        ) : (
            route.element
        );

        return {
            ...route,
            element,
            children: children ? renderRoutes(children) : undefined,
        };
    });


/**
 * RouteWrapper uses React Router's useRoutes to render all app routes.
 */
const RouteWrapper: React.FC<{ routes: CustomRoute[] }> = ({ routes }) => {
    const renderedRoutes = renderRoutes(routes);
    const element = useRoutes(renderedRoutes);
    return <>{element}</>;
};

export default RouteWrapper;
