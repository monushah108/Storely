import { useRef, useState } from "react";
import { CgEye } from "react-icons/cg";
import { TbEyeClosed } from "react-icons/tb";
import { toast, Toaster } from "sonner";

export default function PasswordForm() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef("");
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

  const Savepassword = async () => {
    const res = await fetch(`${VITE_BASE_URL}/auth/login/password`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (data.error) {
      toast.error(data.error);
    } else {
      toast.success("Password saved successfully");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password.trim()) {
      toast.error("Enter your password");
      return;
    }
    Savepassword();
  };

  const handlePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
    if (showPassword) {
      passwordRef.current.type = "password";
    } else {
      passwordRef.current.type = "text";
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        {/* Google Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
            alt="Google"
            className="h-8"
          />
        </div>

        <h1 className="text-xl font-medium text-gray-900 mb-2">Welcome</h1>
        <p className="text-sm text-gray-600 mb-6">
          Enter your password to continue
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div
              tabIndex={0}
              className="flex focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 items-center border border-gray-300 rounded-lg pr-4 "
            >
              <input
                type="password"
                ref={passwordRef}
                className="w-full  rounded-lg px-4 py-2   focus:outline-none"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="cursor-pointer"
                onClick={handlePasswordVisibility}
              >
                {showPassword ? <CgEye /> : <TbEyeClosed />}
              </span>
            </div>
            <Toaster richColors position="top-center" />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            save
          </button>
        </form>
      </div>
    </div>
  );
}
