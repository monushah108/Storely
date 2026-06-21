import { useRouteError, Link } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Oops! Something went wrong.</h1>

      <p className="mt-4 text-gray-500">
        {error?.statusText || error?.message}
      </p>

      <Link to="/" className="mt-6 rounded bg-blue-600 px-4 py-2 text-white">
        Go Home
      </Link>
    </div>
  );
}
