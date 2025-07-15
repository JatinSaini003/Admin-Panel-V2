import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./apollo/client";
import App from "./App";
import "./styles/index.css";
import { AuthProvider } from "./auth/AuthProvider";
import GlobalErrorBoundary from "./utils/ErrorHandlers/GlobalErrorBoundary";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* Apollo GraphQL Provider */}
    <ApolloProvider client={apolloClient}>

      {/* Auth Context provider (Manages auth states) */}
      <AuthProvider>

        {/* Global error boundary for handling unexpected errors */}
        <GlobalErrorBoundary>

          <App />
          <ToastContainer position="top-right" autoClose={3000} theme="colored" closeOnClick={true} pauseOnHover={true} draggable={true} />

        </GlobalErrorBoundary>
      </AuthProvider>
    </ApolloProvider>
  </React.StrictMode>
);
