import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FaGithub } from "react-icons/fa";
import { Loader2, Mail, Lock, User, Eye, EyeOff, CheckCircle2 } from "lucide-react";

import GoogleBtn from "../ui/OauthBth";
import AuthCard from "./AuthCard";
import SEO from "../common/SEO";
import { useRegisterMutation } from "../../store/slices/UserSlice";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setErrors({ password: "Password must be at least 6 characters" });
      return;
    }

    try {
      const response = await register(formData);

      if (response?.error) {
        const errorData = response?.error?.data;
        const msg = errorData?.error || errorData?.message || "Registration failed";
        toast.error(msg);
        if (typeof errorData === "object") {
          setErrors(errorData);
        }
      } else if (response?.data) {
        toast.success("Account created successfully! Redirecting...");
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/auth/login");
        }, 1500);
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <>
      <SEO
        title="Create an Account - Storely Cloud Storage"
        description="Join Storely today for free cloud storage. Upload, store, organize, and share your documents and media with ease."
        keywords="storely register, create account, free cloud storage, sign up drive, storely cloud"
        canonical="/auth/register"
        ogImage="/login.png"
      />
      <AuthCard
        title="Create your account"
        subtitle="Free cloud storage for all your files"
        footerText="Already have an account?"
        footerLinkText="Sign in"
        footerLinkTo="/auth/login"
      >
      <form onSubmit={handleRegister} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-slate-300">
            Full name or username
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 dark:text-slate-500">
              <User className="h-4 w-4" />
            </div>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              required
              autoComplete="name"
              className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-3.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-blue-900/40"
            />
          </div>
          {errors?.name && (
            <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.name}</p>
          )}
        </div>

        {/* Email */}
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
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className="w-full rounded-xl border border-gray-300 bg-white py-2.5 pl-10 pr-3.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-blue-900/40"
            />
          </div>
          {errors?.email && (
            <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-gray-700 dark:text-slate-300">
            Password
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 dark:text-slate-500">
              <Lock className="h-4 w-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
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
          {errors?.password && (
            <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.password}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || isSuccess}
          className={`w-full rounded-xl py-2.5 text-sm font-semibold text-white shadow-xs transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 ${
            isSuccess
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSuccess ? (
            <span className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Account Created!</span>
            </span>
          ) : isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating account...</span>
            </span>
          ) : (
            "Create Account"
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-gray-200 dark:bg-slate-800" />
          <span className="text-xs text-gray-400 uppercase tracking-wider font-medium dark:text-slate-500">
            or sign up with
          </span>
          <div className="h-px flex-1 bg-gray-200 dark:bg-slate-800" />
        </div>

        {/* Social Logins */}
        <div className="flex flex-col gap-2.5">
          <GoogleBtn text="signup_with" />

          <button
            type="button"
            onClick={() => {
              window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
            }}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-gray-300 bg-white py-2.5 text-xs font-semibold text-gray-700 shadow-xs transition hover:bg-gray-50 active:scale-[0.99] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750"
          >
            <FaGithub className="h-4 w-4 text-gray-900 dark:text-white" />
            <span>Sign up with GitHub</span>
          </button>
        </div>
      </form>
    </AuthCard>
    </>
  );
}
