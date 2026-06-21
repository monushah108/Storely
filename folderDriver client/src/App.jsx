import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./pages/register.jsx";
import Login from "./pages/Login.jsx";
import DirectoryView from "./directoryView.jsx";
import "./App.css";
import PasswordForm from "./pages/PasswordForm.jsx";
import privateRoutes from "./admin/routes/privateRoutes.jsx";

import NotFound from "./pages/not-found.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import Guest from "./pages/guest.jsx";
import FileView from "./pages/FileView.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DirectoryView />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/dirItem/:id",
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
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/login/password",
    element: <PasswordForm />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
  privateRoutes(),
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
