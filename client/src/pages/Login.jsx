import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "../Api/loginWithGoogle";
import { toast, Toaster } from "sonner";
import { useLoginMutation } from "../store/slices/UserSlice";
import { FaGithub } from "react-icons/fa";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [login] = useLoginMutation();

  const navigate = useNavigate();

  const handleLogin = async (userContent) => {
    try {
      const data = await login(userContent).unwrap();
      navigate("/");
    } catch (err) {
      toast.error(err.data.error || "login failed");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(formData);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Toaster richColors position="top-center" />
      <form
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl space-y-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Login to Your Account
        </h2>

        {/* Email */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Login button */}
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-md transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Login
        </button>

        {/* OR divider */}
        <div className="flex items-center justify-center gap-3">
          <div className="h-px flex-1 bg-gray-300"></div>
          <span className="text-sm text-gray-500">OR</span>
          <div className="h-px flex-1 bg-gray-300"></div>
        </div>

        <div className="flex items-center justify-center gap-2 flex-wrap">
          {/* Google login */}
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              const data = await loginWithGoogle(credentialResponse.credential);
              if (data.error) {
                toast.error(data.error);
                console.log(data);
                return;
              }
              navigate("/");
            }}
            theme="filled_blue"
            text="continue_with"
            onError={() => {
              toast.error("Login Failed");
            }}
            // useOneTap
          />
          {/* github login  */}
          <button
            onClick={() => {
              window.location.href = "http://localhost:4000/auth/github";
            }}
            className="flex items-center justify-center gap-2 
                 bg-gray-900 text-white rounded-md hover:bg-gray-800 
                 transition-colors  text-sm px-2 py-2.5 cursor-pointer"
          >
            <FaGithub />
            <span>Login with GitHub</span>
          </button>
        </div>

        {/* Signup link */}
        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
