import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { FaGithub } from "react-icons/fa";
import { Loader } from "lucide-react";
import GoogleBth from "../ui/OauthBth";
import { useLoginMutation } from "../../store/slices/UserSlice";

export default function Login() {
  const [email, setEmail] = useState("sonu@gmail.com");
  const [password, setPassword] = useState("12345678");

  const [login, { isLoading }] = useLoginMutation();

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login({ email, password }).unwrap();
      toast.success("loged in successfuly");
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      const error = err.data.error || err.data.message || "login failed";
      toast.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      {/* <Toaster richColors position="top-center" /> */}
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Login button */}
        <button
          disabled={isLoading}
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-md transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader className="animate-spin h-4 w-4" />
              <span>Logging in...</span>
            </div>
          ) : (
            "Login"
          )}
        </button>

        {/* OR divider */}
        <div className="flex items-center justify-center gap-3">
          <div className="h-px flex-1 bg-gray-300"></div>
          <span className="text-sm text-gray-500">OR</span>
          <div className="h-px flex-1 bg-gray-300"></div>
        </div>

        <div className="flex items-center justify-center gap-2 flex-wrap">
          {/* Google login */}
          <GoogleBth />
          {/* github login  */}
          <button
            onClick={() => {
              window.location.href = `${import.meta.env.CLIENT_URL}/auth/github`;
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
            to="/auth/register"
            className="font-semibold text-blue-600 hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
