import { Cloud } from "lucide-react";
import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600">
            <Cloud className="h-4 w-4 text-white" />
          </div>

          <span className="text-sm font-semibold text-gray-700">Storely</span>
        </div>

        <p className="text-xs text-gray-400">
          © 2026 Storely. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
