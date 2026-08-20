import React, { useState } from "react";
import {
  useFetchUserQuery,
  useLogoutMutation,
} from "../../store/slices/UserSlice";
import { ChevronDown, HardDrive, Settings } from "lucide-react";
import { FaSignOutAlt, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Profile() {
  const [open, setOpen] = useState(false);
  const { data, error } = useFetchUserQuery();
  const [logout, { isLoading: isLogoutLoading }] = useLogoutMutation();

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout().unwrap();

      setOpen(false);
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };
  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) {
      return "0 Bytes";
    }

    const units = ["Bytes", "KB", "MB", "GB", "TB"];

    const index = Math.min(
      Math.floor(Math.log(bytes) / Math.log(1024)),
      units.length - 1,
    );

    return `${(bytes / Math.pow(1024, index)).toFixed(1)} ${units[index]}`;
  };

  const storagePercentage = Math.min(data?.storage?.percentage || 0, 100);

  if (!data) return;
  return (
    <div className="relative ml-0.5 sm:ml-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open user menu"
        aria-expanded={open}
        className="
                    flex items-center gap-1.5
                    rounded-xl
                    border border-transparent
                    p-1
                    transition
                    hover:border-gray-200
                    hover:bg-gray-50
                    sm:gap-2
                    sm:pr-2
                  "
      >
        {/* Avatar */}
        <div
          className="
                      flex
                      h-9 w-9
                      shrink-0
                      items-center justify-center
                      overflow-hidden
                      rounded-full
                      border border-gray-200
                      bg-gray-100
                      sm:h-10
                      sm:w-10
                    "
        >
          {data.picture ? (
            <img
              src={data.picture}
              alt={data.name || "User"}
              className="h-full w-full object-cover"
            />
          ) : (
            <FaUser className="text-xs text-gray-400 sm:text-sm" />
          )}
        </div>

        {/* User info */}
        <div className="hidden max-w-[120px] text-left md:block">
          <p className="truncate text-sm font-semibold text-gray-800">
            {data.name || "User"}
          </p>

          <p className="text-[11px] text-gray-400">Account</p>
        </div>

        <ChevronDown
          size={14}
          className={`
                      hidden
                      text-gray-400
                      transition-transform
                      md:block
                      ${open ? "rotate-180" : ""}
                    `}
        />
      </button>

      {/* ================= DROPDOWN ================= */}
      {open && (
        <div
          className="
                      absolute right-0 top-full z-50 mt-2
                      w-[calc(100vw-24px)]
                      max-w-[310px]
                      overflow-hidden
                      rounded-2xl
                      border border-gray-200
                      bg-white
                      shadow-[0_20px_60px_rgba(0,0,0,0.14)]
                      animate-in
                      fade-in
                      zoom-in-95
                      duration-150

                      sm:mt-3
                      sm:w-[310px]
                    "
        >
          {/* Profile */}
          <div className="bg-gradient-to-br from-blue-50 via-white to-white p-4">
            <div className="flex items-center gap-3">
              <div
                className="
                            flex h-11 w-11
                            shrink-0
                            items-center justify-center
                            overflow-hidden
                            rounded-full
                            border-2
                            border-white
                            bg-gray-100
                            shadow-sm
                            sm:h-12
                            sm:w-12
                          "
              >
                {data.picture ? (
                  <img
                    src={data.picture}
                    alt={data.name || "User"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FaUser className="text-gray-400" />
                )}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {data.name || "User"}
                </p>

                <p className="mt-0.5 truncate text-xs text-gray-500">
                  {data.email}
                </p>
              </div>
            </div>
          </div>

          {/* Storage */}
          {data.storage && (
            <div className="border-t border-gray-100 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <HardDrive size={15} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-800">
                      Storage
                    </p>

                    <p className="text-[10px] text-gray-400">Cloud space</p>
                  </div>
                </div>

                <span className="ml-2 shrink-0 text-xs font-semibold text-gray-600">
                  {storagePercentage.toFixed(1)}%
                </span>
              </div>

              {/* Progress */}
              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    storagePercentage >= 90
                      ? "bg-red-500"
                      : storagePercentage >= 70
                        ? "bg-yellow-500"
                        : "bg-blue-600"
                  }`}
                  style={{
                    width: `${storagePercentage}%`,
                  }}
                />
              </div>

              {/* Storage numbers */}
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="truncate text-[11px] text-gray-400">
                  {formatBytes(data.storage.used)} used
                </span>

                <span className="shrink-0 text-[11px] text-gray-400">
                  {formatBytes(data.storage.limit)}
                </span>
              </div>

              <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2">
                <p className="text-xs text-gray-500">
                  <span className="font-semibold text-gray-700">
                    {formatBytes(data.storage.remaining)}
                  </span>{" "}
                  available
                </p>
              </div>
            </div>
          )}

          {/* Menu */}
          <div className="border-t border-gray-100 p-2">
            <button
              type="button"
              className="
                          flex w-full items-center gap-3
                          rounded-lg
                          px-3 py-2.5
                          text-sm
                          text-gray-600
                          transition
                          hover:bg-gray-50
                          hover:text-gray-900
                        "
            >
              <Settings size={16} />
              Account settings
            </button>

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLogoutLoading}
              className="
                          flex w-full items-center gap-3
                          rounded-lg
                          px-3 py-2.5
                          text-sm
                          text-gray-600
                          transition
                          hover:bg-red-50
                          hover:text-red-600
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
            >
              <FaSignOutAlt size={15} />

              {isLogoutLoading ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
