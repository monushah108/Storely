import { useState } from "react";
import { FaKey, FaLock, FaCopy, FaCheck } from "react-icons/fa";
import { PasswordField } from "../components/passwordInput";

export default function Settings() {
  // Password
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [changingPassword, setChangingPassword] = useState(false);

  // Access token
  const [expiresInDays, setExpiresInDays] = useState(7);
  const [token, setToken] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [generatingToken, setGeneratingToken] = useState(false);
  const [copied, setCopied] = useState(false);

  const handlePasswordChange = (e) => {
    setPasswords((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = passwords;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return;
    }

    if (newPassword.length < 8) {
      return;
    }

    if (newPassword !== confirmPassword) {
      return;
    }

    try {
      setChangingPassword(true);

      // Connect your RTK Query mutation here.
      //
      // await changeAdminPassword({
      //   currentPassword,
      //   newPassword,
      // }).unwrap();

      console.log("Change password", {
        currentPassword,
        newPassword,
      });

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Failed to change password:", error);
    } finally {
      setChangingPassword(false);
    }
  };

  const handleGenerateToken = async () => {
    try {
      setGeneratingToken(true);
      setToken("");
      setExpiresAt("");

      // Connect your RTK Query mutation here.
      //
      // const data = await createAdminAccess({
      //   userId,
      //   expiresInDays,
      // }).unwrap();
      //
      // setToken(data.token);
      // setExpiresAt(data.expiresAt);

      console.log("Generate token", {
        expiresInDays,
      });
    } catch (error) {
      console.error("Failed to generate token:", error);
    } finally {
      setGeneratingToken(false);
    }
  };

  const handleCopy = async () => {
    if (!token) return;

    try {
      await navigator.clipboard.writeText(token);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy token:", error);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString();
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Settings</h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your admin password and temporary access tokens.
        </p>
      </div>

      <div className="space-y-6">
        {/* Change Password */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          {/* Card Header */}
          <div className="border-b border-gray-200 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                <FaLock size={14} className="text-gray-500" />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-700">
                  Change Admin Password
                </h2>

                <p className="mt-0.5 text-xs text-gray-400">
                  Update the password used to access the admin panel.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleChangePassword} className="p-5">
            <div className="grid gap-5 md:grid-cols-3">
              <PasswordField
                label="Current password"
                name="currentPassword"
                value={passwords.currentPassword}
                visible={showPassword.current}
                onChange={handlePasswordChange}
                onToggle={() => togglePassword("current")}
              />

              <PasswordField
                label="New password"
                name="newPassword"
                value={passwords.newPassword}
                visible={showPassword.new}
                onChange={handlePasswordChange}
                onToggle={() => togglePassword("new")}
              />

              <PasswordField
                label="Confirm password"
                name="confirmPassword"
                value={passwords.confirmPassword}
                visible={showPassword.confirm}
                onChange={handlePasswordChange}
                onToggle={() => togglePassword("confirm")}
              />
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="submit"
                disabled={changingPassword}
                className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {changingPassword ? "Changing..." : "Change Password"}
              </button>
            </div>
          </form>
        </div>

        {/* Admin Access Token */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          {/* Card Header */}
          <div className="border-b border-gray-200 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                <FaKey size={14} className="text-gray-500" />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-700">
                  Admin Access Token
                </h2>

                <p className="mt-0.5 text-xs text-gray-400">
                  Generate temporary access for another user.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5">
            {/* Token Settings */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-500">
                  Token expires after
                </label>

                <select
                  value={expiresInDays}
                  onChange={(e) => setExpiresInDays(Number(e.target.value))}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-gray-400 sm:w-48"
                >
                  <option value={1}>1 day</option>
                  <option value={7}>7 days</option>
                  <option value={30}>30 days</option>
                </select>
              </div>

              <button
                type="button"
                disabled={generatingToken}
                onClick={handleGenerateToken}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-xs font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FaKey size={11} />

                {generatingToken ? "Generating..." : "Generate Token"}
              </button>
            </div>

            {/* Generated Token */}
            {token && (
              <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-700">
                      Generated Access Token
                    </p>

                    <p className="mt-1 text-[11px] text-gray-400">
                      Share this token only with the intended user.
                    </p>
                  </div>
                </div>

                <div className="flex overflow-hidden rounded-lg border border-gray-200 bg-white">
                  <input
                    type="text"
                    readOnly
                    value={token}
                    className="min-w-0 flex-1 bg-transparent px-3 py-2.5 font-mono text-xs text-gray-600 outline-none"
                  />

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-2 border-l border-gray-200 px-3 text-xs font-medium text-gray-500 transition hover:bg-gray-50 hover:text-slate-700"
                  >
                    {copied ? (
                      <>
                        <FaCheck size={11} />
                        Copied
                      </>
                    ) : (
                      <>
                        <FaCopy size={11} />
                        Copy
                      </>
                    )}
                  </button>
                </div>

                {expiresAt && (
                  <p className="mt-2 text-[11px] text-gray-400">
                    Expires: {formatDate(expiresAt)}
                  </p>
                )}
              </div>
            )}

            {/* Information */}
            <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-xs font-medium text-slate-600">
                About access tokens
              </p>

              <p className="mt-1 text-[11px] leading-5 text-gray-400">
                Access tokens provide temporary admin access and automatically
                become invalid after their expiration time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
