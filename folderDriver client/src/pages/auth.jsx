import React from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { ArrowRight, Cloud, Loader2 } from "lucide-react";
import { useFetchUserQuery } from "../store/slices/UserSlice";
import SEO from "../components/common/SEO";

export default function Auth() {
  const navigate = useNavigate();
  const { data, isLoading } = useFetchUserQuery();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafd]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-xs font-medium text-gray-500">Checking session...</p>
        </div>
      </div>
    );
  }

  if (data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafd] px-4 py-8">
        <SEO
          title="Account - Storely"
          description="Your active Storely session."
          noIndex={true}
        />
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Cloud className="h-7 w-7" />
          </div>

          <h1 className="mt-5 text-xl font-bold text-gray-900 sm:text-2xl">
            You&apos;re already signed in
          </h1>

          <p className="mt-2 text-xs leading-relaxed text-gray-500 sm:text-sm">
            Welcome back, <span className="font-semibold text-gray-700">{data.name || "there"}</span>. You can continue directly to your Storely dashboard.
          </p>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-blue-700 active:scale-[0.99]"
          >
            <span>Go to dashboard</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
