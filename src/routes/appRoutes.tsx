import publicRoutes from "./publicRoutes";
import protectedRoutes from "./protectedRoutes";
import type { CustomRoute } from "./route.types";
import { createBrowserRouter } from "react-router-dom";
import RouteWrapper from "./RouteWrapper";

/**
 * Combine all application routes
 */
const appRoutes: CustomRoute[] = [...publicRoutes, ...protectedRoutes];


// Use RouteWrapper to apply requiresAuth logic
const router = createBrowserRouter(RouteWrapper(appRoutes), { future: { v7_startTransition: true } as any });

export default router;
