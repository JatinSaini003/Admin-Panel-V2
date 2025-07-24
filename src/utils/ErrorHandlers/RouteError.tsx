import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router-dom";

export default function RouteError() {
    const error = useRouteError();
    const navigate = useNavigate()

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background-default text-center text-default px-4">
            <h1 className="text-display text-primary mb-2">Something went wrong.</h1>
            <p className="text-description-regular text-muted mb-4">
                {isRouteErrorResponse(error)
                    ? `${error.status} - ${error.statusText}`
                    : "An unexpected error occurred."}
            </p>

            <button
                onClick={() => navigate("/")}
                className="mt-4 px-6 py-3 rounded-xl font-gilroySemiBold bg-primary text-white hover:bg-secondary transition"
            >
                Go to Dashboard
            </button>
        </div>
    );
}
