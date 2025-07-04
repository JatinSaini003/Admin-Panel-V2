import type { ReactElement } from "react";
import type { RouteObject } from "react-router-dom";

export interface RouteMeta {
    pageName?: string;
    pageDescription?: string;
}

export type CustomRoute = RouteObject & {
    element: ReactElement;
    requiresAuth?: boolean;
    roles?: string[];                   // RBAC Support for future 
    meta?: RouteMeta;
    children?: CustomRoute[];
};
