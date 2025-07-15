import type { CustomRoute } from "./route.types";
import PrivateRoute from "./PrivateRoute/PrivateRoute";


/**
 * Recursively process route config and wrap with PrivateRoute if needed.
 */
const RouteWrapper = (routes: CustomRoute[]): any =>
    routes.map(({ requiresAuth, roles, meta, children, ...route }) => {
        const element = requiresAuth ? (
            <PrivateRoute allowedRoles={roles}>{route.element}</PrivateRoute>
        ) : (
            route.element
        );

        return {
            ...route,
            element,
            handle: meta,
            children: children ? RouteWrapper(children) : undefined,
        };
    });


export default RouteWrapper;