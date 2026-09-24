import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaLock, FaEye, FaEyeSlash, FaKey, FaClock } from "react-icons/fa";
import { toast } from "sonner";

import NotFound from "../../pages/not-found.jsx";
import {
  useGetProfileQuery,
  useRedeemAdminAccessMutation,
  useVerfiyAccessTokenQuery,
} from "../../store/slices/AdminSlice.js";
import SEO from "../../components/common/SEO";

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
    error: apiError,
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
  // REDIRECT IF ALREADY PRIVILEGED
  // ========================================

  useEffect(() => {
    if (tokenData?.valid && user?.role && ["owner", "admin"].includes(user.role)) {
      navigate("/admin", {
        replace: true,
      });
    }
  }, [tokenData, user, navigate]);

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
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-950">
        <div className="text-sm text-gray-500 dark:text-slate-400">Verifying access link...</div>
      </div>
    );
  }

  if (access) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-slate-950">
        <div className="w-full max-w-md">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
            {/* Header */}
            <div className="border-b border-gray-200 px-6 py-5 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-slate-800">
                  <FaClock size={15} className="text-gray-500 dark:text-slate-400" />
                </div>

                <div>
                  <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    Access Pending
                  </h1>

                  <p className="mt-0.5 text-xs text-gray-400 dark:text-slate-400">
                    Your admin access is being processed.
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-850">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                  Access request pending
                </p>

                <p className="mt-1 text-[11px] leading-5 text-gray-400 dark:text-slate-400">
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
  // AUTHENTICATION REQUIRED (401)
  // ========================================

  const isAuthRequired =
    apiError?.status === 401 ||
    apiError?.data?.message?.toLowerCase().includes("session") ||
    apiError?.data?.message?.toLowerCase().includes("log in");

  if (tokenError && isAuthRequired) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-slate-950">
        <SEO
          title="Sign In Required - Storely"
          description="Sign in to verify your admin access link"
          noIndex={true}
        />
        <div className="w-full max-w-md">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="p-6 text-center sm:p-8">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                <FaLock size={22} />
              </div>

              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Sign In Required
              </h2>

              <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                You must be logged in to your account to verify and redeem this
                administrative delegation key.
              </p>

              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate("/auth/login", { state: { from: `/admin/verify/${token}` } })}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700"
                >
                  Sign In to Continue
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // REVOKED, EXPIRED OR INVALID TOKEN
  // ========================================

  if (tokenError || !tokenData?.valid) {
    const errorMessage =
      apiError?.data?.message || "This access link is invalid, expired, or has been revoked.";

    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-slate-950">
        <SEO
          title="Access Link Revoked - Storely"
          description="Admin delegation link is expired or revoked"
          noIndex={true}
        />
        <div className="w-full max-w-md">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="p-6 text-center sm:p-8">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                <FaLock size={22} />
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-semibold text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400 mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                Access Revoked or Expired
              </span>

              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Admin Link Unavailable
              </h2>

              <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                {errorMessage}
              </p>

              <div className="mt-4 rounded-xl border border-slate-200/80 bg-slate-50 p-3.5 text-left text-[11px] text-slate-600 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-400">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  Why am I seeing this?
                </p>
                <p className="mt-0.5 leading-relaxed">
                  The workspace owner either revoked this temporary access key or the token reached its expiration window. For security, revoked keys cannot be re-activated.
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700"
                >
                  Return to Home
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/admin")}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  Admin Portal
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // VALID TOKEN
  // ========================================

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-slate-950">
      <SEO
        title="Admin Verification - Storely"
        description="Verify admin access token"
        noIndex={true}
      />
      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-5 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-slate-800">
                <FaKey size={15} className="text-gray-500 dark:text-slate-400" />
              </div>

              <div>
                <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                  Admin Access
                </h1>

                <p className="mt-0.5 text-xs text-gray-400 dark:text-slate-400">
                  Verify your password to continue.
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6">
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-500 dark:text-slate-400">
                Admin password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  disabled={verifying}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 pr-10 text-sm text-slate-700 outline-none transition placeholder:text-gray-300 focus:border-gray-400 disabled:cursor-not-allowed disabled:bg-gray-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:disabled:bg-slate-850"
                />

                <button
                  type="button"
                  disabled={verifying}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600 disabled:cursor-not-allowed dark:text-slate-400 dark:hover:text-slate-200"
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
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 text-xs font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              <FaLock size={11} />

              {verifying ? "Verifying..." : "Verify & Continue"}
            </button>

            <p className="mt-4 text-center text-[11px] leading-5 text-gray-400 dark:text-slate-500">
              Your password is verified securely and is never stored in your
              browser.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
