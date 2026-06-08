import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="text-center p-8 rounded-2xl shadow-md bg-white">
        <h1 className="text-7xl font-bold text-red-500">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-800">
          Page Not Found
        </h2>
        <p className="mt-2 text-gray-600">
          Oops! The page you are looking for doesn’t exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-xl shadow hover:bg-blue-700 transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
