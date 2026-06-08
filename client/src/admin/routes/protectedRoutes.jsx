import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoutes({ role, children }) {
  const roles = ["admin", "owner"];
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:4000";

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${BASE_URL}/user/profile`, {
        credentials: "include",
      });
      const { role } = await res.json();
      if (!roles.includes(role)) {
        navigate("/");
        return;
      }
    } catch (err) {
      navigate("/login");
    }
  };

  return children;
}
