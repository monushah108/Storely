import { createBrowserRouter, RouterProvider } from "react-router-dom";

import DirectoryView from "./directoryView.jsx";
import "./App.css";
import PasswordForm from "./components/auth/PasswordForm.jsx";
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
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },

  {
    path: "/auth",
    element: <Auth />,
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

  {
    path: "/dashboard",
    element: <DirectoryView />,
    children: [
      {
        path: "dirItem/:id",
        element: <DirectoryView />,
      },
    ],
  },

  {
    path: "/file/:id",
    element: <FileView />,
  },

  {
    path: "/guest/:id",
    element: <Guest />,
  },

  ...privateRoutes(),

  {
    path: "*",
    element: <NotFound />,
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
