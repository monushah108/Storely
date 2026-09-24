import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Cloud, Loader2 } from "lucide-react";
import { useFetchUserQuery } from "../../store/slices/UserSlice";

/**
 * Route guard for authenticated user routes (e.g. /dashboard).
 * If the user is unauthenticated, redirects to /auth/login with the original route preserved.
 */
export default function UserProtectedRoute() {
  const location = useLocation();
  const { data: user, isLoading, isError } = useFetchUserQuery();

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8fafd] dark:bg-slate-950 px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/20">
            <Cloud className="h-7 w-7 text-white" />
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white dark:bg-slate-900">
              <span className="h-2.5 w-2.5 animate-ping rounded-full bg-blue-600" />
            </span>
          </div>

          <div className="text-center">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Opening Storely Drive
            </h3>
            <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
              <Loader2 className="h-3 w-3 animate-spin text-blue-600 dark:text-blue-400" />
              Securing session...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
