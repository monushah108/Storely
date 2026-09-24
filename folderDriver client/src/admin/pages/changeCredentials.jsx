import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";

import {
  useGetAdminCredentialsQuery,
  useCreateAdminAccessMutation,
  useUpdateAdminCredentialsMutation,
} from "../../store/slices/AdminSlice";

export default function ChangeCredentials() {
  const navigate = useNavigate();
  const { data: credentialStatus, isLoading: checkingPassword } =
    useGetAdminCredentialsQuery();

  const [updateAdminCredentials, { isLoading: updating }] =
    useUpdateAdminCredentialsMutation();
  const [createAdminAccess, { isLoading: creating }] =
    useCreateAdminAccessMutation();

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

  const handleChange = (e) => {
    setPasswords((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const toggleShow = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwords;

    if (hasPassword && !currentPassword.trim()) {
      toast.error("Please enter your current admin password");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      if (hasPassword) {
        await updateAdminCredentials({
          currentPassword,
          password: newPassword,
        }).unwrap();
        toast.success("Admin password changed successfully!");
      } else {
        await createAdminAccess({
          password: newPassword,
        }).unwrap();
        toast.success("Admin master password created successfully!");
      }

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      navigate("/admin/settings");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update admin password");
    }
  };

  const isSubmitting = updating || creating;

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            {hasPassword ? "Change Master Admin Password" : "Set Initial Master Admin Password"}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            This password protects temporary admin tokens and privileged operations.
          </p>
        </div>

        <Link
          to="/admin/settings"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft size={13} />
          <span>Back</span>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Password (if configured) */}
        {hasPassword && (
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
              Current Admin Password
            </label>
            <div className="relative">
              <input
                type={showPassword.current ? "text" : "password"}
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handleChange}
                required
                placeholder="Enter current password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-3.5 pr-10 text-xs text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="button"
                onClick={() => toggleShow("current")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword.current ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
        )}

        {/* New Password */}
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
            New Admin Password
          </label>
          <div className="relative">
            <input
              type={showPassword.new ? "text" : "password"}
              name="newPassword"
              value={passwords.newPassword}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Minimum 6 characters"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-3.5 pr-10 text-xs text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
            <button
              type="button"
              onClick={() => toggleShow("new")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword.new ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showPassword.confirm ? "text" : "password"}
              name="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Re-enter new password"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-3.5 pr-10 text-xs text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
            <button
              type="button"
              onClick={() => toggleShow("confirm")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword.confirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-3">
          <Link
            to="/admin/settings"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Lock size={13} />
            <span>{isSubmitting ? "Updating..." : hasPassword ? "Update Password" : "Set Password"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
