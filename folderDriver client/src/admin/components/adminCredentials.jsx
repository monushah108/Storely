import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Lock,
  Key,
  Copy,
  Check,
  Plus,
  Trash2,
  Clock,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import {
  useClearAccessTokenMutation,
  useGenerateAccessTokenMutation,
  useGetAdminCredentialsQuery,
} from "../../store/slices/AdminSlice";

export default function AdminCredentials() {
  const { data: credentialStatus, refetch } = useGetAdminCredentialsQuery();
  const [generateAccessToken] = useGenerateAccessTokenMutation();
  const [clearAccessToken] = useClearAccessTokenMutation();

  const [expiresInDays, setExpiresInDays] = useState(7);
  const [generatedToken, setGeneratedToken] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [generatedExpiresAt, setGeneratedExpiresAt] = useState("");

  const [generatingToken, setGeneratingToken] = useState(false);
  const [clearingToken, setClearingToken] = useState(false);
  const [copied, setCopied] = useState(false);

  const hasPassword = credentialStatus?.hasPassword ?? false;
  const accessToken = credentialStatus?.accessToken ?? null;
  const hasActiveToken = accessToken?.active === true || Boolean(accessToken?.url);

  const handleGenerateToken = async () => {
    try {
      setGeneratingToken(true);
      setCopied(false);

      const data = await generateAccessToken({
        expiryDate: expiresInDays,
      }).unwrap();

      setGeneratedToken(data.token || "");
      setGeneratedUrl(data.accessUrl || "");
      setGeneratedExpiresAt(data.expiresAt || "");
      toast.success("Temporary access key generated successfully!");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to generate access token");
    } finally {
      setGeneratingToken(false);
    }
  };

  const handleClearToken = async () => {
    if (!window.confirm("Revoke active temporary admin access key?")) return;

    try {
      setClearingToken(true);
      await clearAccessToken().unwrap();
      setGeneratedToken("");
      setGeneratedUrl("");
      setGeneratedExpiresAt("");
      setCopied(false);
      toast.success("Access key revoked successfully");
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to clear access token");
    } finally {
      setClearingToken(false);
    }
  };

  const handleCopy = async () => {
    const rawUrl = generatedUrl || accessToken?.url;
    if (!rawUrl) return;

    const fullUrl = rawUrl.startsWith("http")
      ? rawUrl
      : `${window.location.origin}${rawUrl}`;

    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success("Access URL copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  return (
    <div className="space-y-6">
      {/* ================= ADMIN PASSWORD CARD ================= */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-4 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <Lock size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Master Admin Password
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Guards your admin session and temporary verification gates.
              </p>
            </div>
          </div>

          {hasPassword ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Configured
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-400">
              <AlertCircle size={12} />
              Not Configured
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-850">
          <div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {hasPassword ? "Password Protection Active" : "No Admin Password Set"}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {hasPassword
                ? "Your admin password is encrypted with bcrypt and cannot be viewed in plaintext."
                : "Set an admin password first before delegating temporary verification tokens."}
            </p>
          </div>

          <Link
            to="/admin/settings/change-password"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800 active:scale-[0.99] dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            {hasPassword ? "Change Password" : "Set Admin Password"}
          </Link>
        </div>
      </div>

      {/* ================= TEMPORARY ACCESS KEYS ================= */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-4 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <Key size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Temporary Delegation Access Keys
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Generate time-limited verification URLs to allow emergency or temporary admin access.
            </p>
          </div>
        </div>

        {/* Existing Active Token View */}
        {generatedUrl || hasActiveToken ? (
          <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4.5 space-y-3 dark:border-blue-900/40 dark:bg-blue-950/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Active Delegation Link</span>
              </div>

              <button
                disabled={clearingToken}
                onClick={handleClearToken}
                className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:bg-slate-800 dark:text-red-400 dark:hover:bg-red-950/30"
              >
                <Trash2 size={12} />
                <span>Revoke Key</span>
              </button>
            </div>

            {/* URL bar */}
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                readOnly
                value={
                  generatedUrl
                    ? `${window.location.origin}${generatedUrl}`
                    : `${window.location.origin}${accessToken?.url || ""}`
                }
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 font-mono text-xs text-slate-700 outline-none select-all dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              />

              <button
                onClick={handleCopy}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? "Copied!" : "Copy Link"}</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Anyone with this link and your master admin password can verify temporary admin access.
            </p>
          </div>
        ) : (
          /* Generate Form */
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 dark:border-slate-800 dark:bg-slate-850">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Token Expiration Window
              </label>

              <div className="flex flex-wrap gap-2">
                {[1, 3, 7, 14, 30].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setExpiresInDays(days)}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                      expiresInDays === days
                        ? "bg-blue-600 text-white shadow-xs"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    }`}
                  >
                    {days} {days === 1 ? "Day" : "Days"}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                disabled={generatingToken || !hasPassword}
                onClick={handleGenerateToken}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={14} />
                <span>{generatingToken ? "Generating..." : `Generate Key (Expires in ${expiresInDays}d)`}</span>
              </button>

              {!hasPassword && (
                <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                  * You must set an admin password before generating an access token.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
