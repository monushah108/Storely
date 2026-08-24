import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaLock, FaEye, FaEyeSlash, FaKey, FaClock } from "react-icons/fa";
import { toast } from "sonner";

import NotFound from "../../pages/not-found.jsx";
import {
  useGetProfileQuery,
  useRedeemAdminAccessMutation,
  useVerfiyAccessTokenQuery,
} from "../../store/slices/AdminSlice.js";

export default function AdminAccessVerify() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [access, setAccess] = useState(null);
  const { data: user } = useGetProfileQuery();
  // ========================================
  // VERIFY TOKEN
  // ========================================

  const {
    data: tokenData,
    isLoading: checkingToken,
    isError: tokenError,
  } = useVerfiyAccessTokenQuery(
    { token },
    {
      skip: !token,
    },
  );

  // ========================================
  // REDEEM ADMIN ACCESS
  // ========================================

  const [redeemAdminAccess] = useRedeemAdminAccessMutation();

  // ========================================
  // PASSWORD SUBMIT
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token || !tokenData?.valid) {
      return;
    }

    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    try {
      setVerifying(true);

      const res = await redeemAdminAccess({
        token,
        password,
      }).unwrap();

      toast.success("Admin access verified");

      if (res.access == "granted") {
        navigate("/admin", {
          replace: true,
        });

        return;
      }

      setAccess("pending");
    } catch (error) {
      console.error("Failed to redeem admin access:", error);

      toast.error(
        error?.data?.message ||
          error?.message ||
          "Password verification failed",
      );
    } finally {
      setVerifying(false);
    }
  };

  // ========================================
  // CHECKING TOKEN
  // ========================================

  if (checkingToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-sm text-gray-500">Verifying access link...</div>
      </div>
    );
  }

  if (access) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            {/* Header */}
            <div className="border-b border-gray-200 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                  <FaClock size={15} className="text-gray-500" />
                </div>

                <div>
                  <h1 className="text-lg font-semibold text-slate-800">
                    Access Pending
                  </h1>

                  <p className="mt-0.5 text-xs text-gray-400">
                    Your admin access is being processed.
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                <p className="text-xs font-medium text-slate-700">
                  Access request pending
                </p>

                <p className="mt-1 text-[11px] leading-5 text-gray-400">
                  Your password was verified successfully. Please wait for admin
                  access to be activated.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // INVALID TOKEN
  // ========================================

  if (tokenData?.valid && ["owner", "admin"].includes(user.role)) {
    navigate("/admin", {
      replace: true,
    });
  }

  if (tokenError || !tokenData?.valid) {
    return <NotFound />;
  }

  // ========================================
  // VALID TOKEN
  // ========================================

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                <FaKey size={15} className="text-gray-500" />
              </div>

              <div>
                <h1 className="text-lg font-semibold text-slate-800">
                  Admin Access
                </h1>

                <p className="mt-0.5 text-xs text-gray-400">
                  Verify your password to continue.
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6">
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-500">
                Admin password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  disabled={verifying}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 pr-10 text-sm text-slate-700 outline-none transition placeholder:text-gray-300 focus:border-gray-400 disabled:cursor-not-allowed disabled:bg-gray-50"
                />

                <button
                  type="button"
                  disabled={verifying}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600 disabled:cursor-not-allowed"
                >
                  {showPassword ? (
                    <FaEyeSlash size={14} />
                  ) : (
                    <FaEye size={14} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={verifying}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 text-xs font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaLock size={11} />

              {verifying ? "Verifying..." : "Verify & Continue"}
            </button>

            <p className="mt-4 text-center text-[11px] leading-5 text-gray-400">
              Your password is verified securely and is never stored in your
              browser.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
