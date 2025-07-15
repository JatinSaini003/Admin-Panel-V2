import { RouterProvider } from "react-router-dom";
import router from "./routes/appRoutes";


/**
 * Main Application Entry
 * Contains all route definitions wrapped inside layout/auth guards.
 */
function App() {
  return <RouterProvider router={router} />;
}

export default App;