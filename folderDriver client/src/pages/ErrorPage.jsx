import { AlertCircle, ArrowLeft, Home, RefreshCw } from "lucide-react";
import { Link, useRouteError } from "react-router-dom";
import SEO from "../components/common/SEO";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-slate-950">
      <SEO
        title="Error - Storely"
        description="An unexpected error occurred on Storely."
        noIndex={true}
      />
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {/* Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/40">
          <AlertCircle className="h-7 w-7 text-red-500 dark:text-red-400" />
        </div>

        {/* Heading */}
        <h1 className="mt-5 text-2xl font-bold text-gray-800 dark:text-slate-100">
          Something went wrong
        </h1>

        {/* Message */}
        <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-slate-400">
          {error?.statusText ||
            error?.message ||
            "We couldn't load this page. Please try again."}
        </p>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}
