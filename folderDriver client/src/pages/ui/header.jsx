import { Cloud, Menu } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
            <Cloud className="h-5 w-5 text-white" />
          </div>

          <span className="text-xl font-semibold text-gray-800">Storely</span>
        </div>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-3 sm:flex">
          <button
            onClick={() => navigate("/login")}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Get started
          </button>
        </div>

        {/* Mobile menu */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 sm:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-3 sm:hidden">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate("/login")}
              className="rounded-lg px-4 py-2.5 text-left text-sm text-gray-600 hover:bg-gray-50"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/register")}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white"
            >
              Get started
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
