import { createBrowserRouter } from "react-router-dom";
import Login from "./features/auth/pages/Login.jsx";
import Register from "./features/auth/pages/Register.jsx";
import Protected from "./features/auth/components/Protected.jsx";
import Home from "./features/interview/pages/Home.jsx";
import Interview from "./features/interview/pages/interview.jsx";
import NotFound from "./pages/NotFound.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

const handleError = (error) => {
  console.error("Route error:", error);
  return (
    <ErrorBoundary error={error} reset={() => (window.location.href = "/")} />
  );
};

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    errorElement: (
      <ErrorBoundary reset={() => (window.location.href = "/login")} />
    ),
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: (
      <ErrorBoundary reset={() => (window.location.href = "/register")} />
    ),
  },
  {
    path: "/",
    element: (
      <Protected>
        <Home />
      </Protected>
    ),
    errorElement: <ErrorBoundary reset={() => (window.location.href = "/")} />,
  },
  {
    path: "/interview/:interviewId",
    element: (
      <Protected>
        <Interview />
      </Protected>
    ),
  },
]);
