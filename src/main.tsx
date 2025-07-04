import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "./apollo/client";
import App from "./App";
import "./styles/index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* Apollo GraphQL Provider */}
    <ApolloProvider client={apolloClient}>

      {/* React Router for handling proper routing */}
      <BrowserRouter>

        {/* Auth Context provider (Manages auth states) */}
        <AuthProvider>

          <App />
          <ToastContainer />

        </AuthProvider>
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);
