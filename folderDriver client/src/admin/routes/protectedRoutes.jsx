import React from "react";
import { Navigate, useLocation, Link } from "react-router-dom";
import { ShieldCheck, ShieldAlert, ArrowLeft, Loader2, Cloud } from "lucide-react";
import { useGetProfileQuery } from "../../store/slices/AdminSlice";

/**
 * Route guard for Admin routes.
 * Ensures the user is authenticated and possesses 'owner' or 'admin' role.
 */
export default function ProtectedRoutes({ children }) {
  const location = useLocation();
  const { data: user, isLoading, isError } = useGetProfileQuery();

  // Still checking authentication and role permissions
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-4 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-xl shadow-blue-500/25 ring-8 ring-blue-500/10">
            <ShieldCheck size={32} className="text-white" />
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900">
              <span className="h-3 w-3 animate-ping rounded-full bg-blue-400" />
            </span>
          </div>

          <div className="text-center">
            <h2 className="text-base font-semibold tracking-tight text-white">
              Storely Administration
            </h2>
            <p className="mt-1 flex items-center justify-center gap-2 text-xs text-slate-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-400" />
              Verifying administrative credentials...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated / profile request failed -> Redirect to login
  if (isError || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // User is authenticated, but doesn't have owner or admin privileges (403 Forbidden)
  if (!["owner", "admin"].includes(user.role)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12 text-slate-800">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg shadow-slate-100">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-8 ring-amber-500/10">
            <ShieldAlert size={28} />
          </div>

          <h1 className="mt-5 text-xl font-bold tracking-tight text-slate-900">
            Admin Access Required
          </h1>

          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            You are signed in as <span className="font-semibold text-slate-700">{user.email}</span>, but your account does not have administrative privileges for the Storely Admin Suite.
          </p>

          <div className="mt-6 flex flex-col gap-2.5">
            <Link
              to="/dashboard"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 active:scale-[0.99]"
            >
              <Cloud size={16} />
              <span>Go to My Drive</span>
            </Link>

            <Link
              to="/"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
