import { Navigate } from "react-router-dom";
import { useGetProfileQuery } from "../../store/slices/AdminSlice";
import NotFound from "../../pages/not-found";

export default function ProtectedRoutes({ children }) {
  const { data: user, isLoading, isError } = useGetProfileQuery();

  // Still checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-slate-700" />

          <p className="mt-3 text-sm text-gray-500">Checking access...</p>
        </div>
      </div>
    );
  }

  // Not authenticated / profile request failed
  if (isError || !user) {
    return <Navigate to="/" replace />;
  }

  // User exists but doesn't have permission
  if (!["owner", "admin"].includes(user.role)) {
    return <NotFound />;
  }

  return children;
}
