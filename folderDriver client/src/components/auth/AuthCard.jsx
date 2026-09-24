import React from "react";
import { Link } from "react-router-dom";
import { Cloud, ShieldCheck } from "lucide-react";
import ThemeToggle from "../common/ThemeToggle";

export default function AuthCard({ title, subtitle, children, footerText, footerLinkText, footerLinkTo }) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[#f8fafd] px-4 py-8 dark:bg-slate-950">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-xs sm:p-9 dark:border-slate-800 dark:bg-slate-900">
          {/* Logo & Brand */}
          <div className="mb-6 flex flex-col items-center text-center">
            <Link
              to="/"
              className="group mb-4 flex items-center gap-2.5 transition hover:opacity-90"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                <Cloud className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-slate-100">
                Storely
              </span>
            </Link>

            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-slate-100">
              {title}
            </h1>

            {subtitle && (
              <p className="mt-1 text-xs text-gray-500 sm:text-sm dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form Content */}
          {children}

          {/* Card Footer Link */}
          {footerText && footerLinkText && footerLinkTo && (
            <p className="mt-6 text-center text-xs text-gray-500 sm:text-sm dark:text-slate-400">
              {footerText}{" "}
              <Link
                to={footerLinkTo}
                className="font-semibold text-blue-600 transition hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
              >
                {footerLinkText}
              </Link>
            </p>
          )}
        </div>

        {/* Security badge at bottom */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-gray-400 dark:text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          <span>Protected by Storely secure cloud encryption</span>
        </div>
      </div>
    </div>
  );
}
