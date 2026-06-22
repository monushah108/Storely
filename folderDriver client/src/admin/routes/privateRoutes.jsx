import Users from "../pages/Users.jsx";
import Recover from "../pages/recover.jsx";
import Layout from "../pages/layout.jsx";
import FileExplorer from "../pages/fileExplorer.jsx";
import Staff from "../pages/staff.jsx";
import ProtectedRoutes from "./protectedRoutes.jsx";
import Dashboard from "../pages/dashboard.jsx";

export default function privateRoutes() {
  return {
    path: "/dashboard",

    element: (
      <ProtectedRoutes>
        <Layout />
      </ProtectedRoutes>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "users",
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
