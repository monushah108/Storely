import Users from "../pages/Users.jsx";
import Recover from "../pages/recover.jsx";
import Layout from "../pages/layout.jsx";
import FileExplorer from "../pages/fileExplorer.jsx";
import Staff from "../pages/staff.jsx";
import ProtectedRoutes from "./protectedRoutes.jsx";

export default function privateRoutes() {
  return {
    path: "/users",

    element: (
      <ProtectedRoutes>
        <Layout />
      </ProtectedRoutes>
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
        path: "staffes",
        element: <Staff />,
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
    ],
  };
}
