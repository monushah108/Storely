import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoutes({ children }) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/users`, {
          credentials: "include",
        });

        if (!res.ok) {
          setStatus("unauthorized");
          return;
        }

        const data = await res.json();

        if (!data.success || !data.isAdmin) {
          setStatus("unauthorized");
          return;
        }

        setStatus("authorized");
      } catch (error) {
        setStatus("unauthorized");
      }
    };

    checkAccess();
  }, []);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Checking access...</p>
      </div>
    );
  }

  if (status === "unauthorized") {
    return <Navigate to="/" replace />;
  }

  return children;
}
