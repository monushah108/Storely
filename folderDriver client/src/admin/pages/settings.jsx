import { useState } from "react";
import { FaLock } from "react-icons/fa";

import SettingForm from "../components/settingForm";
import SettingToken from "../components/settingToken";

import {
  useGetAdminCredentialsQuery,
  useCreateAdminAccessMutation,
  useUpdateAdminCredentialsMutation,
  useGenerateAccessTokenMutation,
  useClearAccessTokenMutation,
} from "../../store/slices/AdminSlice";

export default function Settings() {
  // ========================================
  // ADMIN PASSWORD
  // ========================================

  const { data: credentialStatus, isLoading: checkingPassword } =
    useGetAdminCredentialsQuery();

  const [updateAdminCredentials] = useUpdateAdminCredentialsMutation();
  const [createAdminAccess] = useCreateAdminAccessMutation();
  const [generateAccessToken] = useGenerateAccessTokenMutation();
  const [clearAccessToken] = useClearAccessTokenMutation();

  // Get password status from backend
  const hasPassword = credentialStatus?.hasPassword ?? false;

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

  // ========================================
  // ADMIN ACCESS TOKEN
  // ========================================

  const [expiresInDays, setExpiresInDays] = useState(7);
  const [token, setToken] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [generatingToken, setGeneratingToken] = useState(false);
  const [copied, setCopied] = useState(false);
  const [clearingToken, setClearingToken] = useState(false);
  // ========================================
  // PASSWORD HANDLERS
  // ========================================

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

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = passwords;

    if (!newPassword || !confirmPassword) {
      console.log("both are null");
      return;
    }

    if (newPassword.length < 8) {
      console.log("more than 8");
      return;
    }

    if (newPassword !== confirmPassword) {
      console.log("not equla");
      return;
    }

    try {
      setChangingPassword(true);

      if (hasPassword) {
        // Change existing password
        await updateAdminCredentials({
          currentPassword,
          password: newPassword,
        }).unwrap();
        console.log("setting password");
      } else {
        // Set password for the first time
        await createAdminAccess({
          password: newPassword,
        }).unwrap();
      }

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(
        hasPassword
          ? "Failed to change admin password:"
          : "Failed to set admin password:",
        error,
      );
    } finally {
      setChangingPassword(false);
    }
  };

  // ========================================
  // ACCESS TOKEN
  // ========================================

  const handleGenerateToken = async () => {
    try {
      setGeneratingToken(true);
      setToken("");
      setExpiresAt("");

      const data = await generateAccessToken({
        expiryDate: expiresInDays,
      }).unwrap();

      setToken(data.token);
      setExpiresAt(data.expiresAt);
    } catch (error) {
      console.error("Failed to generate token:", error);
    } finally {
      setGeneratingToken(false);
    }
  };
  const handleClearToken = async () => {
    try {
      setClearingToken(true);

      await clearAccessToken().unwrap();

      setToken("");
      setExpiresAt("");
      setCopied(false);
    } catch (error) {
      console.error("Failed to clear admin access token:", error);
    } finally {
      setClearingToken(false);
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

  if (checkingPassword) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-800">Settings</h1>

          <p className="mt-1 text-sm text-gray-500">Loading settings...</p>
        </div>
      </div>
    );
  }

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
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          {/* Header */}
          <div className="border-b border-gray-200 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                <FaLock size={14} className="text-gray-500" />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-700">
                  {hasPassword ? "Change Admin Password" : "Set Admin Password"}
                </h2>

                <p className="mt-0.5 text-xs text-gray-400">
                  {hasPassword
                    ? "Update the password used to access the admin panel."
                    : "Set a password for temporary admin access."}
                </p>
              </div>
            </div>
          </div>

          {/* Password Form */}
          <SettingForm
            handlePasswordChange={handlePasswordChange}
            handlePasswordSubmit={handlePasswordSubmit}
            passwords={passwords}
            showPassword={showPassword}
            changingPassword={changingPassword}
            togglePassword={togglePassword}
            hasPassword={hasPassword}
          />
        </div>

        <SettingToken
          expiryDate={expiresInDays}
          setExpiresInDays={setExpiresInDays}
          generatingToken={generatingToken}
          handleGenerateToken={handleGenerateToken}
          handleClearToken={handleClearToken}
          clearingToken={clearingToken}
          handleCopy={handleCopy}
          token={token}
          copied={copied}
          expiresAt={expiresAt}
        />
      </div>
    </div>
  );
}
