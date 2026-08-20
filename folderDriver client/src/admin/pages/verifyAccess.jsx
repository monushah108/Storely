import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaLock, FaEye, FaEyeSlash, FaKey } from "react-icons/fa";
import { toast } from "sonner";

export default function AdminAccessVerify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid admin access link");
      return;
    }

    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    try {
      setVerifying(true);

      const response = await fetch("/api/admin/access/verify", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password verification failed");
      }

      toast.success("Admin access verified");

      navigate("/admin", {
        replace: true,
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
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
            {!token && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-xs font-medium text-red-600">
                  Invalid access link
                </p>

                <p className="mt-1 text-[11px] text-red-500">
                  This admin access link does not contain a valid token.
                </p>
              </div>
            )}

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
                  disabled={!token || verifying}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 pr-10 text-sm text-slate-700 outline-none transition placeholder:text-gray-300 focus:border-gray-400 disabled:cursor-not-allowed disabled:bg-gray-50"
                />

                <button
                  type="button"
                  disabled={!token}
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
              disabled={!token || verifying}
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
