import { createBrowserRouter, RouterProvider } from "react-router-dom";

import DirectoryView from "./directoryView.jsx";
import "./App.css";
import PasswordForm from "./components/auth/PasswordForm.jsx";
import UserProtectedRoute from "./components/auth/UserProtectedRoute.jsx";
import privateRoutes from "./admin/routes/privateRoutes.jsx";

import NotFound from "./pages/not-found.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import Guest from "./pages/guest.jsx";
import FileView from "./pages/FileView.jsx";
import Home from "./pages/home.jsx";
import Auth from "./pages/auth.jsx";
import Login from "./components/auth/Login.jsx";
import Register from "./components/auth/register.jsx";

const router = createBrowserRouter([
  // Public Landing Page
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },

  // Authentication Flow
  {
    path: "/auth",
    element: <Auth />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login/password",
        element: <PasswordForm />,
      },
    ],
  },

  // Protected User Cloud Drive Routes
  {
    element: <UserProtectedRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/dashboard",
        element: <DirectoryView />,
      },
      {
        path: "/dashboard/dirItem/:id",
        element: <DirectoryView />,
      },
    ],
  },

  // Direct File Preview (Shared / Protected)
  {
    path: "/file/:id",
    element: <FileView />,
    errorElement: <ErrorPage />,
  },

  // Public/Guest Share Link Preview
  {
    path: "/guest/:id",
    element: <Guest />,
    errorElement: <ErrorPage />,
  },

  // Admin Portal Routes (Authenticated + Role Checked)
  ...privateRoutes(),

  // Catch-All 404 Route
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
