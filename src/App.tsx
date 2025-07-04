// function App() {
//   return (
//     <>
//       <div className="bg-background-default text-primary h-screen flex items-center justify-center text-display">
//         Welcome to PeerHub Admin Panel
//       </div>
//     </>
//   )
// }

// export default App


import RouteWrapper from "./routes/RouteWrapper";
import appRoutes from "./routes/appRoutes";


/**
 * Main Application Entry
 * Contains all route definitions wrapped inside layout/auth guards.
 */
function App() {
  return <RouteWrapper routes={appRoutes} />;
}

export default App;