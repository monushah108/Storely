import { ArrowLeft, Cloud, Home, SearchX } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50 px-4">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/40 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg text-center">
        {/* Logo */}
        <Link to="/" className="mx-auto flex w-fit items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
            <Cloud size={21} className="text-white" strokeWidth={2.2} />
          </div>

          <span className="text-xl font-bold tracking-tight text-gray-900">
            Storely
          </span>
        </Link>

        {/* 404 Illustration */}
        <div className="mt-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50">
            <SearchX size={38} strokeWidth={1.8} className="text-blue-600" />
          </div>

          <p className="mt-7 text-8xl font-black tracking-tighter text-gray-900 sm:text-9xl">
            404
          </p>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Page not found
          </h1>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
            Sorry, we couldn't find the page you're looking for. It may have
            been moved, deleted, or the URL might be incorrect.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              inline-flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              border border-gray-200
              bg-white
              px-5 py-3
              text-sm
              font-medium
              text-gray-700
              shadow-sm
              transition
              hover:border-gray-300
              hover:bg-gray-50
              active:scale-[0.98]
              sm:w-auto
            "
          >
            <ArrowLeft size={16} />
            Go back
          </button>

          <Link
            to="/"
            className="
              inline-flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-blue-600
              px-5 py-3
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-blue-700
              hover:shadow-md
              active:scale-[0.98]
              sm:w-auto
            "
          >
            <Home size={16} />
            Back to Storely
          </Link>
        </div>

        {/* Footer */}
        <p className="mt-10 text-xs text-gray-400">
          If you think this is a mistake, check the URL and try again.
        </p>
      </div>
    </main>
  );
}
