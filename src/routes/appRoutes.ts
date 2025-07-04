import publicRoutes from "./publicRoutes";
import protectedRoutes from "./protectedRoutes";
import type { CustomRoute } from "./route.types";

/**
 * Combine all application routes
 */
const appRoutes: CustomRoute[] = [...publicRoutes, ...protectedRoutes];

export default appRoutes;
