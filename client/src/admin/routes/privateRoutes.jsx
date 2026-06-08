import UsersPage from "../pages/UsersPage.jsx";
import RecoverUserPage from "../pages/RecoverUserPage.jsx";
import AdminLayout from "../pages/AdminLayout.jsx";
import UserFileExplorer from "../pages/UserFileExplorer.jsx";
import StaffManagement from "../pages/StaffeManagement.jsx";
import ProtectedRoutes from "./protectedRoutes.jsx";

export default function privateRoutes() {
  return {
    path: "/users",

    element: (
      <ProtectedRoutes>
        <AdminLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        index: true,
        element: <UsersPage />,
      },
      {
        path: "recover",
        element: <RecoverUserPage />,
      },
      {
        path: "staffes",
        element: <StaffManagement />,
      },
      {
        path: "data/:userId",
        element: <UserFileExplorer />,
      },
      {
        path: "data/:userId/:dirId",
        element: <UserFileExplorer />,
      },
    ],
  };
}
