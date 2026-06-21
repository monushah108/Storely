import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { useRegisterMutation } from "../store/slices/UserSlice";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "monu",
    email: "monu@gmail.com",
    password: "1234",
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState({});

  const navigate = useNavigate();

  const [register] = useRegisterMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (userContent) => {
    const data = await register(userContent);
    if (data?.error) {
      console.log(data?.error?.data);
      toast.error("invalid credentials");
      setError(data?.error?.data);
    } else if (data?.data) {
      toast.success("Registration successful!");
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };

  console.log(error);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegister(formData);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Toaster position="top-center" richColors />
      <form
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl space-y-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Create an Account
        </h2>
        <p className="text-center text-sm text-gray-500">
          Sign up to get started 🚀
        </p>

        {/* Username */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            name="name"
            placeholder="Choose a username"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error?.name && <p className="text-red-500 text-sm">{error.name}</p>}
        </div>

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
          {error?.email && (
            <p className="text-red-500 text-sm">{error.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error?.password && (
            <p className="text-red-500 text-sm">{error.password}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={`w-full rounded-lg px-4 py-2 font-semibold text-white shadow-md transition focus:outline-none focus:ring-2 ${
            isSuccess
              ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
              : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
          }`}
        >
          {isSuccess ? "Registration Successful 🎉" : "Register"}
        </button>

        {/* Login link */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
