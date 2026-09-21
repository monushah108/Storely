import React from "react";
import { Link } from "react-router-dom";
import { Cloud, ShieldCheck } from "lucide-react";

export default function AuthCard({ title, subtitle, children, footerText, footerLinkText, footerLinkTo }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#f8fafd] px-4 py-8">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-xs sm:p-9">
          {/* Logo & Brand */}
          <div className="mb-6 flex flex-col items-center text-center">
            <Link
              to="/"
              className="group mb-4 flex items-center gap-2.5 transition hover:opacity-90"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
                <Cloud className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-gray-900">
                Storely
              </span>
            </Link>

            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              {title}
            </h1>

            {subtitle && (
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form Content */}
          {children}

          {/* Card Footer Link */}
          {footerText && footerLinkText && footerLinkTo && (
            <p className="mt-6 text-center text-xs text-gray-500 sm:text-sm">
              {footerText}{" "}
              <Link
                to={footerLinkTo}
                className="font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
              >
                {footerLinkText}
              </Link>
            </p>
          )}
        </div>

        {/* Security badge at bottom */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-gray-400">
          <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
          <span>Protected by Storely secure cloud encryption</span>
        </div>
      </div>
    </div>
  );
}
