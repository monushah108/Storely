import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { FaGithub } from "react-icons/fa";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";

import GoogleBtn from "../ui/OauthBth";
import AuthCard from "./AuthCard";
import SEO from "../common/SEO";
import { useLoginMutation } from "../../store/slices/UserSlice";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await login({ email: email.trim(), password }).unwrap();
      toast.success("Welcome back! Signed in successfully");
      const destination = location.state?.from?.pathname
        ? `${location.state.from.pathname}${location.state.from.search || ""}`
        : "/dashboard";
      navigate(destination, { replace: true });
    } catch (err) {
      const error = err?.data?.error || err?.data?.message || "Login failed. Please check your credentials.";
      toast.error(error);
    }
  };

  return (
    <>
      <SEO
        title="Sign In - Storely Cloud Storage"
        description="Sign in to your Storely account to access your cloud files, personal folders, and shared media securely."
        keywords="storely login, sign in cloud storage, access drive, secure login"
        canonical="/auth/login"
        ogImage="/login.png"
      />
      <AuthCard
        title="Sign in to your account"
        subtitle="to continue to Storely Drive"
        footerText="Don’t have an account?"
        footerLinkText="Create account"
        footerLinkTo="/auth/register"
      >
        <form onSubmit={handleLogin} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-slate-300">
            Email address
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 dark:text-slate-500">
              <Mail className="h-4 w-4" />
            </div>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-3.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-blue-900/40"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-700 dark:text-slate-300">
              Password
            </label>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 dark:text-slate-500">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-blue-900/40"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-200"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Signing in...</span>
            </span>
          ) : (
            "Sign In"
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-gray-200 dark:bg-slate-800" />
          <span className="text-xs text-gray-400 uppercase tracking-wider font-medium dark:text-slate-500">
            or continue with
          </span>
          <div className="h-px flex-1 bg-gray-200 dark:bg-slate-800" />
        </div>

        {/* Social Logins */}
        <div className="flex flex-col gap-2.5">
          <GoogleBtn text="signin_with" />

          <button
            type="button"
            onClick={() => {
              window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
            }}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-gray-300 bg-white py-2.5 text-xs font-semibold text-gray-700 shadow-xs transition hover:bg-gray-50 active:scale-[0.99] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750"
          >
            <FaGithub className="h-4 w-4 text-gray-900 dark:text-white" />
            <span>Sign in with GitHub</span>
          </button>
        </div>
      </form>
    </AuthCard>
    </>
  );
}
