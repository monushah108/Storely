import { useState } from "react";
import { FaLock } from "react-icons/fa";

import SettingForm from "../components/settingForm";
import SettingToken from "../components/settingToken";

export default function Settings() {
  // ========================================
  // ADMIN PASSWORD
  // ========================================

  // const { data: credentialStatus, isLoading: checkingPassword } =
  //   useGetAdminCredentialStatusQuery();

  // const [setAdminPassword] = useSetAdminPasswordMutation();
  // const [updateAdminCredentials] = useUpdateAdminCredentialsMutation();

  const hasPassword = false;

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

    // Current password is required only when changing
    if (hasPassword && !currentPassword) {
      return;
    }

    if (!newPassword || !confirmPassword) {
      return;
    }

    if (newPassword.length < 8) {
      return;
    }

    if (newPassword !== confirmPassword) {
      return;
    }

    try {
      // setChangingPassword(true);

      if (hasPassword) {
        // Change existing password
        // await updateAdminCredentials({
        //   currentPassword,
        //   newPassword,
        // }).unwrap();
      } else {
        // Set password for the first time
        // await setAdminPassword({
        //   password: newPassword,
        // }).unwrap();
      }

      // Clear form
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Optional:
      // credential status query should automatically be invalidated
      // by your RTK Query API configuration.
    } catch (error) {
      console.error(
        hasPassword
          ? "Failed to change admin password:"
          : "Failed to set admin password:",
        error,
      );
    } finally {
      // setChangingPassword(false);
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

      // Replace this with your actual mutation
      // const data = await createAdminAccess({
      //   userId,
      //   expiresInDays,
      // }).unwrap();

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

  // if (checkingPassword) {
  //   return (
  //     <div className="w-full">
  //       <div className="mb-6">
  //         <h1 className="text-2xl font-semibold text-slate-800">Settings</h1>

  //         <p className="mt-1 text-sm text-gray-500">Loading settings...</p>
  //       </div>
  //     </div>
  //   );
  // }

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
            hasPassword={hasPassword}
          />
        </div>

        <SettingToken
          expiresInDays={expiresInDays}
          setExpiresInDays={setExpiresInDays}
          generatingToken={generatingToken}
          handleGenerateToken={handleGenerateToken}
          handleCopy={handleCopy}
          token={token}
          copied={copied}
          expiresAt={expiresAt}
        />
      </div>
    </div>
  );
}
