import { useState } from "react";
import {
  useClearAccessTokenMutation,
  useGenerateAccessTokenMutation,
  useGetAdminCredentialsQuery,
} from "../../store/slices/AdminSlice";
import { FaCheck, FaCopy, FaKey, FaPlus, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function AdminCredentials() {
  const { data: credentialStatus } = useGetAdminCredentialsQuery();
  const [generateAccessToken] = useGenerateAccessTokenMutation();
  const [clearAccessToken] = useClearAccessTokenMutation();

  // ========================================
  // TOKEN STATE
  // ========================================

  const [expiresInDays, setExpiresInDays] = useState(7);
  const [generatedToken, setGeneratedToken] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");

  const [generatedExpiresAt, setGeneratedExpiresAt] = useState("");

  const [generatingToken, setGeneratingToken] = useState(false);
  const [clearingToken, setClearingToken] = useState(false);
  const [copied, setCopied] = useState(false);

  // ========================================
  // PASSWORD STATUS
  // ========================================

  const hasPassword = credentialStatus?.hasPassword ?? false;

  // ========================================
  // EXISTING ACCESS TOKEN
  // ========================================

  const accessToken = credentialStatus?.accessToken ?? null;

  const hasActiveToken = accessToken?.active === true || !!accessToken?.url;

  // ========================================
  // GENERATE TOKEN
  // ========================================

  const handleGenerateToken = async () => {
    try {
      setGeneratingToken(true);
      setCopied(false);

      const data = await generateAccessToken({
        expiryDate: expiresInDays,
      }).unwrap();

      /*
       * Expected backend response:
       *
       * {
       *   success: true,
       *   token: "...",
       *   accessUrl: "/admin/verify/...",
       *   expiresAt: "..."
       * }
       */

      setGeneratedToken(data.token || "");
      setGeneratedUrl(data.accessUrl || "");
      setGeneratedExpiresAt(data.expiresAt || "");
    } catch (error) {
      console.error("Failed to generate access token:", error);
    } finally {
      setGeneratingToken(false);
    }
  };

  // ========================================
  // CLEAR TOKEN
  // ========================================

  const handleClearToken = async () => {
    try {
      setClearingToken(true);

      await clearAccessToken().unwrap();

      setGeneratedToken("");
      setGeneratedUrl("");
      setGeneratedExpiresAt("");
      setCopied(false);
    } catch (error) {
      console.error("Failed to clear access token:", error);
    } finally {
      setClearingToken(false);
    }
  };

  // ========================================
  // COPY URL
  // ========================================

  const handleCopy = async () => {
    const url = generatedUrl || accessToken?.url;

    if (!url) return;

    try {
      await navigator.clipboard.writeText(url);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy access URL:", error);
    }
  };
  return (
    <div className="space-y-6">
      {/* ========================================
            ADMIN PASSWORD
        ======================================== */}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {/* Header */}
        <div className="border-b border-gray-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
              <FaLock size={14} className="text-gray-500" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-700">
                Admin Panel Password
              </h2>

              <p className="mt-0.5 text-xs text-gray-400">
                Password used to protect temporary admin access.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {hasPassword ? (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">
                  Password status
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <span className="font-mono text-sm tracking-widest text-slate-700">
                    ••••••••••••
                  </span>

                  <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-600">
                    Configured
                  </span>
                </div>

                <p className="mt-1 text-[11px] text-gray-400">
                  The password is securely hashed and cannot be displayed.
                </p>
              </div>

              <Link
                to="/admin/settings/change-password"
                className="inline-flex items-center justify-center rounded-lg bg-slate-800 px-4 py-2 text-xs font-medium text-white transition hover:bg-slate-700"
              >
                Change Password
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">
                  No admin password configured
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Set an admin password before generating temporary access.
                </p>
              </div>

              <Link
                to="/admin/settings/change-password"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-xs font-medium text-white transition hover:bg-slate-700"
              >
                <FaPlus size={10} />
                Set Password
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ========================================
            TEMPORARY ADMIN ACCESS
        ======================================== */}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {/* Header */}
        <div className="border-b border-gray-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
              <FaKey size={14} className="text-gray-500" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-700">
                Temporary Admin Access
              </h2>

              <p className="mt-0.5 text-xs text-gray-400">
                Generate temporary access for another user.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {generatedUrl || hasActiveToken ? (
            <div>
              <div className="mb-3">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-slate-700">
                    Active access URL
                  </p>

                  <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-600">
                    Active
                  </span>
                </div>

                <p className="mt-1 text-[11px] text-gray-400">
                  Share this URL with the user who needs temporary admin access.
                </p>
              </div>

              {/* URL */}
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex min-w-0 flex-1 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                  <input
                    type="text"
                    readOnly
                    value={generatedUrl || accessToken?.url || ""}
                    className="min-w-0 flex-1 bg-transparent px-3 py-2.5 font-mono text-xs text-gray-600 outline-none"
                  />

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex shrink-0 items-center gap-2 border-l border-gray-200 px-3 text-xs font-medium text-gray-500 transition hover:bg-gray-100"
                  >
                    {copied ? (
                      <>
                        <FaCheck size={10} />
                        Copied
                      </>
                    ) : (
                      <>
                        <FaCopy size={10} />
                        Copy
                      </>
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleClearToken}
                  disabled={clearingToken}
                  className="rounded-lg border border-red-200 px-4 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {clearingToken ? "Revoking..." : "Revoke Access"}
                </button>
              </div>

              {/* Expiration */}
              {(generatedExpiresAt || accessToken?.expiresAt) && (
                <p className="mt-2 text-[11px] text-gray-400">
                  Expires:{" "}
                  {new Date(
                    generatedExpiresAt || accessToken.expiresAt,
                  ).toLocaleString()}
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">
                  No active access token
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Generate a temporary URL when you need to give someone admin
                  access.
                </p>
              </div>

              <button
                type="button"
                onClick={handleGenerateToken}
                disabled={generatingToken || !hasPassword}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-xs font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FaKey size={10} />

                {generatingToken ? "Generating..." : "Generate Access Token"}
              </button>
            </div>
          )}

          {/* Password requirement */}
          {!hasPassword && !hasActiveToken && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="text-xs font-medium text-amber-700">
                Admin password required
              </p>

              <p className="mt-1 text-[11px] text-amber-600">
                Set an admin password before generating an access token.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
