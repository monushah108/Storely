import React from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { ArrowRight, Cloud } from "lucide-react";
import { useFetchUserQuery } from "../store/slices/UserSlice";

export default function Auth() {
  const navigate = useNavigate();
  const { data, isLoading } = useFetchUserQuery();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  if (data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50">
            <Cloud className="h-7 w-7 text-blue-600" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            You're already signed in
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Welcome back, {data.name || "there"}. You can continue directly to
            your Storely dashboard.
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-blue-600
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-blue-700
            "
          >
            Go to dashboard
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
