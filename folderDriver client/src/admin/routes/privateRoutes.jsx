import Users from "../pages/Users.jsx";
import Recover from "../pages/recover.jsx";
import Layout from "../pages/layout.jsx";
import FileExplorer from "../pages/fileExplorer.jsx";

import ProtectedRoutes from "./protectedRoutes.jsx";
import GrantAdminAccess from "../pages/grantAcess.jsx";
import Settings from "../pages/settings.jsx";

export default function privateRoutes() {
  return [
    {
      path: "/admin",
      element: (
        // <ProtectedRoutes>
        <Layout />
        // {/* </ProtectedRoutes> */}
      ),
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
        {
          path: "setting",
          element: <Settings />,
        },
      ],
    },
  ];
}
