import Users from "../pages/Users.jsx";
import Recover from "../pages/recover.jsx";
import Layout from "../pages/layout.jsx";
import FileExplorer from "../pages/fileExplorer.jsx";

import ProtectedRoutes from "./protectedRoutes.jsx";
import GrantAdminAccess from "../pages/grantAcess.jsx";
import Settings from "../pages/settings.jsx";
import AdminAccessVerify from "../pages/verifyAccess.jsx";
import ErrorPage from "../../pages/ErrorPage.jsx";
import ChangeCredentials from "../pages/changeCredentials.jsx";
import AdminCredentials from "../components/adminCredentials.jsx";

export default function privateRoutes() {
  return [
    {
      path: "/admin",
      element: (
        <ProtectedRoutes>
          <Layout />
        </ProtectedRoutes>
      ),
      errorElement: <ErrorPage />,

      children: [
        {
          index: true,
          element: <Users />,
        },

        {
          path: "recover",
          element: <Recover />,
        },

        {
          path: "access",
          element: <GrantAdminAccess />,
        },

        {
          path: "data/:userId",
          element: <FileExplorer />,
          children: [
            {
              path: ":dirId",
              element: <FileExplorer />,
            },
          ],
        },

        // =========================
        // SETTINGS
        // =========================
        {
          path: "settings",
          element: <Settings />,
          children: [
            {
              index: true,
              element: <AdminCredentials />,
            },
            {
              path: "change-password",
              element: <ChangeCredentials />,
            },
          ],
        },
      ],
    },

    // =========================
    // TEMPORARY ADMIN ACCESS
    // =========================
    {
      path: "/admin/verify/:token",
      element: <AdminAccessVerify />,
      errorElement: <ErrorPage />,
    },
  ];
}
