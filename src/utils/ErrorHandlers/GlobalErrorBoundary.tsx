import React, { type ErrorInfo } from "react";

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class GlobalErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error("🌍 Global Error Boundary Caught:", error, info);
    }

    handleReset = () => {
        // You could optionally clear app state from localStorage or Redux here
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-background-default px-4 text-center">
                    <h1 className="text-display text-primary mb-2">Oops! Something went wrong.</h1>
                    <p className="text-description-regular text-muted mb-6 max-w-md">
                        We encountered an unexpected error. Please try refreshing the page or come back later.
                    </p>
                    <button
                        onClick={this.handleReset}
                        className="px-6 py-3 rounded-xl font-gilroySemiBold bg-primary text-white hover:bg-secondary transition"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default GlobalErrorBoundary;
