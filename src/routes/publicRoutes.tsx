import type { CustomRoute } from "./route.types";
import Login from "../components/Login/Login";

const publicRoutes: CustomRoute[] = [
    {
        path: "/login",
        element: <Login />,
    },
];

export default publicRoutes;
