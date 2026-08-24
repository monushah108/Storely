import { Outlet } from "react-router-dom";

import { useGetAdminCredentialsQuery } from "../../store/slices/AdminSlice";

export default function Settings() {
  const { isLoading, isError } = useGetAdminCredentialsQuery();

  // ========================================
  // LOADING
  // ========================================

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-800">Settings</h1>

          <p className="mt-1 text-sm text-gray-500">Loading settings...</p>
        </div>
      </div>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (isError) {
    return (
      <div className="w-full">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm font-medium text-red-700">
            Failed to load settings.
          </p>

          <p className="mt-1 text-xs text-red-500">
            Please refresh the page and try again.
          </p>
        </div>
      </div>
    );
  }

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Settings</h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your admin panel security and temporary access.
        </p>
      </div>

      <Outlet />
    </div>
  );
}
