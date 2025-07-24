import { RouterProvider } from "react-router-dom";
import router from "./routes/appRoutes";
import { SearchProvider } from "./search/SearchContext";

/**
 * Main Application Entry
 * Contains all route definitions wrapped inside layout/auth guards.
 */
function App() {
  return (
    <SearchProvider>
      <RouterProvider router={router} />
    </SearchProvider>
  );
}

export default App;