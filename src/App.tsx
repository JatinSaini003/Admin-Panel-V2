import { RouterProvider } from "react-router-dom";
import router from "./routes/appRoutes";
import { SearchProvider } from "./search/SearchContext";
import { useEffect } from "react";

/**
 * Main Application Entry
 * Contains all route definitions wrapped inside layout/auth guards.
 */
function App() {
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]; // e.g., "2025-07-30"
    const lastVisit = localStorage.getItem('lastVisitDate');

    if (lastVisit !== today) {
      fetch(`https://api-prod.peerhub.in/visitor/log-visit`, {
        method: 'POST',
      });
      localStorage.setItem('lastVisitDate', today);
    }
  }, [])

  return (
    <SearchProvider>
      <RouterProvider router={router} />
    </SearchProvider>
  );
}

export default App;